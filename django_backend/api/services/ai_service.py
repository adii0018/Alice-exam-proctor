from django.conf import settings
import google.generativeai as genai

class AIService:
    @staticmethod
    def chat(message, history):
        if not message:
            raise ValueError('Message is required')
            
        if not settings.GEMINI_API_KEY:
            return 'Alice AI is running in demo mode. To enable full functionality, please add your GEMINI_API_KEY to the .env file.'
            
        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction="You are Alice, a helpful AI assistant for an exam proctoring platform. Be friendly, concise, and helpful."
            )
            
            chat_history = []
            for msg in history[-5:]:
                role = "user" if msg.get('role') == 'user' else "model"
                chat_history.append({"role": role, "parts": [msg.get('content', '')]})
            
            chat_session = model.start_chat(history=chat_history)
            result = chat_session.send_message(message)
            
            return result.text
        except Exception as e:
            return f'AI service error: {str(e)}. Running in demo mode.'
