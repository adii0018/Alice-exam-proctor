import json
import os
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from ..models import User
from ..authentication import hash_password, verify_password, generate_token, require_auth


@csrf_exempt
@require_http_methods(["POST"])
def register(request):
    try:
        data = json.loads(request.body)
        name = data.get('name')
        email = data.get('email')
        password = data.get('password')
        role = data.get('role', 'student')
        
        if not all([name, email, password]):
            return JsonResponse({'error': 'Missing required fields'}, status=400)
        
        if User.find_by_email(email):
            return JsonResponse({'error': 'Email already exists'}, status=400)
        
        password_hash = hash_password(password)
        user = User.create(name, email, password_hash, role)
        
        token = generate_token(user['_id'], role)
        
        return JsonResponse({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': name,
                'email': email,
                'role': role
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    try:
        data = json.loads(request.body)
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return JsonResponse({'error': 'Missing credentials'}, status=400)
        
        user = User.find_by_email(email)
        if not user or not verify_password(password, user['password']):
            return JsonResponse({'error': 'Invalid credentials'}, status=401)
        
        token = generate_token(user['_id'], user['role'])
        
        return JsonResponse({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role']
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_current_user(request):
    user = request.user
    created_at = user.get('created_at')
    created_at_str = created_at.strftime('%b %Y') if created_at else None
    return JsonResponse({
        'id': str(user['_id']),
        'name': user['name'],
        'email': user['email'],
        'role': user['role'],
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
        access_token = data.get('credential')  # Google access token from frontend
        if not access_token:
            return JsonResponse({'error': 'Missing Google credential'}, status=400)

        # Get user info from Google using access token
        google_resp = requests.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            headers={'Authorization': f'Bearer {access_token}'},
            timeout=10
        )
        if google_resp.status_code != 200:
            return JsonResponse({'error': 'Invalid Google token'}, status=401)

        info = google_resp.json()
        email = info.get('email')
        name = info.get('name', email.split('@')[0])
        role = data.get('role', 'student')

        # Find or create user
        user = User.find_by_email(email)
        if not user:
            user = User.create(name, email, password_hash='', role=role)

        token = generate_token(user['_id'], user['role'])
        return JsonResponse({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'name': user['name'],
                'email': user['email'],
                'role': user['role'],
            }
        })
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["PUT", "PATCH"])
@require_auth
def update_profile(request):
    try:
        data = json.loads(request.body)
        user_id = request.user['_id']
        
        # Update user profile
        success = User.update_profile(user_id, data)
        
        if success:
            # Get updated user data
            updated_user = User.find_by_id(user_id)
            return JsonResponse({
                'message': 'Profile updated successfully',
                'user': {
                    'id': str(updated_user['_id']),
                    'name': updated_user['name'],
                    'email': updated_user['email'],
                    'role': updated_user['role'],
                    'phone': updated_user.get('phone'),
                    'location': updated_user.get('location'),
                    'bio': updated_user.get('bio'),
                    'date_of_birth': updated_user.get('date_of_birth'),
                    'department': updated_user.get('department'),
                    'profile_picture': updated_user.get('profile_picture')
                }
            })
        else:
            return JsonResponse({'error': 'No changes made'}, status=400)
            
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
