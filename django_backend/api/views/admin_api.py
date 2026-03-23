from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import (
    users_collection, quizzes_collection, submissions_collection,
    violations_collection, flags_collection
)
from bson import ObjectId
from datetime import datetime, timedelta


def _write_audit_log(action, target_id, request, details=''):
    """Helper to write an audit log entry"""
    try:
        from ..models import db
        db['audit_logs'].insert_one({
            'action': action,
            'admin_id': str(request.user.get('_id', 'unknown')) if hasattr(request, 'user') else 'unknown',
            'admin_name': request.user.get('name', 'Admin') if hasattr(request, 'user') else 'Admin',
            'target': str(target_id),
            'timestamp': datetime.utcnow(),
            'details': details,
        })
    except Exception:
        pass  # Audit logging should never break the main action


@api_view(['GET'])
def dashboard_stats(request):
    """Get dashboard statistics for super admin"""
    try:
        stats = {
            'totalUsers': users_collection.count_documents({}),
            'totalStudents': users_collection.count_documents({'role': 'student'}),
            'totalTeachers': users_collection.count_documents({'role': 'teacher'}),
            'activeExams': quizzes_collection.count_documents({'status': 'active'}),
            'institutions': 0,  # Placeholder
            'violationsToday': violations_collection.count_documents({
                'timestamp': {'$gte': datetime.utcnow().replace(hour=0, minute=0, second=0)}
            }),
        }
        return Response(stats)
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def users_list(request):
    """Get all users with filtering"""
    try:
        users = list(users_collection.find())
        
        # Convert ObjectId to string
        for user in users:
            user['_id'] = str(user['_id'])
            user.pop('password', None)  # Remove password from response
        
        return Response({'users': users})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def user_action(request, user_id, action):
    """Perform action on user (deactivate, reset password, etc.)"""
    try:
        if action == 'deactivate':
            result = users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'status': 'inactive'}}
            )
            _write_audit_log('deactivate_user', user_id, request)
        elif action == 'activate':
            result = users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'status': 'active'}}
            )
            _write_audit_log('activate_user', user_id, request)
        elif action == 'reset-password':
            import secrets
            import string
            temp_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))
            import bcrypt
            hashed = bcrypt.hashpw(temp_password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'password': hashed, 'must_change_password': True}}
            )
            # Log the action
            from ..models import db
            db['audit_logs'].insert_one({
                'action': 'reset_password',
                'admin_id': str(request.user.get('_id', 'admin')),
                'target_user_id': user_id,
                'timestamp': datetime.utcnow(),
                'details': 'Password reset by admin',
                'temp_password': temp_password,  # In production: send via email instead
            })
            return Response({'success': True, 'temp_password': temp_password})
        
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def violations_list(request):
    """Get all violations with filtering"""
    try:
        violations = list(violations_collection.find().sort('timestamp', -1).limit(100))
        
        # Enrich with user and quiz data
        for violation in violations:
            violation['_id'] = str(violation['_id'])
            violation['quiz_id'] = str(violation['quiz_id'])
            violation['student_id'] = str(violation['student_id'])
            
            # Get student name
            student = users_collection.find_one({'_id': violation['student_id']})
            violation['student_name'] = student['name'] if student else 'Unknown'
            
            # Get exam title
            quiz = quizzes_collection.find_one({'_id': violation['quiz_id']})
            violation['exam_title'] = quiz['title'] if quiz else 'Unknown'
            
            # Convert timestamp
            if 'timestamp' in violation and violation['timestamp']:
                violation['timestamp'] = violation['timestamp'].isoformat()
        
        return Response({'violations': violations})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def audit_logs(request):
    """Get audit logs (admin actions)"""
    try:
        from ..models import db
        audit_collection = db['audit_logs']
        logs = list(audit_collection.find().sort('timestamp', -1).limit(100))
        for log in logs:
            log['_id'] = str(log['_id'])
            if 'timestamp' in log and hasattr(log['timestamp'], 'isoformat'):
                log['timestamp'] = log['timestamp'].isoformat()
        return Response({'logs': logs})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'POST'])
def system_settings(request):
    """Get or update system settings"""
    try:
        if request.method == 'GET':
            # Fetch from settings collection or return defaults
            settings = {
                'violationThreshold': 5,
                'autoSubmitEnabled': True,
                'autoSubmitThreshold': 10,
                'aiSensitivity': 'medium',
                'maintenanceMode': False,
                'emailNotifications': True,
                'sessionTimeout': 30,
            }
            return Response(settings)
        
        elif request.method == 'POST':
            # Save settings to database
            # Implementation depends on your settings storage
            return Response({'success': True})
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def exams_list(request):
    """Get all exams across all teachers"""
    try:
        exams = list(quizzes_collection.find().sort('created_at', -1))
        
        for exam in exams:
            exam['_id'] = str(exam['_id'])
            exam['teacher_id'] = str(exam['teacher_id'])
            
            # Get teacher name
            teacher = users_collection.find_one({'_id': ObjectId(exam['teacher_id'])})
            exam['teacher_name'] = teacher['name'] if teacher else 'Unknown'
        
        return Response({'exams': exams})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def exam_action(request, exam_id, action):
    """Perform action on exam (force stop, lock, etc.)"""
    try:
        if action == 'force-stop':
            result = quizzes_collection.update_one(
                {'_id': ObjectId(exam_id)},
                {'$set': {'status': 'stopped', 'stopped_by_admin': True}}
            )
            _write_audit_log('force_stop_exam', exam_id, request, 'Exam force-stopped by admin')
        elif action == 'lock':
            result = quizzes_collection.update_one(
                {'_id': ObjectId(exam_id)},
                {'$set': {'locked': True}}
            )
            _write_audit_log('lock_exam', exam_id, request, 'Exam locked by admin')
        
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
