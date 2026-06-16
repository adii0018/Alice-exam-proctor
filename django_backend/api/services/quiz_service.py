from datetime import datetime
from asgiref.sync import async_to_sync
from bson import ObjectId
from channels.layers import get_channel_layer
from ..models import Quiz, Submission

class QuizService:
    @staticmethod
    def serialize_quiz(quiz):
        quiz_id = str(quiz['_id'])
        quiz['_id'] = quiz_id
        quiz['id'] = quiz_id
        quiz['teacher_id'] = str(quiz['teacher_id'])
        return quiz

    @staticmethod
    def _broadcast_quiz_submission_to_teacher(quiz, quiz_id, student_user, submission_id, score, correct, total):
        try:
            channel_layer = get_channel_layer()
            if not channel_layer:
                return
            tid = quiz.get('teacher_id')
            if tid is None:
                return
            group = f'teacher_monitor_{str(tid)}'
            student_name = student_user.get('name') or student_user.get('username') or 'Unknown Student'
            payload = {
                'submission_id': str(submission_id),
                'quiz_id': str(quiz_id),
                'quiz_title': quiz.get('title') or '',
                'student_id': str(student_user['_id']),
                'student_name': student_name,
                'student_email': student_user.get('email', ''),
                'score': round(float(score), 1),
                'correct_answers': int(correct),
                'total_questions': int(total),
                'submitted_at': datetime.utcnow().isoformat() + 'Z',
            }
            async_to_sync(channel_layer.group_send)(
                group,
                {'type': 'submission_broadcast', 'submission': payload},
            )
        except Exception:
            pass

    @staticmethod
    def get_quizzes(user):
        role = (user.get('role') or '').strip().lower()
        if role == 'teacher':
            quizzes = Quiz.find_all(user['_id'])
        else:
            quizzes = Quiz.find_all()
        return [QuizService.serialize_quiz(q) for q in quizzes]

    @staticmethod
    def create_quiz(user, data):
        if user['role'] != 'teacher':
            raise PermissionError('Only teachers can create quizzes')
        
        title = data.get('title')
        description = data.get('description', '')
        duration = data.get('duration', 30)
        questions = data.get('questions', [])
        max_students = data.get('max_students', 0)
        
        if not title or not questions:
            raise ValueError('Missing required fields')
        
        quiz = Quiz.create(title, description, duration, questions, user['_id'], max_students)
        return QuizService.serialize_quiz(quiz)

    @staticmethod
    def get_quiz(user, quiz_id):
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            raise KeyError('Quiz not found')

        if user.get('role') == 'student' and not quiz.get('is_active', False):
            raise PermissionError('This quiz is not active. Please contact your teacher.')
        
        return QuizService.serialize_quiz(quiz)

    @staticmethod
    def get_quiz_by_code(user, code):
        quiz = Quiz.find_by_code(code)
        if not quiz:
            raise KeyError('Quiz not found')
        
        if user['role'] == 'student' and not quiz.get('is_active', False):
            raise PermissionError('This quiz is not active. Please contact your teacher.')
        
        if user['role'] == 'student':
            quiz_id = str(quiz['_id'])
            student_id = str(user['_id'])

            if Submission.has_student_submitted(quiz_id, student_id):
                raise PermissionError('Aapne yeh quiz pehle se de diya hai. Ek student sirf ek baar quiz de sakta hai.')

            max_students = quiz.get('max_students', 0)
            if max_students and max_students > 0:
                submission_count = Submission.count_submissions_for_quiz(quiz_id)
                if submission_count >= max_students:
                    raise PermissionError(f'Yeh quiz full ho gayi hai. Maximum {max_students} students allowed hain.')
        
        return QuizService.serialize_quiz(quiz)

    @staticmethod
    def toggle_quiz_active(user, quiz_id):
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            raise KeyError('Quiz not found')
        
        if str(quiz['teacher_id']) != str(user['_id']):
            raise PermissionError('Unauthorized')
        
        new_status = not quiz.get('is_active', False)
        Quiz.update(quiz_id, {'is_active': new_status})
        return new_status

    @staticmethod
    def submit_quiz(user, quiz_id, answers, proctoring_report, time_spent):
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            raise KeyError('Quiz not found')

        if user.get('role') == 'student' and not quiz.get('is_active', False):
            raise PermissionError('This quiz is not active. Please contact your teacher.')

        student_id = str(user['_id'])

        if Submission.has_student_submitted(quiz_id, student_id):
            raise PermissionError('Aapne yeh quiz pehle se submit kar diya hai. Duplicate submission allowed nahi hai.')

        max_students = quiz.get('max_students', 0)
        if max_students and max_students > 0:
            submission_count = Submission.count_submissions_for_quiz(quiz_id)
            if submission_count >= max_students:
                raise PermissionError(f'Yeh quiz full ho gayi hai. Maximum {max_students} students allowed hain.')

        correct = 0
        for idx, question in enumerate(quiz['questions']):
            q_id = str(question.get('_id') or question.get('id') or idx)
            submitted = answers.get(q_id)
            expected = question.get('correctAnswer')

            try:
                submitted_num = int(submitted)
            except (TypeError, ValueError):
                submitted_num = None
            try:
                expected_num = int(expected)
            except (TypeError, ValueError):
                expected_num = None

            if submitted_num is not None and expected_num is not None and submitted_num == expected_num:
                correct += 1
                continue

            if submitted == expected:
                correct += 1

        score = (correct / len(quiz['questions'])) * 100 if quiz['questions'] else 0

        submission_id = Submission.create(
            ObjectId(quiz_id),
            user['_id'],
            answers,
            score,
            proctoring_report=proctoring_report,
            time_spent=time_spent,
        )

        QuizService._broadcast_quiz_submission_to_teacher(
            quiz, quiz_id, user, submission_id, score, correct, len(quiz['questions'])
        )

        return str(submission_id), score, correct, len(quiz['questions'])

    @staticmethod
    def delete_quiz(quiz_id):
        result = Quiz.delete(quiz_id)
        if result.deleted_count == 0:
            raise KeyError('Quiz not found')

    @staticmethod
    def update_quiz(user, quiz_id, data):
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            raise KeyError('Quiz not found')
        
        if str(quiz['teacher_id']) != str(user['_id']):
            raise PermissionError('Unauthorized')
        
        update_data = {}
        if 'title' in data:
            update_data['title'] = data['title']
        if 'description' in data:
            update_data['description'] = data['description']
        if 'duration' in data:
            update_data['duration'] = data['duration']
        if 'questions' in data:
            update_data['questions'] = data['questions']
        if 'status' in data:
            update_data['status'] = data['status']
        if 'max_students' in data:
            update_data['max_students'] = int(data['max_students']) if data['max_students'] else 0
        
        result = Quiz.update(quiz_id, update_data)
        
        if result.modified_count == 0 and result.matched_count == 0:
            raise KeyError('Quiz not found')
        
        updated_quiz = Quiz.find_by_id(quiz_id)
        return QuizService.serialize_quiz(updated_quiz)
