import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings


@csrf_exempt
@require_http_methods(["POST"])
def chat(request):
    try:
        data = json.loads(request.body)
        message = data.get('message')
        history = data.get('history', [])
        
        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)
        
        # Check if Gemini API key is configured
        if not settings.GEMINI_API_KEY:
            return JsonResponse({
                'response': 'Alice AI is running in demo mode. To enable full functionality, please add your GEMINI_API_KEY to the .env file.'
            })
        
        # Use Gemini API for AI responses
        try:
            import google.generativeai as genai
            
            genai.configure(api_key=settings.GEMINI_API_KEY)
            model = genai.GenerativeModel(
                model_name="gemini-1.5-flash",
                system_instruction="You are Alice, a helpful AI assistant for an exam proctoring platform. Be friendly, concise, and helpful."
            )
            
            # Build conversation history for Gemini
            chat_history = []
            for msg in history[-5:]:  # Last 5 messages for context
                role = "user" if msg.get('role') == 'user' else "model"
                chat_history.append({"role": role, "parts": [msg.get('content', '')]})
            
            chat_session = model.start_chat(history=chat_history)
            result = chat_session.send_message(message)
            
            return JsonResponse({'response': result.text})
            
        except Exception as e:
            return JsonResponse({
                'response': f'AI service error: {str(e)}. Running in demo mode.'
            })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
