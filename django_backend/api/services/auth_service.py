import json
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
from django.conf import settings
from ..models import User
from ..authentication import hash_password, verify_password, generate_token, redis_client, decode_token

class AuthService:
    @staticmethod
    def register(name, email, password, role='student'):
        if not all([name, email, password]):
            raise ValueError('Missing required fields')
            
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('Invalid email format')
            
        if len(password) < 8:
            raise ValueError('Password must be at least 8 characters')
        
        if User.find_by_email(email):
            raise ValueError('Email already exists')
        
        password_hash = hash_password(password)
        user = User.create(name, email, password_hash, role)
        
        access_token = generate_token(user['_id'], role, 'access')
        refresh_token = generate_token(user['_id'], role, 'refresh')
        
        return user, access_token, refresh_token

    @staticmethod
    def login(email, password):
        if not all([email, password]):
            raise ValueError('Missing credentials')
            
        try:
            validate_email(email)
        except ValidationError:
            raise ValueError('Invalid credentials')
        
        user = User.find_by_email(email)
        if not user or not verify_password(password, user.get('password', '')):
            raise ValueError('Invalid credentials')
        
        access_token = generate_token(user['_id'], user['role'], 'access')
        refresh_token = generate_token(user['_id'], user['role'], 'refresh')
        
        return user, access_token, refresh_token

    @staticmethod
    def refresh_token(refresh_token):
        if not refresh_token:
            raise ValueError('No refresh token')
            
        try:
            if redis_client.get(f"blacklist:{refresh_token}"):
                raise ValueError('Token revoked')
        except:
            pass
            
        payload = decode_token(refresh_token)
        if not payload or payload.get('type') != 'refresh':
            raise ValueError('Invalid refresh token')
            
        user = User.find_by_id(payload['user_id'])
        if not user:
            raise ValueError('User not found')
            
        new_access = generate_token(user['_id'], user['role'], 'access')
        return new_access

    @staticmethod
    def logout(access_token, refresh_token):
        try:
            if access_token:
                redis_client.setex(f"blacklist:{access_token}", 604800, "true")
            if refresh_token:
                redis_client.setex(f"blacklist:{refresh_token}", 604800, "true")
        except:
            pass

    @staticmethod
    def google_auth(access_token, role='student'):
        if not access_token:
            raise ValueError('Missing Google credential')

        try:
            client_id = getattr(settings, 'GOOGLE_CLIENT_ID', None)
            if client_id:
                info = id_token.verify_oauth2_token(
                    access_token,
                    google_requests.Request(),
                    client_id
                )
            else:
                info = id_token.verify_oauth2_token(
                    access_token,
                    google_requests.Request()
                )
        except ValueError:
            raise ValueError('Invalid Google token')

        email = info.get('email', '').lower().strip()
        if not email:
            raise ValueError('Token does not contain email')
            
        name = info.get('name', email.split('@')[0])
        role = role.strip().lower()
        if role not in ['student', 'teacher']:
            role = 'student'

        user = User.find_by_email(email)
        if not user:
            user = User.create(name, email, password_hash='', role=role)

        access_token = generate_token(user['_id'], user['role'], 'access')
        refresh_token = generate_token(user['_id'], user['role'], 'refresh')
        
        return user, access_token, refresh_token

    @staticmethod
    def update_profile(user_id, data):
        safe_data = {}
        for key in ['name', 'phone', 'location', 'bio', 'department', 'profile_picture', 'date_of_birth']:
            if key in data:
                safe_data[key] = str(data[key]).strip() if data[key] is not None else None
                
        if not safe_data:
            raise ValueError('No valid fields provided')
            
        success = User.update_profile(user_id, safe_data)
        if not success:
            raise ValueError('No changes made or update failed')
            
        return User.find_by_id(user_id)
