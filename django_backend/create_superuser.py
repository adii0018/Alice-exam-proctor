import os
import django
import sys

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    """Create a superuser for Django admin panel"""
    
    username = input("Enter username (default: admin): ").strip() or "admin"
    email = input("Enter email (default: admin@example.com): ").strip() or "admin@example.com"
    password = input("Enter password (default: admin123): ").strip() or "admin123"
    
    # Check if user already exists
    if User.objects.filter(username=username).exists():
        print(f"\n❌ User '{username}' already exists!")
        overwrite = input("Do you want to delete and recreate? (yes/no): ").strip().lower()
        if overwrite == 'yes':
            User.objects.filter(username=username).delete()
            print(f"✅ Deleted existing user '{username}'")
        else:
            print("Aborted.")
            return
    
    # Create superuser
    user = User.objects.create_superuser(
        username=username,
        email=email,
        password=password
    )
    
    print("\n" + "="*50)
    print("✅ Superuser created successfully!")
    print("="*50)
    print(f"Username: {username}")
    print(f"Email: {email}")
    print(f"Password: {password}")
    print("\nYou can now login at: http://localhost:8000/admin/")
    print("="*50)

if __name__ == '__main__':
    create_superuser()
