import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from bson import ObjectId
from ..models import users_collection, quizzes_collection, submissions_collection, flags_collection
from ..authentication import require_auth, require_role


def serialize_user(user):
    """Convert MongoDB user to JSON-serializable format"""
    user['_id'] = str(user['_id'])
    return user


@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def list_students(request):
    """Get all students with their exam participation data"""
    try:
        # Get all students
        students = list(users_collection.find({'role': 'student'}))
        
        result = []
        for student in students:
            student_id = student['_id']
            
            # Count exams taken (submissions)
            exams_taken = submissions_collection.count_documents({
                'student_id': student_id
            })
            
            # Count violations
            violations_count = flags_collection.count_documents({
                'student_id': student_id
            })
            
            # Get last submission for last active time
            last_submission = submissions_collection.find_one(
                {'student_id': student_id},
                sort=[('submitted_at', -1)]
            )
            
            last_active = None
            if last_submission and last_submission.get('submitted_at'):
                last_active = last_submission['submitted_at'].isoformat()
            elif student.get('createdAt'):
                last_active = student['createdAt'].isoformat()
            
            result.append({
                '_id': str(student_id),
                'name': student.get('name', 'Unknown'),
                'email': student.get('email', 'N/A'),
                'exams_taken': exams_taken,
                'violations': violations_count,
                'last_active': last_active,
                'created_at': student.get('createdAt').isoformat() if student.get('createdAt') else None,
            })
        
        return JsonResponse(result, safe=False)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def get_student_details(request, student_id):
    """Get detailed information about a specific student"""
    try:
        student = users_collection.find_one({'_id': ObjectId(student_id)})
        if not student:
            return JsonResponse({'error': 'Student not found'}, status=404)
        
        # Get all submissions
        submissions = list(submissions_collection.find({
            'student_id': ObjectId(student_id)
        }).sort('submitted_at', -1))
        
        # Get all violations
        violations = list(flags_collection.find({
            'student_id': ObjectId(student_id)
        }).sort('timestamp', -1))
        
        # Enrich submissions with quiz titles
        for submission in submissions:
            quiz = quizzes_collection.find_one({'_id': submission['quiz_id']})
            submission['quiz_title'] = quiz.get('title', 'Unknown') if quiz else 'Unknown'
            submission['_id'] = str(submission['_id'])
            submission['quiz_id'] = str(submission['quiz_id'])
            submission['student_id'] = str(submission['student_id'])
            if submission.get('submitted_at'):
                submission['submitted_at'] = submission['submitted_at'].isoformat()
        
        # Enrich violations with quiz titles
        for violation in violations:
            quiz = quizzes_collection.find_one({'_id': violation['quiz_id']})
            violation['quiz_title'] = quiz.get('title', 'Unknown') if quiz else 'Unknown'
            violation['_id'] = str(violation['_id'])
            violation['quiz_id'] = str(violation['quiz_id'])
            violation['student_id'] = str(violation['student_id'])
            if violation.get('timestamp'):
                violation['timestamp'] = violation['timestamp'].isoformat()
        
        return JsonResponse({
            'student': serialize_user(student),
            'submissions': submissions,
            'violations': violations,
            'stats': {
                'total_exams': len(submissions),
                'total_violations': len(violations),
                'average_score': sum(s.get('score', 0) for s in submissions) / len(submissions) if submissions else 0,
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_students_count(request):
    """Get total count of students"""
    try:
        count = users_collection.count_documents({'role': 'student'})
        return JsonResponse({'count': count})
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
