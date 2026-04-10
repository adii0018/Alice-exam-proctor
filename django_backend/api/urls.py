from django.urls import path
from .views import auth, quiz, flag, ai, violation, admin_api, contact, student_dashboard, stats, students

urlpatterns = [
    # Auth
    path('auth/register/', auth.register, name='register'),
    path('auth/login/', auth.login, name='login'),
    path('auth/google/', auth.google_auth, name='google_auth'),
    path('auth/me/', auth.get_current_user, name='current_user'),
    path('auth/profile/', auth.update_profile, name='update_profile'),
    
    # Quizzes
    path('quizzes/', quiz.quizzes_handler, name='quizzes'),
    path('quizzes/by-code/<str:code>/', quiz.get_quiz_by_code, name='quiz_by_code'),
    path('quizzes/<str:quiz_id>/', quiz.get_quiz, name='get_quiz'),
    path('quizzes/<str:quiz_id>/update/', quiz.update_quiz, name='update_quiz'),
    path('quizzes/<str:quiz_id>/toggle-active/', quiz.toggle_quiz_active, name='toggle_quiz_active'),
    path('quizzes/<str:quiz_id>/submit/', quiz.submit_quiz, name='submit_quiz'),
    path('quizzes/<str:quiz_id>/delete/', quiz.delete_quiz, name='delete_quiz'),
    
    # Flags
    path('flags/', flag.list_flags, name='list_flags'),
    path('flags/create/', flag.create_flag, name='create_flag'),
    path('flags/<str:flag_id>/update/', flag.update_flag, name='update_flag'),
    
    # Violations
    path('violations/', violation.list_violations, name='list_violations'),
    path('violations/create/', violation.create_violation, name='create_violation'),
    path('violations/stats/<str:quiz_id>/', violation.get_violation_stats, name='violation_stats'),
    path('violations/quiz/<str:quiz_id>/students/', violation.get_quiz_violations_by_student, name='quiz_violations_by_student'),
    
    # AI
    path('ai/chat/', ai.chat, name='ai_chat'),
    
    # Contact
    path('contact/', contact.send_contact_email, name='contact'),

    # Student Dashboard
    path('student/dashboard/', student_dashboard.student_dashboard, name='student_dashboard'),
    
    # Super Admin
    path('admin/dashboard-stats/', admin_api.dashboard_stats, name='admin_dashboard_stats'),
    path('admin/users/', admin_api.users_list, name='admin_users_list'),
    path('admin/users/<str:user_id>/<str:action>/', admin_api.user_action, name='admin_user_action'),
    path('admin/violations/', admin_api.violations_list, name='admin_violations_list'),
    path('admin/audit-logs/', admin_api.audit_logs, name='admin_audit_logs'),
    path('admin/settings/', admin_api.system_settings, name='admin_system_settings'),
    path('admin/exams/', admin_api.exams_list, name='admin_exams_list'),
    path('admin/exams/<str:exam_id>/<str:action>/', admin_api.exam_action, name='admin_exam_action'),

    # Teacher stats
    path('teacher/dashboard-stats/', stats.get_dashboard_stats, name='teacher_dashboard_stats'),
    path('teacher/performance-stats/', stats.get_performance_stats, name='teacher_performance_stats'),
    path('teacher/quizzes/<str:quiz_id>/stats/', stats.get_quiz_stats, name='teacher_quiz_stats'),
    path('teacher/quizzes/<str:quiz_id>/results/', stats.get_quiz_results, name='teacher_quiz_results'),
    path('teacher/all-results/', stats.get_teacher_all_results, name='teacher_all_results'),

    # Teacher students
    path('teacher/students/', students.list_students, name='teacher_students'),
    path('teacher/students/<str:student_id>/', students.get_student_details, name='teacher_student_details'),
    path('teacher/students/count/', students.get_students_count, name='teacher_students_count'),
]
