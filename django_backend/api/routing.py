"""
WebSocket URL routing
"""
from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r'ws/proctor/(?P<quiz_id>[^/]+)/$', consumers.ProctoringConsumer.as_asgi()),
    re_path(r'ws/teacher/monitor/(?P<teacher_id>[^/]+)/$', consumers.TeacherMonitoringConsumer.as_asgi()),
]
