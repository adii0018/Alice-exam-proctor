import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django_ratelimit.decorators import ratelimit
from django.conf import settings
from ..authentication import require_auth
from ..services.auth_service import AuthService

def set_auth_cookies(response, access_token, refresh_token):
    response.set_cookie(
        'access_token',
        access_token,
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite='Lax',
        max_age=900
    )
    response.set_cookie(
        'refresh_token',
        refresh_token,
        httponly=True,
        secure=settings.SESSION_COOKIE_SECURE,
        samesite='Lax',
        max_age=604800
    )
    return response

@csrf_exempt
@require_http_methods(["POST"])
@ratelimit(key='ip', rate='3/h', method='POST', block=True)
def register(request):
    try:
        data = json.loads(request.body)
        name = data.get('name', '')
        email = data.get('email', '').lower()
        password = data.get('password', '')
        role = data.get('role', 'student')
        
        user, access_token, refresh_token = AuthService.register(name, email, password, role)
        
        response = JsonResponse({
            'message': 'Registered successfully',
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        })
        return set_auth_cookies(response, access_token, refresh_token)
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'An internal error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@ratelimit(key='ip', rate='5/m', method='POST', block=True)
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email', '').lower()
        password = data.get('password', '')
        
        user, access_token, refresh_token = AuthService.login(email, password)
        
        response = JsonResponse({
            'message': 'Login successful',
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        })
        return set_auth_cookies(response, access_token, refresh_token)
    except ValueError as e:
        status_code = 401 if 'credentials' in str(e).lower() else 400
        return JsonResponse({'error': str(e)}, status=status_code)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'An internal error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
def refresh_token_view(request):
    try:
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            try:
                data = json.loads(request.body)
                refresh_token = data.get('refresh_token')
            except:
                pass
                
        new_access = AuthService.refresh_token(refresh_token)
        
        response = JsonResponse({
            'message': 'Token refreshed',
            'access_token': new_access
        })
        response.set_cookie(
            'access_token',
            new_access,
            httponly=True,
            secure=settings.SESSION_COOKIE_SECURE,
            samesite='Lax',
            max_age=900
        )
        return response
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=401)
    except Exception as e:
        return JsonResponse({'error': 'An internal error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def logout(request):
    try:
        access_token = request.token
        refresh_token = request.COOKIES.get('refresh_token')
        
        AuthService.logout(access_token, refresh_token)
            
        response = JsonResponse({'message': 'Logged out successfully'})
        response.delete_cookie('access_token')
        response.delete_cookie('refresh_token')
        return response
    except Exception as e:
        return JsonResponse({'error': 'An internal error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_current_user(request):
    user = request.user
    created_at = user.get('created_at')
    created_at_str = created_at.strftime('%b %Y') if created_at else None
    return JsonResponse({
        'id': str(user['_id']),
        'name': user.get('name'),
        'email': user.get('email'),
        'role': user.get('role'),
        'phone': user.get('phone'),
        'location': user.get('location'),
        'bio': user.get('bio'),
        'date_of_birth': user.get('date_of_birth'),
        'department': user.get('department'),
        'profile_picture': user.get('profile_picture'),
        'created_at': created_at_str
    })

@csrf_exempt
@require_http_methods(["POST"])
def google_auth(request):
    try:
        data = json.loads(request.body)
        access_token = data.get('credential')
        role = data.get('role', 'student')

        user, new_access_token, refresh_token = AuthService.google_auth(access_token, role)
        
        response = JsonResponse({
            'message': 'Google login successful',
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
            }
        })
        return set_auth_cookies(response, new_access_token, refresh_token)
    except ValueError as e:
        status_code = 401 if 'token' in str(e).lower() else 400
        return JsonResponse({'error': str(e)}, status=status_code)
    except Exception as e:
        return JsonResponse({'error': 'An internal error occurred'}, status=500)

@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@require_auth
def update_profile(request):
    try:
        data = json.loads(request.body)
        user_id = request.user['_id']
            
        updated_user = AuthService.update_profile(user_id, data)
        
        return JsonResponse({
            'message': 'Profile updated successfully',
            'user': {
                'id': str(updated_user['_id']),
                'name': updated_user.get('name'),
                'email': updated_user.get('email'),
                'role': updated_user.get('role'),
                'phone': updated_user.get('phone'),
                'location': updated_user.get('location'),
                'bio': updated_user.get('bio'),
                'date_of_birth': updated_user.get('date_of_birth'),
                'department': updated_user.get('department'),
                'profile_picture': updated_user.get('profile_picture')
            }
        })
    except ValueError as e:
        return JsonResponse({'error': str(e)}, status=400)
    except Exception as e:
        return JsonResponse({'error': 'An internal error occurred'}, status=500)
