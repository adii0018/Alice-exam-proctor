import json
import requests as http_requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.conf import settings

ALICE_SYSTEM_PROMPT = (
    "You are Alice, a friendly and helpful AI assistant for an online exam proctoring platform. "
    "You help teachers create exams, manage students, understand violations, and use the platform effectively. "
    "You also help students understand the exam process and proctoring rules. "
    "Be concise, warm, and professional. Use emojis occasionally to be friendly."
)


def _chat_via_groq(message, history):
    """Use Groq API (free, 14,400 req/day) — no extra package needed."""
    api_key = settings.GROQ_API_KEY

    messages = [{"role": "system", "content": ALICE_SYSTEM_PROMPT}]
    for msg in history[-10:]:
        role = "user" if msg.get('role') == 'user' else "assistant"
        messages.append({"role": role, "content": msg.get('content', '')})
    messages.append({"role": "user", "content": message})

    resp = http_requests.post(
        "https://api.groq.com/openai/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "model": "llama-3.1-8b-instant",
            "messages": messages,
            "max_tokens": 512,
            "temperature": 0.7,
        },
        timeout=30,
    )
    resp.raise_for_status()
    return resp.json()["choices"][0]["message"]["content"]


def _chat_via_gemini(message, history):
    """Fallback: Use Gemini API."""
    import google.generativeai as genai

    genai.configure(api_key=settings.GEMINI_API_KEY)
    model = genai.GenerativeModel(
        model_name="gemini-2.0-flash",
        system_instruction=ALICE_SYSTEM_PROMPT,
    )

    chat_history = []
    for msg in history[-10:]:
        role = "user" if msg.get('role') == 'user' else "model"
        chat_history.append({"role": role, "parts": [msg.get('content', '')]})

    chat_session = model.start_chat(history=chat_history)
    result = chat_session.send_message(message)
    return result.text


@csrf_exempt
@require_http_methods(["POST"])
def chat(request):
    try:
        data = json.loads(request.body)
        message = data.get('message')
        history = data.get('history', [])

        if not message:
            return JsonResponse({'error': 'Message is required'}, status=400)

        groq_key = settings.GROQ_API_KEY
        gemini_key = settings.GEMINI_API_KEY

        # --- Try Groq first (primary) ---
        if groq_key:
            try:
                reply = _chat_via_groq(message, history)
                return JsonResponse({'response': reply})
            except Exception as e:
                err = str(e)
                import traceback
                print(f"\n[Alice/Groq ERROR]\n{traceback.format_exc()}\n")
                # Show Groq error directly — don't fall through to broken Gemini
                return JsonResponse({
                    'response': f'❌ Groq error: {err[:300]}'
                })

        # --- Try Gemini as fallback (only if no Groq key) ---
        if gemini_key:
            try:
                reply = _chat_via_gemini(message, history)
                return JsonResponse({'response': reply})
            except Exception as e:
                err = str(e)
                import traceback
                print(f"\n[Alice/Gemini ERROR]\n{traceback.format_exc()}\n")

                if '429' in err or 'RESOURCE_EXHAUSTED' in err or 'quota' in err.lower():
                    return JsonResponse({
                        'response': (
                            '⏳ Gemini quota khatam ho gayi.\n\n'
                            'Groq FREE key use karo (recommended):\n'
                            '1. console.groq.com jao\n'
                            '2. API Keys → Create Key\n'
                            '3. .env mein GROQ_API_KEY paste karo\n'
                            '4. Django restart karo ✅'
                        )
                    })
                return JsonResponse({'response': f'❌ Gemini error: {err[:200]}'})

        # --- No key configured ---
        return JsonResponse({
            'response': (
                '🔑 Koi AI key configure nahi hai.\n\n'
                'FREE Groq key banao (2 min):\n'
                '1. console.groq.com jao\n'
                '2. Sign up → API Keys → Create Key\n'
                '3. .env mein GROQ_API_KEY=gsk_... paste karo\n'
                '4. Django restart karo ✅'
            )
        })

    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)
