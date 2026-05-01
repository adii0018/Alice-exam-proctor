#!/usr/bin/env python
"""
Quick script to check and fix user roles in the database.
Run this if students are getting "unauthorized" errors when submitting exams.
"""
import os
import sys
import django

# Setup Django
sys.path.insert(0, os.path.dirname(__file__))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')
django.setup()

from api.models import users_collection

def check_and_fix_roles():
    print("Checking user roles in database...\n")
    
    users = list(users_collection.find({}))
    
    if not users:
        print("No users found in database.")
        return
    
    print(f"Found {len(users)} users:\n")
    
    for user in users:
        email = user.get('email', 'N/A')
        name = user.get('name', 'N/A')
        role = user.get('role', 'N/A')
        user_id = str(user.get('_id', 'N/A'))
        
        print(f"Email: {email}")
        print(f"Name: {name}")
        print(f"Role: {role}")
        print(f"ID: {user_id}")
        print("-" * 50)
        
        # Check for role issues
        if role and role != role.lower():
            print(f"⚠️  Warning: Role has mixed case: '{role}'")
            fix = input(f"Fix to lowercase '{role.lower()}'? (y/n): ").strip().lower()
            if fix == 'y':
                users_collection.update_one(
                    {'_id': user['_id']},
                    {'$set': {'role': role.lower()}}
                )
                print(f"✅ Updated role to '{role.lower()}'")
            print()
        
        if not role or role == 'N/A':
            print("⚠️  Warning: User has no role!")
            new_role = input("Enter role (student/teacher): ").strip().lower()
            if new_role in ['student', 'teacher']:
                users_collection.update_one(
                    {'_id': user['_id']},
                    {'$set': {'role': new_role}}
                )
                print(f"✅ Updated role to '{new_role}'")
            print()

if __name__ == '__main__':
    check_and_fix_roles()
