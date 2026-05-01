#!/usr/bin/env python
"""
Verify authentication setup and test token generation/validation.
"""
import os
import sys
import django

sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')
django.setup()

from api.models import users_collection
from api.authentication import generate_token, decode_token
from bson import ObjectId

def verify_setup():
    print("=" * 60)
    print("Authentication Setup Verification")
    print("=" * 60)
    print()
    
    # Check database connection
    try:
        count = users_collection.count_documents({})
        print(f"✅ Database connected: {count} users found")
    except Exception as e:
        print(f"❌ Database connection failed: {e}")
        return
    
    print()
    
    # Check users and their roles
    print("User Roles Check:")
    print("-" * 60)
    
    students = list(users_collection.find({'role': 'student'}))
    teachers = list(users_collection.find({'role': 'teacher'}))
    others = list(users_collection.find({'role': {'$nin': ['student', 'teacher']}}))
    
    print(f"Students: {len(students)}")
    print(f"Teachers: {len(teachers)}")
    print(f"Others/Invalid: {len(others)}")
    
    if others:
        print("\n⚠️  Warning: Found users with invalid roles:")
        for user in others:
            print(f"  - {user.get('email')}: role='{user.get('role')}'")
    
    print()
    
    # Test token generation and validation
    print("Token Generation Test:")
    print("-" * 60)
    
    if students:
        test_user = students[0]
        user_id = test_user['_id']
        role = test_user['role']
        
        print(f"Testing with user: {test_user.get('email')}")
        print(f"Role: {role}")
        
        # Generate token
        token = generate_token(user_id, role)
        print(f"✅ Token generated: {token[:20]}...")
        
        # Decode token
        payload = decode_token(token)
        if payload:
            print(f"✅ Token decoded successfully")
            print(f"   User ID: {payload.get('user_id')}")
            print(f"   Role: {payload.get('role')}")
            
            # Verify role matches
            if payload.get('role') == role:
                print(f"✅ Role matches: '{role}'")
            else:
                print(f"❌ Role mismatch: token='{payload.get('role')}' vs db='{role}'")
        else:
            print("❌ Token decode failed")
    else:
        print("⚠️  No students found to test with")
    
    print()
    
    # Check for common issues
    print("Common Issues Check:")
    print("-" * 60)
    
    # Check for mixed case roles
    mixed_case = list(users_collection.find({
        'role': {'$regex': '^[A-Z]', '$options': 'i'}
    }))
    
    issues_found = False
    
    for user in mixed_case:
        role = user.get('role', '')
        if role and role != role.lower():
            if not issues_found:
                print("⚠️  Found users with mixed-case roles:")
                issues_found = True
            print(f"  - {user.get('email')}: '{role}' (should be '{role.lower()}')")
    
    # Check for users without roles
    no_role = list(users_collection.find({'$or': [
        {'role': {'$exists': False}},
        {'role': None},
        {'role': ''}
    ]}))
    
    if no_role:
        if not issues_found:
            issues_found = True
        print("⚠️  Found users without roles:")
        for user in no_role:
            print(f"  - {user.get('email')}: No role set")
    
    if not issues_found:
        print("✅ No common issues found")
    
    print()
    print("=" * 60)
    print("Verification Complete")
    print("=" * 60)
    
    if issues_found:
        print("\n💡 Tip: Run 'python check_user_role.py' to fix role issues")

if __name__ == '__main__':
    verify_setup()
