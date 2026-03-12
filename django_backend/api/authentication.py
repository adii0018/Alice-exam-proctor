import jwt
import bcrypt
from datetime import datetime, timedelta
from django.conf import settings
from functools import wraps
from django.http import JsonResponse
from .models import User


def hash_password(password):
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')


def verify_password(password, hashed):
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def generate_token(user_id, role):
    """Generate JWT token"""
    payload = {
        'user_id': str(user_id),
        'role': role,
        'exp': datetime.utcnow() + timedelta(days=7)
    }
    return jwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')


def decode_token(token):
    """Decode JWT token"""
    try:
        return jwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def require_auth(view_func):
    """Decorator to require authentication"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get('Authorization', '')
        
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'No token provided'}, status=401)
        
        token = auth_header.split(' ')[1]
        payload = decode_token(token)
        
        if not payload:
            return JsonResponse({'error': 'Invalid token'}, status=401)
        
        user = User.find_by_id(payload['user_id'])
        if not user:
            return JsonResponse({'error': 'User not found'}, status=401)
        
        request.user = user
        return view_func(request, *args, **kwargs)
    
    return wrapper


def require_role(role):
    """Decorator to require specific role"""
    def decorator(view_func):
        @wraps(view_func)
        @require_auth
        def wrapper(request, *args, **kwargs):
            if request.user['role'] != role:
                return JsonResponse({'error': 'Unauthorized'}, status=403)
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
