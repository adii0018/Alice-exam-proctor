import os

# IMPORTANT: set settings module BEFORE importing anything that touches
# `django.conf.settings` (e.g. models imported from api.routing/consumers).
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
from api.routing import websocket_urlpatterns

django_asgi_app = get_asgi_application()

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": AuthMiddlewareStack(
        URLRouter(websocket_urlpatterns)
    ),
})
