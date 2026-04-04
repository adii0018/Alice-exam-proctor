import json
import os
import requests
import secrets
import string
from datetime import datetime, timedelta
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from ..models import User, db
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
        'profile_picture': user.get('profile_picture')
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


@csrf_exempt
@require_http_methods(["POST"])
def forgot_password(request):
    """Send password reset token to user's email"""
    try:
        data = json.loads(request.body)
        email = data.get('email')
        
        if not email:
            return JsonResponse({'error': 'Email is required'}, status=400)
        
        user = User.find_by_email(email)
        if not user:
            # Don't reveal if email exists or not (security best practice)
            return JsonResponse({'message': 'If the email exists, a reset link has been sent'})
        
        # Generate reset token
        reset_token = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(32))
        expires_at = datetime.utcnow() + timedelta(hours=1)  # Token valid for 1 hour
        
        # Store reset token in database
        db['password_resets'].insert_one({
            'user_id': user['_id'],
            'email': email,
            'token': reset_token,
            'expires_at': expires_at,
            'used': False,
            'created_at': datetime.utcnow()
        })
        
        # TODO: Send email with reset link
        # For now, we'll return the token in response (in production, send via email)
        # reset_link = f"http://localhost:5173/reset-password?token={reset_token}"
        # send_email(email, "Password Reset", f"Click here to reset: {reset_link}")
        
        return JsonResponse({
            'message': 'If the email exists, a reset link has been sent',
            'token': reset_token  # Remove this in production
        })
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)


@csrf_exempt
@require_http_methods(["POST"])
def reset_password(request):
    """Reset password using token"""
    try:
        data = json.loads(request.body)
        token = data.get('token')
        new_password = data.get('password')
        
        if not all([token, new_password]):
            return JsonResponse({'error': 'Token and new password are required'}, status=400)
        
        if len(new_password) < 6:
            return JsonResponse({'error': 'Password must be at least 6 characters'}, status=400)
        
        # Find valid reset token
        reset_request = db['password_resets'].find_one({
            'token': token,
            'used': False,
            'expires_at': {'$gt': datetime.utcnow()}
        })
        
        if not reset_request:
            return JsonResponse({'error': 'Invalid or expired reset token'}, status=400)
        
        # Update user password
        password_hash = hash_password(new_password)
        db['users'].update_one(
            {'_id': reset_request['user_id']},
            {'$set': {'password': password_hash}}
        )
        
        # Mark token as used
        db['password_resets'].update_one(
            {'_id': reset_request['_id']},
            {'$set': {'used': True, 'used_at': datetime.utcnow()}}
        )
        
        return JsonResponse({'message': 'Password reset successfully'})
        
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
