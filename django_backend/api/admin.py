from django.contrib import admin
from django.contrib.auth.models import User as DjangoUser, Group
from django.utils.html import format_html
from .models import (
    users_collection, quizzes_collection, submissions_collection,
    flags_collection, violations_collection
)
from bson import ObjectId


# Custom admin site configuration
admin.site.site_header = "Alice Exam Proctor Admin"
admin.site.site_title = "Alice Admin Portal"
admin.site.index_title = "Welcome to Alice Exam Proctor Administration"


class MongoDBAdmin:
    """Base class for MongoDB collections in Django admin"""
    
    def __init__(self, collection, model_name):
        self.collection = collection
        self.model_name = model_name
    
    def get_queryset(self):
        """Get all documents from MongoDB collection"""
        return list(self.collection.find())
    
    def get_object(self, object_id):
        """Get single document by ID"""
        return self.collection.find_one({'_id': ObjectId(object_id)})
    
    def delete_object(self, object_id):
        """Delete document by ID"""
        return self.collection.delete_one({'_id': ObjectId(object_id)})


# Custom admin views for MongoDB collections
class UserAdmin(admin.ModelAdmin):
    list_display = ['email', 'name', 'role', 'created_at']
    list_filter = ['role']
    search_fields = ['email', 'name']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False
    
    def has_delete_permission(self, request, obj=None):
        return True


class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'code', 'duration', 'created_at']
    search_fields = ['title', 'code']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


class ViolationAdmin(admin.ModelAdmin):
    list_display = ['violation_type', 'severity', 'timestamp', 'status']
    list_filter = ['violation_type', 'severity', 'status']
    
    def has_add_permission(self, request):
        return False
    
    def has_change_permission(self, request, obj=None):
        return False


# Note: Since we're using MongoDB, we can't directly register these with Django admin
# We need to create a custom admin interface or use Django models as proxies

# For now, let's create a simple info page
class AdminDashboard:
    """Custom admin dashboard for MongoDB data"""
    
    @staticmethod
    def get_stats():
        return {
            'total_users': users_collection.count_documents({}),
            'total_students': users_collection.count_documents({'role': 'student'}),
            'total_teachers': users_collection.count_documents({'role': 'teacher'}),
            'total_quizzes': quizzes_collection.count_documents({}),
            'total_submissions': submissions_collection.count_documents({}),
            'total_violations': violations_collection.count_documents({}),
            'total_flags': flags_collection.count_documents({}),
        }
