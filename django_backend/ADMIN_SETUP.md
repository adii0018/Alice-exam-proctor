# 🔐 Django Admin Panel Setup Guide

## Admin Panel banane ke steps:

### Step 1: Database Migrate karo
```bash
cd django_backend
python manage.py migrate
```

### Step 2: Superuser banao
```bash
python create_superuser.py
```

Ya manually:
```bash
python manage.py createsuperuser
```

Default credentials (agar create_superuser.py use karo):
- Username: `admin`
- Email: `admin@example.com`
- Password: `admin123`

### Step 3: Server start karo
```bash
python manage.py runserver
```

### Step 4: Admin panel access karo
Browser mein jao: **http://localhost:8000/admin/**

Login karo apne superuser credentials se.

## 📊 Admin Panel Features:

1. **Dashboard**: Statistics aur recent activity dekho
2. **Users Management**: Django users manage karo
3. **Groups & Permissions**: Access control setup karo
4. **MongoDB Data**: Custom views se MongoDB data dekho (coming soon)

## 🎯 Custom Admin Views (Optional):

Agar MongoDB data directly admin panel mein dekhna hai, to ye URLs use karo:

- Users List: `http://localhost:8000/api/admin/users/`
- Quizzes List: `http://localhost:8000/api/admin/quizzes/`
- Violations List: `http://localhost:8000/api/admin/violations/`

## 🔒 Security Tips:

1. Production mein strong password use karo
2. `.env` file mein `SECRET_KEY` change karo
3. `DEBUG = False` set karo production mein
4. `ALLOWED_HOSTS` properly configure karo

## 📝 Notes:

- Admin panel Django's built-in authentication use karta hai (SQLite)
- Application data MongoDB mein store hota hai
- Dono databases independently kaam karte hain
- Admin users aur application users alag hain

## 🚀 Quick Start:

```bash
# Django backend folder mein jao
cd django_backend

# Migrations run karo
python manage.py migrate

# Superuser banao
python create_superuser.py

# Server start karo
python manage.py runserver

# Browser mein open karo
# http://localhost:8000/admin/
```

Enjoy your admin panel! 🎉
