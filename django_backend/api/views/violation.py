import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from ..authentication import require_auth, require_role
from ..services.violation_service import ViolationService

@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def create_violation(request):
    try:
        data = json.loads(request.body)
        violation = ViolationService.create_violation(request.user, data)
        return JsonResponse({
            'success': True,
            'violation': violation
        }, status=201)
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def list_violations(request):
    try:
        quiz_id = request.GET.get('quiz_id')
        student_id = request.GET.get('student_id')
        
        violations = ViolationService.list_violations(request.user, quiz_id, student_id)
        return JsonResponse({'violations': violations}, safe=False)
    except PermissionError as e:
        return JsonResponse({'error': str(e)}, status=403)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
@require_role('teacher')
def get_quiz_violations_by_student(request, quiz_id):
    try:
        result = ViolationService.get_quiz_violations_by_student(request.user, quiz_id)
        return JsonResponse({'students': result}, safe=False)
    except PermissionError as e:
        return JsonResponse({'error': str(e)}, status=403)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_violation_stats(request, quiz_id):
    try:
        stats = ViolationService.get_violation_stats(quiz_id)
        return JsonResponse(stats)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
