from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from ..models import (
    users_collection, quizzes_collection, submissions_collection,
    violations_collection, flags_collection
)
from bson import ObjectId
from datetime import datetime, timedelta


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
        elif action == 'activate':
            result = users_collection.update_one(
                {'_id': ObjectId(user_id)},
                {'$set': {'status': 'active'}}
            )
        elif action == 'reset-password':
            # Generate temporary password and send email
            # Implementation depends on your email service
            pass
        
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
        # This would come from a dedicated audit_logs collection
        # For now, return mock data
        logs = [
            {
                '_id': '1',
                'action': 'user_ban',
                'admin_id': str(request.user.id) if hasattr(request, 'user') else 'admin1',
                'admin_name': 'Super Admin',
                'target': 'john.doe@example.com',
                'timestamp': datetime.utcnow().isoformat(),
                'details': 'User banned for repeated violations',
            }
        ]
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
        elif action == 'lock':
            result = quizzes_collection.update_one(
                {'_id': ObjectId(exam_id)},
                {'$set': {'locked': True}}
            )
        
        return Response({'success': True})
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
