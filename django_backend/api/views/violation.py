import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from bson import ObjectId
from datetime import datetime
from ..models import Violation, User, Quiz
from ..authentication import require_auth


def serialize_violation(violation):
    """Convert MongoDB violation to JSON-serializable format"""
    return {
        '_id': str(violation['_id']),
        'quiz_id': str(violation['quiz_id']),
        'student_id': str(violation['student_id']),
        'violation_type': violation['violation_type'],
        'face_count': violation.get('face_count'),
        'severity': violation['severity'],
        'timestamp': violation['timestamp'].isoformat() if isinstance(violation['timestamp'], datetime) else violation['timestamp'],
        'metadata': violation.get('metadata', {}),
        'status': violation.get('status', 'active')
    }


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def create_violation(request):
    """
    Create a new violation record
    POST /api/violations/
    Body: {
        "quiz_id": "...",
        "violation_type": "MULTIPLE_FACES",
        "face_count": 2,
        "severity": "medium",
        "metadata": {}
    }
    """
    try:
        data = json.loads(request.body)
        quiz_id = data.get('quiz_id')
        violation_type = data.get('violation_type')
        face_count = data.get('face_count')
        severity = data.get('severity', 'medium')
        metadata = data.get('metadata', {})
        
        if not all([quiz_id, violation_type]):
            return JsonResponse({
                'error': 'Missing required fields: quiz_id, violation_type'
            }, status=400)
        
        # Validate violation type
        valid_types = [
            'MULTIPLE_FACES', 
            'NO_FACE', 
            'TAB_SWITCH', 
            'FULLSCREEN_EXIT', 
            'SUSPICIOUS_BEHAVIOR',
            'LOOKING_AWAY'
        ]
        if violation_type not in valid_types:
            return JsonResponse({
                'error': f'Invalid violation_type. Must be one of: {", ".join(valid_types)}'
            }, status=400)
        
        # Create violation
        violation = Violation.create(
            quiz_id=quiz_id,
            student_id=request.user['_id'],
            violation_type=violation_type,
            face_count=face_count,
            severity=severity,
            metadata=metadata
        )
        
        return JsonResponse({
            'success': True,
            'violation': serialize_violation(violation)
        }, status=201)
        
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def list_violations(request):
    """
    List violations with optional filters
    GET /api/violations/?quiz_id=...&student_id=...
    """
    try:
        quiz_id = request.GET.get('quiz_id')
        student_id = request.GET.get('student_id')
        
        if quiz_id:
            violations = Violation.find_by_quiz(quiz_id)
        elif student_id:
            violations = Violation.find_by_student(student_id)
        else:
            # Teachers can see all recent violations
            if request.user.get('role') == 'teacher':
                violations = Violation.find_recent(limit=100)
            else:
                # Students can only see their own
                violations = Violation.find_by_student(request.user['_id'])
        
        return JsonResponse({
            'violations': [serialize_violation(v) for v in violations]
        }, safe=False)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_violation_stats(request, quiz_id):
    """
    Get violation statistics for a quiz
    GET /api/violations/stats/<quiz_id>/
    """
    try:
        violations = Violation.find_by_quiz(quiz_id)
        
        # Aggregate statistics
        stats = {
            'total': len(violations),
            'by_type': {},
            'by_severity': {},
            'by_student': {}
        }
        
        for violation in violations:
            # By type
            v_type = violation['violation_type']
            stats['by_type'][v_type] = stats['by_type'].get(v_type, 0) + 1
            
            # By severity
            severity = violation['severity']
            stats['by_severity'][severity] = stats['by_severity'].get(severity, 0) + 1
            
            # By student
            student_id = str(violation['student_id'])
            if student_id not in stats['by_student']:
                stats['by_student'][student_id] = {
                    'count': 0,
                    'types': {}
                }
            stats['by_student'][student_id]['count'] += 1
            stats['by_student'][student_id]['types'][v_type] = \
                stats['by_student'][student_id]['types'].get(v_type, 0) + 1
        
        return JsonResponse(stats)
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
