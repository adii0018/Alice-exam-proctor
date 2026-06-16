import jwt
import bcrypt
import redis
from datetime import datetime, timedelta
from django.conf import settings
from functools import wraps
from django.http import JsonResponse
from .models import User


# Connect to Redis for token blacklisting
redis_url = getattr(settings, '_redis_url', 'redis://localhost:6379/0')
if not redis_url:
    redis_url = 'redis://localhost:6379/0'
redis_client = redis.from_url(redis_url, decode_responses=True)


def hash_password(password):
    """Hash a password using bcrypt"""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(12)).decode('utf-8')


def verify_password(password, hashed):
    """Verify a password against its hash"""
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))


def generate_token(user_id, role, token_type='access'):
    """Generate JWT token. token_type can be 'access' (15 min) or 'refresh' (7 days)"""
    if token_type == 'access':
        exp = datetime.utcnow() + timedelta(minutes=15)
    else:
        exp = datetime.utcnow() + timedelta(days=7)
        
    payload = {
        'user_id': str(user_id),
        'role': role,
        'type': token_type,
        'exp': exp
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


def get_token_from_request(request):
    """Extract token from cookie or header (fallback)"""
    token = request.COOKIES.get('access_token')
    if not token:
        auth_header = request.headers.get('Authorization', '')
        if auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
    return token


from .utils.exceptions import AuthenticationFailedException, PermissionDeniedException

def _authenticate_request(request):
    """Core authentication logic. Raises exceptions if auth fails."""
    token = get_token_from_request(request)
    if not token:
        raise AuthenticationFailedException('No token provided')
        
    try:
        if redis_client.get(f"blacklist:{token}"):
            raise AuthenticationFailedException('Token revoked')
    except redis.RedisError:
        pass
        
    payload = decode_token(token)
    if not payload or payload.get('type') != 'access':
        raise AuthenticationFailedException('Invalid token')
        
    user = User.find_by_id(payload['user_id'])
    if not user:
        raise AuthenticationFailedException('User not found')
        
    request.user = user
    request.token = token


def require_auth(view_func):
    """Decorator to require authentication"""
    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        try:
            _authenticate_request(request)
        except AuthenticationFailedException as e:
            return JsonResponse({'error': e.message}, status=e.status_code)
            
        return view_func(request, *args, **kwargs)
    return wrapper


def require_role(*roles):
    """Decorator to require specific role(s). Already includes authentication check."""
    def decorator(view_func):
        @wraps(view_func)
        def wrapper(request, *args, **kwargs):
            try:
                _authenticate_request(request)
            except AuthenticationFailedException as e:
                return JsonResponse({'error': e.message}, status=e.status_code)
            
            allowed = {(r or '').strip().lower() for r in roles}
            user_role = (request.user.get('role') or '').strip().lower()
            if user_role not in allowed:
                return JsonResponse({'error': 'Unauthorized'}, status=403)
            
            return view_func(request, *args, **kwargs)
        return wrapper
    return decorator
