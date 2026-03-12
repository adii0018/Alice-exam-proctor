import os
import sys
import bcrypt

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')

import django
django.setup()

from api.models import User

def create_admin_user():
    """Create a super admin user for the admin panel"""
    
    print("\n" + "="*60)
    print("  Alice Exam Proctor - Create Super Admin User")
    print("="*60 + "\n")
    
    # Get user input
    name = input("Enter admin name (default: Super Admin): ").strip() or "Super Admin"
    email = input("Enter admin email (default: admin@alice.com): ").strip() or "admin@alice.com"
    password = input("Enter admin password (default: admin123): ").strip() or "admin123"
    
    # Check if user already exists
    existing_user = User.find_by_email(email)
    if existing_user:
        print(f"\n❌ User with email '{email}' already exists!")
        overwrite = input("Do you want to update this user to admin role? (yes/no): ").strip().lower()
        if overwrite != 'yes':
            print("Aborted.")
            return
        
        # Update existing user to admin
        from api.models import users_collection
        from bson import ObjectId
        
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        users_collection.update_one(
            {'_id': ObjectId(existing_user['_id'])},
            {'$set': {
                'name': name,
                'password': password_hash.decode('utf-8'),
                'role': 'admin'
            }}
        )
        print(f"\n✅ User updated to admin role successfully!")
    else:
        # Create new admin user
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        user = User.create(
            name=name,
            email=email,
            password_hash=password_hash.decode('utf-8'),
            role='admin'
        )
        print(f"\n✅ Super admin user created successfully!")
    
    print("\n" + "="*60)
    print("  Admin Credentials")
    print("="*60)
    print(f"Name:     {name}")
    print(f"Email:    {email}")
    print(f"Password: {password}")
    print(f"Role:     admin")
    print("\nYou can now login at: http://localhost:5174/admin")
    print("="*60 + "\n")

if __name__ == '__main__':
    try:
        create_admin_user()
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        print("Make sure MongoDB is running and Django is properly configured.\n")
