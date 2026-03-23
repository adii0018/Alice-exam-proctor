from pymongo import MongoClient
from django.conf import settings
from bson import ObjectId
import secrets
import string

client = MongoClient(settings.MONGODB_URI)
db = client[settings.MONGODB_DB]

# Collections
users_collection = db['users']
quizzes_collection = db['quizzes']
submissions_collection = db['submissions']
flags_collection = db['flags']
violations_collection = db['violations']

# Indexes
users_collection.create_index('email', unique=True)
quizzes_collection.create_index('code', unique=True)


def generate_quiz_code():
    """Generate a unique 6-character quiz code"""
    while True:
        code = ''.join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(6))
        if not quizzes_collection.find_one({'code': code}):
            return code


class User:
    @staticmethod
    def create(name, email, password_hash, role='student'):
        user = {
            'name': name,
            'email': email,
            'password': password_hash,
            'role': role,
            'phone': None,
            'location': None,
            'bio': None,
            'date_of_birth': None,
            'department': None,
            'profile_picture': None,
            'created_at': None
        }
        result = users_collection.insert_one(user)
        user['_id'] = result.inserted_id
        return user

    @staticmethod
    def find_by_email(email):
        return users_collection.find_one({'email': email})

    @staticmethod
    def find_by_id(user_id):
        return users_collection.find_one({'_id': ObjectId(user_id)})

    @staticmethod
    def update_profile(user_id, update_data):
        """Update user profile information"""
        allowed_fields = ['name', 'phone', 'location', 'bio', 'date_of_birth', 'department', 'profile_picture']
        update_dict = {k: v for k, v in update_data.items() if k in allowed_fields}
        
        if update_dict:
            result = users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': update_dict}
            )
            return result.modified_count > 0
        return False


class Quiz:
    @staticmethod
    def create(title, description, duration, questions, teacher_id):
        quiz = {
            'title': title,
            'description': description,
            'duration': duration,
            'questions': questions,
            'teacher_id': teacher_id,
            'code': generate_quiz_code(),
            'is_active': False,
            'created_at': None
        }
        result = quizzes_collection.insert_one(quiz)
        quiz['_id'] = result.inserted_id
        return quiz

    @staticmethod
    def find_all(teacher_id=None):
        query = {'teacher_id': teacher_id} if teacher_id else {}
        return list(quizzes_collection.find(query))

    @staticmethod
    def find_by_id(quiz_id):
        return quizzes_collection.find_one({'_id': ObjectId(quiz_id)})

    @staticmethod
    def find_by_code(code):
        return quizzes_collection.find_one({'code': code.upper()})

    @staticmethod
    def delete(quiz_id):
        return quizzes_collection.delete_one({'_id': ObjectId(quiz_id)})

    @staticmethod
    def update(quiz_id, update_data):
        return quizzes_collection.update_one(
            {'_id': ObjectId(quiz_id)},
            {'$set': update_data}
        )


class Submission:
    @staticmethod
    def create(quiz_id, student_id, answers, score, proctoring_report=None, time_spent=0):
        from datetime import datetime
        submission = {
            'quiz_id': quiz_id,
            'student_id': student_id,
            'answers': answers,
            'score': score,
            'proctoring_report': proctoring_report or {},
            'time_spent': time_spent,
            'submitted_at': datetime.utcnow(),
        }
        result = submissions_collection.insert_one(submission)
        return result.inserted_id


class Flag:
    @staticmethod
    def create(quiz_id, student_id, flag_type, severity, timestamp):
        flag = {
            'quiz_id': quiz_id,
            'student_id': student_id,
            'type': flag_type,
            'severity': severity,
            'timestamp': timestamp,
            'status': 'pending'
        }
        result = flags_collection.insert_one(flag)
        return result.inserted_id

    @staticmethod
    def find_all():
        return list(flags_collection.find())

    @staticmethod
    def update_status(flag_id, status):
        return flags_collection.update_one(
            {'_id': ObjectId(flag_id)},
            {'$set': {'status': status}}
        )


class Violation:
    @staticmethod
    def create(quiz_id, student_id, violation_type, face_count=None, severity='medium', metadata=None):
        """Create a new violation record"""
        from datetime import datetime
        
        violation = {
            'quiz_id': ObjectId(quiz_id) if isinstance(quiz_id, str) else quiz_id,
            'student_id': ObjectId(student_id) if isinstance(student_id, str) else student_id,
            'violation_type': violation_type,
            'face_count': face_count,
            'severity': severity,
            'timestamp': datetime.utcnow(),
            'metadata': metadata or {},
            'status': 'active'
        }
        result = violations_collection.insert_one(violation)
        violation['_id'] = result.inserted_id
        return violation

    @staticmethod
    def find_by_quiz(quiz_id):
        """Get all violations for a specific quiz"""
        return list(violations_collection.find({
            'quiz_id': ObjectId(quiz_id) if isinstance(quiz_id, str) else quiz_id
        }).sort('timestamp', -1))

    @staticmethod
    def find_by_student(student_id, quiz_id=None):
        """Get all violations for a specific student"""
        query = {
            'student_id': ObjectId(student_id) if isinstance(student_id, str) else student_id
        }
        if quiz_id:
            query['quiz_id'] = ObjectId(quiz_id) if isinstance(quiz_id, str) else quiz_id
        
        return list(violations_collection.find(query).sort('timestamp', -1))

    @staticmethod
    def count_by_student_and_quiz(student_id, quiz_id):
        """Count violations for a student in a specific quiz"""
        return violations_collection.count_documents({
            'student_id': ObjectId(student_id) if isinstance(student_id, str) else student_id,
            'quiz_id': ObjectId(quiz_id) if isinstance(quiz_id, str) else quiz_id
        })

    @staticmethod
    def find_recent(limit=50):
        """Get recent violations across all quizzes"""
        return list(violations_collection.find().sort('timestamp', -1).limit(limit))
