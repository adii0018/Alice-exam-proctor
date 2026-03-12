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
        
        # Check if Groq API key is configured
        if not settings.GROQ_API_KEY:
            return JsonResponse({
                'response': 'Alice AI is running in demo mode. To enable full functionality, please add your GROQ_API_KEY to the .env file. Get a free API key from https://console.groq.com/'
            })
        
        # Use Groq API for AI responses
        try:
            from groq import Groq
            
            client = Groq(api_key=settings.GROQ_API_KEY)
            
            messages = [
                {"role": "system", "content": "You are Alice, a helpful AI assistant for an exam proctoring platform. Be friendly, concise, and helpful."}
            ]
            
            # Add conversation history
            for msg in history[-5:]:  # Last 5 messages for context
                messages.append({
                    "role": msg.get('role'),
                    "content": msg.get('content')
                })
            
            messages.append({"role": "user", "content": message})
            
            completion = client.chat.completions.create(
                model="mixtral-8x7b-32768",
                messages=messages,
                temperature=0.7,
                max_tokens=500
            )
            
            response = completion.choices[0].message.content
            
            return JsonResponse({'response': response})
            
        except Exception as e:
            return JsonResponse({
                'response': f'AI service error: {str(e)}. Running in demo mode.'
            })
    
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
