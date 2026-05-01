import json
from datetime import datetime

from asgiref.sync import async_to_sync
from bson import ObjectId
from channels.layers import get_channel_layer
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from ..authentication import require_auth, require_role
from ..models import Quiz, Submission


def serialize_quiz(quiz):
    """Convert MongoDB quiz to JSON-serializable format"""
    quiz_id = str(quiz['_id'])
    quiz['_id'] = quiz_id
    quiz['id'] = quiz_id  # Add 'id' field for frontend compatibility
    quiz['teacher_id'] = str(quiz['teacher_id'])
    return quiz


def _broadcast_quiz_submission_to_teacher(quiz, quiz_id, student_user, submission_id, score, correct, total):
    """Push live result to teacher WebSocket; never raises (submit must always succeed)."""
    try:
        channel_layer = get_channel_layer()
        if not channel_layer:
            return
        tid = quiz.get('teacher_id')
        if tid is None:
            return
        group = f'teacher_monitor_{str(tid)}'
        student_name = (
            student_user.get('name')
            or student_user.get('username')
            or 'Unknown Student'
        )
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


@csrf_exempt
@require_auth
def quizzes_handler(request):
    """Handle both GET (list) and POST (create) for /quizzes/"""
    if request.method == 'GET':
        try:
            role = (request.user.get('role') or '').strip().lower()
            if role == 'teacher':
                quizzes = Quiz.find_all(request.user['_id'])
            else:
                quizzes = Quiz.find_all()
            
            return JsonResponse([serialize_quiz(q) for q in quizzes], safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'POST':
        # Check if user is teacher
        if request.user['role'] != 'teacher':
            return JsonResponse({'error': 'Only teachers can create quizzes'}, status=403)
        
        try:
            data = json.loads(request.body)
            title = data.get('title')
            description = data.get('description', '')
            duration = data.get('duration', 30)
            questions = data.get('questions', [])
            max_students = data.get('max_students', 0)  # 0 = unlimited
            
            if not title or not questions:
                return JsonResponse({'error': 'Missing required fields'}, status=400)
            
            quiz = Quiz.create(title, description, duration, questions, request.user['_id'], max_students)
            
            return JsonResponse(serialize_quiz(quiz))
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_quiz(request, quiz_id):
    try:
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            return JsonResponse({'error': 'Quiz not found'}, status=404)

        # Students must not be able to fetch draft/inactive quiz content by ID.
        if request.user.get('role') == 'student' and not quiz.get('is_active', False):
            return JsonResponse({'error': 'This quiz is not active. Please contact your teacher.'}, status=403)
        
        return JsonResponse(serialize_quiz(quiz))
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_quiz_by_code(request, code):
    try:
        quiz = Quiz.find_by_code(code)
        if not quiz:
            return JsonResponse({'error': 'Quiz not found'}, status=404)
        
        # Students can only join active quizzes
        if request.user['role'] == 'student' and not quiz.get('is_active', False):
            return JsonResponse({'error': 'This quiz is not active. Please contact your teacher.'}, status=403)
        
        if request.user['role'] == 'student':
            quiz_id = str(quiz['_id'])
            student_id = str(request.user['_id'])

            # ✅ Check: One attempt per student
            if Submission.has_student_submitted(quiz_id, student_id):
                return JsonResponse(
                    {'error': 'Aapne yeh quiz pehle se de diya hai. Ek student sirf ek baar quiz de sakta hai.'},
                    status=403
                )

            # ✅ Check: Max students quota
            max_students = quiz.get('max_students', 0)
            if max_students and max_students > 0:
                submission_count = Submission.count_submissions_for_quiz(quiz_id)
                if submission_count >= max_students:
                    return JsonResponse(
                        {'error': f'Yeh quiz full ho gayi hai. Maximum {max_students} students allowed hain.'},
                        status=403
                    )
        
        return JsonResponse(serialize_quiz(quiz))
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@require_role('teacher')
def toggle_quiz_active(request, quiz_id):
    try:
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            return JsonResponse({'error': 'Quiz not found'}, status=404)
        
        if str(quiz['teacher_id']) != str(request.user['_id']):
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        
        new_status = not quiz.get('is_active', False)
        Quiz.update(quiz_id, {'is_active': new_status})
        
        return JsonResponse({'is_active': new_status, 'message': f"Quiz {'activated' if new_status else 'deactivated'} successfully"})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def submit_quiz(request, quiz_id):
    try:
        data = json.loads(request.body)
        answers = data.get('answers', {})
        proctoring_report = data.get('proctoringReport', {})
        time_spent = data.get('timeSpent', 0)

        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            return JsonResponse({'error': 'Quiz not found'}, status=404)

        # Check if user is a student (case-insensitive)
        user_role = (request.user.get('role') or '').strip().lower()
        if user_role != 'student':
            return JsonResponse({'error': 'Only students can submit quizzes'}, status=403)

        if not quiz.get('is_active', False):
            return JsonResponse({'error': 'This quiz is not active. Please contact your teacher.'}, status=403)

        student_id = str(request.user['_id'])

        # ✅ Double-check: One attempt per student (prevent duplicate submissions)
        if Submission.has_student_submitted(quiz_id, student_id):
            return JsonResponse(
                {'error': 'Aapne yeh quiz pehle se submit kar diya hai. Duplicate submission allowed nahi hai.'},
                status=403
            )

        # ✅ Double-check: Max students quota before saving
        max_students = quiz.get('max_students', 0)
        if max_students and max_students > 0:
            submission_count = Submission.count_submissions_for_quiz(quiz_id)
            if submission_count >= max_students:
                return JsonResponse(
                    {'error': f'Yeh quiz full ho gayi hai. Maximum {max_students} students allowed hain.'},
                    status=403
                )

        # Calculate score
        correct = 0
        for idx, question in enumerate(quiz['questions']):
            q_id = str(question.get('_id') or question.get('id') or idx)
            submitted = answers.get(q_id)
            expected = question.get('correctAnswer')

            # Normalize numeric answers (common path: option index based checking)
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

            # Fallback path for legacy text-based answers
            if submitted == expected:
                correct += 1

        score = (correct / len(quiz['questions'])) * 100 if quiz['questions'] else 0

        submission_id = Submission.create(
            ObjectId(quiz_id),
            request.user['_id'],
            answers,
            score,
            proctoring_report=proctoring_report,
            time_spent=time_spent,
        )

        _broadcast_quiz_submission_to_teacher(
            quiz,
            quiz_id,
            request.user,
            submission_id,
            score,
            correct,
            len(quiz['questions']),
        )

        return JsonResponse({
            'submission_id': str(submission_id),
            'score': score,
            'correct': correct,
            'total': len(quiz['questions'])
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["DELETE"])
@require_role('teacher')
def delete_quiz(request, quiz_id):
    try:
        result = Quiz.delete(quiz_id)
        if result.deleted_count == 0:
            return JsonResponse({'error': 'Quiz not found'}, status=404)
        
        return JsonResponse({'message': 'Quiz deleted successfully'})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT"])
@require_role('teacher')
def update_quiz(request, quiz_id):
    try:
        data = json.loads(request.body)
        
        # Get the quiz to verify it exists and belongs to the teacher
        quiz = Quiz.find_by_id(quiz_id)
        if not quiz:
            return JsonResponse({'error': 'Quiz not found'}, status=404)
        
        # Check if the teacher owns this quiz
        if str(quiz['teacher_id']) != str(request.user['_id']):
            return JsonResponse({'error': 'Unauthorized'}, status=403)
        
        # Prepare update data
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
        
        # Update the quiz
        result = Quiz.update(quiz_id, update_data)
        
        if result.modified_count == 0 and result.matched_count == 0:
            return JsonResponse({'error': 'Quiz not found'}, status=404)
        
        # Get updated quiz
        updated_quiz = Quiz.find_by_id(quiz_id)
        return JsonResponse(serialize_quiz(updated_quiz))
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
