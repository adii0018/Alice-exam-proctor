@echo off
echo ========================================
echo   Alice Exam Proctor - Admin Setup
echo ========================================
echo.

cd django_backend

echo [1/3] Running migrations...
python manage.py migrate
echo.

echo [2/3] Creating superuser...
echo.
python create_superuser.py
echo.

echo [3/3] Setup complete!
echo.
echo ========================================
echo   Admin Panel Ready!
echo ========================================
echo.
echo You can now access admin panel at:
echo http://localhost:8000/admin/
echo.
echo To start the server, run:
echo   python manage.py runserver
echo.
pause
