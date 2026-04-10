"""
WebSocket consumers for real-time proctoring
"""
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from bson import ObjectId
from .models import Violation, User, Quiz


class ProctoringConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time proctoring events
    Handles violation alerts and live monitoring
    """
    
    async def connect(self):
        """Handle WebSocket connection"""
        self.quiz_id = self.scope['url_route']['kwargs']['quiz_id']
        self.room_group_name = f'proctor_{self.quiz_id}'
        
        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        
        await self.accept()
        
        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to proctoring channel',
            'quiz_id': self.quiz_id
        }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """
        Receive message from WebSocket
        Expected format:
        {
            "type": "violation_alert",
            "student_id": "...",
            "violation_type": "MULTIPLE_FACES",
            "face_count": 2,
            "severity": "medium",
            "metadata": {}
        }
        """
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'violation_alert':
                await self.handle_violation_alert(data)
            elif message_type == 'ping':
                await self.send(text_data=json.dumps({'type': 'pong'}))
            else:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': f'Unknown message type: {message_type}'
                }))
                
        except json.JSONDecodeError:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': 'Invalid JSON'
            }))
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def handle_violation_alert(self, data):
        """Handle violation alert from student"""
        try:
            student_id = data.get('student_id')
            violation_type = data.get('violation_type')
            face_count = data.get('face_count')
            severity = data.get('severity', 'medium')
            metadata = data.get('metadata', {})
            
            # Get student info
            student = await self.get_student(student_id)
            if not student:
                await self.send(text_data=json.dumps({
                    'type': 'error',
                    'message': 'Student not found'
                }))
                return
            
            # Create violation record
            violation = await self.create_violation(
                quiz_id=self.quiz_id,
                student_id=student_id,
                violation_type=violation_type,
                face_count=face_count,
                severity=severity,
                metadata=metadata
            )
            
            # Broadcast to all connected clients (teachers monitoring)
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'violation_broadcast',
                    'violation': {
                        'id': str(violation['_id']),
                        'quiz_id': self.quiz_id,
                        'student_id': student_id,
                        'student_name': student.get('name', 'Unknown'),
                        'violation_type': violation_type,
                        'face_count': face_count,
                        'severity': severity,
                        'timestamp': violation['timestamp'].isoformat(),
                        'metadata': metadata
                    }
                }
            )
            
            # Confirm to sender
            await self.send(text_data=json.dumps({
                'type': 'violation_logged',
                'violation_id': str(violation['_id']),
                'message': 'Violation recorded successfully'
            }))
            
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': f'Failed to handle violation: {str(e)}'
            }))
    
    async def violation_broadcast(self, event):
        """Send violation alert to WebSocket"""
        await self.send(text_data=json.dumps({
            'type': 'VIOLATION_ALERT',
            'violation': event['violation']
        }))
    
    @database_sync_to_async
    def get_student(self, student_id):
        """Get student information"""
        return User.find_by_id(student_id)
    
    @database_sync_to_async
    def create_violation(self, quiz_id, student_id, violation_type, face_count, severity, metadata):
        """Create violation record in database"""
        return Violation.create(
            quiz_id=quiz_id,
            student_id=student_id,
            violation_type=violation_type,
            face_count=face_count,
            severity=severity,
            metadata=metadata
        )


class TeacherMonitoringConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for teacher's live monitoring dashboard
    Subscribes to all active quizzes
    """

    async def connect(self):
        """Handle WebSocket connection - verify JWT token"""
        self.teacher_id = self.scope['url_route']['kwargs'].get('teacher_id')
        self.room_group_name = f'teacher_monitor_{self.teacher_id}'

        # ── Token authentication via query param ──────────────────────────────
        try:
            from urllib.parse import parse_qs
            from .authentication import decode_token  # reuse existing helper
            qs = parse_qs(self.scope.get('query_string', b'').decode())
            token = (qs.get('token') or [None])[0]
            if not token:
                await self.close(code=4001)
                return
            # decode_token returns JWT payload: {'user_id': str, 'role': str, 'exp': ...}
            payload = decode_token(token)
            if not payload:
                await self.close(code=4001)
                return
            # Verify the teacher_id in URL matches token's user_id
            token_user_id = str(payload.get('user_id', ''))
            token_role = str(payload.get('role', '')).strip().lower()
            if token_user_id != str(self.teacher_id) or token_role != 'teacher':
                await self.close(code=4001)
                return
        except Exception:
            await self.close(code=4001)
            return
        # ─────────────────────────────────────────────────────────────────────

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to teacher monitoring channel'
        }))
    
    async def disconnect(self, close_code):
        """Handle WebSocket disconnection"""
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )
    
    async def receive(self, text_data):
        """Handle incoming messages"""
        try:
            data = json.loads(text_data)
            message_type = data.get('type')
            
            if message_type == 'subscribe_quiz':
                quiz_id = data.get('quiz_id')
                await self.subscribe_to_quiz(quiz_id)
            elif message_type == 'ping':
                await self.send(text_data=json.dumps({'type': 'pong'}))
                
        except Exception as e:
            await self.send(text_data=json.dumps({
                'type': 'error',
                'message': str(e)
            }))
    
    async def subscribe_to_quiz(self, quiz_id):
        """Subscribe to a specific quiz's proctoring events"""
        quiz_group = f'proctor_{quiz_id}'
        await self.channel_layer.group_add(
            quiz_group,
            self.channel_name
        )
        
        await self.send(text_data=json.dumps({
            'type': 'subscribed',
            'quiz_id': quiz_id,
            'message': f'Subscribed to quiz {quiz_id}'
        }))
    
    async def violation_broadcast(self, event):
        """Forward violation alerts to teacher"""
        await self.send(text_data=json.dumps({
            'type': 'VIOLATION_ALERT',
            'violation': event['violation']
        }))

    async def submission_broadcast(self, event):
        """Notify teacher when a student submits a quiz (live results)."""
        await self.send(text_data=json.dumps({
            'type': 'QUIZ_SUBMISSION',
            'submission': event['submission'],
        }))
