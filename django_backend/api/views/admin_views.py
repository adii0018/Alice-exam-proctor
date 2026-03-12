from django.contrib.admin.views.decorators import staff_member_required
from django.shortcuts import render
from django.http import JsonResponse
from ..models import (
    users_collection, quizzes_collection, submissions_collection,
    flags_collection, violations_collection
)
from bson import ObjectId


@staff_member_required
def admin_dashboard(request):
    """Admin dashboard with MongoDB statistics"""
    stats = {
        'total_users': users_collection.count_documents({}),
        'total_students': users_collection.count_documents({'role': 'student'}),
        'total_teachers': users_collection.count_documents({'role': 'teacher'}),
        'total_quizzes': quizzes_collection.count_documents({}),
        'total_submissions': submissions_collection.count_documents({}),
        'total_violations': violations_collection.count_documents({}),
        'total_flags': flags_collection.count_documents({}),
    }
    
    # Get recent users
    recent_users = list(users_collection.find().sort('_id', -1).limit(10))
    
    # Get recent quizzes
    recent_quizzes = list(quizzes_collection.find().sort('_id', -1).limit(10))
    
    # Get recent violations
    recent_violations = list(violations_collection.find().sort('timestamp', -1).limit(10))
    
    context = {
        'stats': stats,
        'recent_users': recent_users,
        'recent_quizzes': recent_quizzes,
        'recent_violations': recent_violations,
    }
    
    return render(request, 'admin/custom_dashboard.html', context)


@staff_member_required
def admin_users_list(request):
    """List all users"""
    users = list(users_collection.find())
    for user in users:
        user['_id'] = str(user['_id'])
    return JsonResponse({'users': users})


@staff_member_required
def admin_quizzes_list(request):
    """List all quizzes"""
    quizzes = list(quizzes_collection.find())
    for quiz in quizzes:
        quiz['_id'] = str(quiz['_id'])
    return JsonResponse({'quizzes': quizzes})


@staff_member_required
def admin_violations_list(request):
    """List all violations"""
    violations = list(violations_collection.find().sort('timestamp', -1))
    for violation in violations:
        violation['_id'] = str(violation['_id'])
        violation['quiz_id'] = str(violation['quiz_id'])
        violation['student_id'] = str(violation['student_id'])
        if 'timestamp' in violation:
            violation['timestamp'] = violation['timestamp'].isoformat()
    return JsonResponse({'violations': violations})


@staff_member_required
def admin_delete_user(request, user_id):
    """Delete a user"""
    if request.method == 'POST':
        result = users_collection.delete_one({'_id': ObjectId(user_id)})
        return JsonResponse({'success': result.deleted_count > 0})
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@staff_member_required
def admin_delete_quiz(request, quiz_id):
    """Delete a quiz"""
    if request.method == 'POST':
        result = quizzes_collection.delete_one({'_id': ObjectId(quiz_id)})
        return JsonResponse({'success': result.deleted_count > 0})
    return JsonResponse({'error': 'Method not allowed'}, status=405)
