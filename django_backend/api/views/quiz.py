import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from ..authentication import require_auth, require_role
from ..services.quiz_service import QuizService

@csrf_exempt
@require_auth
def quizzes_handler(request):
    if request.method == 'GET':
        try:
            quizzes = QuizService.get_quizzes(request.user)
            return JsonResponse(quizzes, safe=False)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    elif request.method == 'POST':
        try:
            data = json.loads(request.body)
            quiz = QuizService.create_quiz(request.user, data)
            return JsonResponse(quiz)
        except PermissionError as e:
            return JsonResponse({'error': str(e)}, status=403)
        except ValueError as e:
            return JsonResponse({'error': str(e)}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)

@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_quiz(request, quiz_id):
    try:
        quiz = QuizService.get_quiz(request.user, quiz_id)
        return JsonResponse(quiz)
    except KeyError as e:
        return JsonResponse({'error': str(e).strip("'")}, status=404)
    except PermissionError as e:
        return JsonResponse({'error': str(e)}, status=403)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_quiz_by_code(request, code):
    try:
        quiz = QuizService.get_quiz_by_code(request.user, code)
        return JsonResponse(quiz)
    except KeyError as e:
        return JsonResponse({'error': str(e).strip("'")}, status=404)
    except PermissionError as e:
        return JsonResponse({'error': str(e)}, status=403)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@require_role('teacher')
def toggle_quiz_active(request, quiz_id):
    try:
        new_status = QuizService.toggle_quiz_active(request.user, quiz_id)
        return JsonResponse({'is_active': new_status, 'message': f"Quiz {'activated' if new_status else 'deactivated'} successfully"})
    except KeyError as e:
        return JsonResponse({'error': str(e).strip("'")}, status=404)
    except PermissionError as e:
        return JsonResponse({'error': str(e)}, status=403)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@require_role('student')
def submit_quiz(request, quiz_id):
    try:
        data = json.loads(request.body)
        answers = data.get('answers', {})
        proctoring_report = data.get('proctoringReport', {})
        time_spent = data.get('timeSpent', 0)

        submission_id, score, correct, total = QuizService.submit_quiz(
            request.user, quiz_id, answers, proctoring_report, time_spent
        )

        return JsonResponse({
            'submission_id': submission_id,
            'score': score,
            'correct': correct,
            'total': total
        })
    except KeyError as e:
        return JsonResponse({'error': str(e).strip("'")}, status=404)
    except PermissionError as e:
        return JsonResponse({'error': str(e)}, status=403)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["DELETE"])
@require_role('teacher')
def delete_quiz(request, quiz_id):
    try:
        QuizService.delete_quiz(quiz_id)
        return JsonResponse({'message': 'Quiz deleted successfully'})
    except KeyError as e:
        return JsonResponse({'error': str(e).strip("'")}, status=404)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)

@csrf_exempt
@require_http_methods(["PUT"])
@require_role('teacher')
def update_quiz(request, quiz_id):
    try:
        data = json.loads(request.body)
        updated_quiz = QuizService.update_quiz(request.user, quiz_id, data)
        return JsonResponse(updated_quiz)
    except KeyError as e:
        return JsonResponse({'error': str(e).strip("'")}, status=404)
    except PermissionError as e:
        return JsonResponse({'error': str(e)}, status=403)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
