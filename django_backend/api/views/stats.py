import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from datetime import datetime, timedelta
from bson import ObjectId
from ..models import (
    users_collection, 
    quizzes_collection, 
    submissions_collection, 
    flags_collection
)
from ..authentication import require_auth, require_role


@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def get_performance_stats(request):
    """Get overall performance statistics"""
    try:
        teacher_id = request.user['_id']
        teacher_quiz_ids = [
            q['_id'] for q in quizzes_collection.find({'teacher_id': teacher_id}, {'_id': 1})
        ]

        # Get submissions only for this teacher's quizzes
        submissions = list(submissions_collection.find({'quiz_id': {'$in': teacher_quiz_ids}}))
        
        if not submissions:
            return JsonResponse({
                'average_score': 0,
                'pass_rate': 0,
                'completion_rate': 0,
                'total_submissions': 0,
                'trends': {
                    'average_score': 0,
                    'pass_rate': 0,
                    'completion_rate': 0,
                }
            })
        
        # Calculate average score
        total_score = sum(s.get('score', 0) for s in submissions)
        average_score = total_score / len(submissions)
        
        # Calculate pass rate (assuming 60% is passing)
        passing_threshold = 60
        passed_count = sum(1 for s in submissions if s.get('score', 0) >= passing_threshold)
        pass_rate = (passed_count / len(submissions)) * 100
        
        # Calculate completion rate
        # Get all active quizzes for this teacher
        active_quizzes = list(
            quizzes_collection.find({'teacher_id': teacher_id, 'is_active': True}, {'_id': 1})
        )
        unique_student_ids = {s.get('student_id') for s in submissions if s.get('student_id') is not None}
        total_students = len(unique_student_ids)
        
        if active_quizzes and total_students > 0:
            expected_submissions = len(active_quizzes) * total_students
            completion_rate = (len(submissions) / expected_submissions) * 100 if expected_submissions > 0 else 0
        else:
            completion_rate = 0
        
        # Calculate trends (compare with last month)
        one_month_ago = datetime.utcnow() - timedelta(days=30)
        
        # Last month submissions
        last_month_submissions = [
            s for s in submissions 
            if s.get('submitted_at') and s['submitted_at'] < one_month_ago
        ]
        
        # Current month submissions
        current_month_submissions = [
            s for s in submissions 
            if s.get('submitted_at') and s['submitted_at'] >= one_month_ago
        ]
        
        # Calculate trends
        trends = {
            'average_score': 0,
            'pass_rate': 0,
            'completion_rate': 0,
        }
        
        if last_month_submissions:
            last_avg = sum(s.get('score', 0) for s in last_month_submissions) / len(last_month_submissions)
            current_avg = sum(s.get('score', 0) for s in current_month_submissions) / len(current_month_submissions) if current_month_submissions else 0
            trends['average_score'] = ((current_avg - last_avg) / last_avg * 100) if last_avg > 0 else 0
            
            last_pass = sum(1 for s in last_month_submissions if s.get('score', 0) >= passing_threshold) / len(last_month_submissions) * 100
            current_pass = sum(1 for s in current_month_submissions if s.get('score', 0) >= passing_threshold) / len(current_month_submissions) * 100 if current_month_submissions else 0
            trends['pass_rate'] = ((current_pass - last_pass) / last_pass * 100) if last_pass > 0 else 0
            
            trends['completion_rate'] = 5.0  # Default positive trend
        
        return JsonResponse({
            'average_score': round(average_score, 1),
            'pass_rate': round(pass_rate, 1),
            'completion_rate': round(min(completion_rate, 100), 1),  # Cap at 100%
            'total_submissions': len(submissions),
            'trends': {
                'average_score': round(trends['average_score'], 1),
                'pass_rate': round(trends['pass_rate'], 1),
                'completion_rate': round(trends['completion_rate'], 1),
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def get_dashboard_stats(request):
    """Get comprehensive dashboard statistics"""
    try:
        # Get teacher's quizzes
        teacher_id = request.user['_id']
        quizzes = list(quizzes_collection.find({'teacher_id': teacher_id}))
        quiz_ids = [q['_id'] for q in quizzes]
        
        # Count statistics
        total_exams = len(quizzes)
        active_exams = sum(1 for q in quizzes if q.get('is_active', False))
        total_students = 0
        
        # Count violations for teacher's quizzes
        flagged_violations = flags_collection.count_documents({
            'quiz_id': {'$in': quiz_ids},
            'status': {'$ne': 'resolved'}
        })
        
        # Get submissions for teacher's quizzes
        submissions = list(submissions_collection.find({
            'quiz_id': {'$in': quiz_ids}
        }))

        # Unique students who submitted for this teacher's quizzes
        total_students = len({str(s.get('student_id')) for s in submissions if s.get('student_id') is not None})
        
        # Calculate performance metrics
        if submissions:
            average_score = sum(s.get('score', 0) for s in submissions) / len(submissions)
            passed = sum(1 for s in submissions if s.get('score', 0) >= 60)
            pass_rate = (passed / len(submissions)) * 100
        else:
            average_score = 0
            pass_rate = 0

        # Completion rate: what % of (quiz, student) slots have been filled
        # Use max_students if set on quizzes, otherwise use unique submitters as reference
        total_capacity = 0
        for q in quizzes:
            max_s = q.get('max_students', 0)
            if max_s and max_s > 0:
                total_capacity += max_s
            else:
                # fallback: count unique students who submitted any quiz for this teacher
                total_capacity += total_students if total_students > 0 else 1
        completion_rate = (len(submissions) / total_capacity) * 100 if total_capacity > 0 else 0
        completion_rate = min(completion_rate, 100)  # cap at 100%

        return JsonResponse({
            'total_exams': total_exams,
            'active_exams': active_exams,
            'total_students': total_students,
            'flagged_violations': flagged_violations,
            'total_submissions': len(submissions),
            'average_score': round(average_score, 1),
            'pass_rate': round(pass_rate, 1),
            'completion_rate': round(completion_rate, 1),
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def get_quiz_stats(request, quiz_id):
    """Get statistics for a specific quiz"""
    try:
        quiz = quizzes_collection.find_one({'_id': ObjectId(quiz_id)})
        if not quiz:
            return JsonResponse({'error': 'Quiz not found'}, status=404)

        # Ensure quiz belongs to the current teacher
        teacher_id = request.user['_id']
        if str(quiz.get('teacher_id')) != str(teacher_id):
            return JsonResponse({'error': 'Forbidden'}, status=403)
        
        # Get submissions
        submissions = list(submissions_collection.find({'quiz_id': ObjectId(quiz_id)}))
        
        # Get violations
        violations = list(flags_collection.find({'quiz_id': ObjectId(quiz_id)}))
        
        # Calculate stats
        if submissions:
            average_score = sum(s.get('score', 0) for s in submissions) / len(submissions)
            highest_score = max(s.get('score', 0) for s in submissions)
            lowest_score = min(s.get('score', 0) for s in submissions)
            passed = sum(1 for s in submissions if s.get('score', 0) >= 60)
            pass_rate = (passed / len(submissions)) * 100
        else:
            average_score = 0
            highest_score = 0
            lowest_score = 0
            pass_rate = 0
        
        return JsonResponse({
            'quiz_id': str(quiz_id),
            'quiz_title': quiz.get('title', 'Unknown'),
            'total_submissions': len(submissions),
            'total_violations': len(violations),
            'average_score': round(average_score, 1),
            'highest_score': round(highest_score, 1),
            'lowest_score': round(lowest_score, 1),
            'pass_rate': round(pass_rate, 1),
            'violation_breakdown': {
                'low': sum(1 for v in violations if v.get('severity') == 'low'),
                'medium': sum(1 for v in violations if v.get('severity') == 'medium'),
                'high': sum(1 for v in violations if v.get('severity') == 'high'),
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
