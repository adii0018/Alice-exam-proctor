import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')
django.setup()

from django.contrib.auth.models import User

# Create superuser
username = 'admin'
email = 'admin@example.com'
password = 'admin123'

if User.objects.filter(username=username).exists():
    print(f"✅ User '{username}' already exists!")
else:
    User.objects.create_superuser(username=username, email=email, password=password)
    print(f"✅ Superuser created successfully!")
    print(f"Username: {username}")
    print(f"Password: {password}")
    print(f"Login at: http://localhost:8000/admin/")
