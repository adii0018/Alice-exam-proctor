from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.core.mail import send_mail
from django.conf import settings
import json

@csrf_exempt
@require_http_methods(["POST"])
def send_contact_email(request):
    """Handle contact form submissions"""
    try:
        data = json.loads(request.body)
        
        name = data.get('name', '').strip()
        email = data.get('email', '').strip()
        subject = data.get('subject', '').strip()
        message = data.get('message', '').strip()
        
        # Validation
        if not all([name, email, subject, message]):
            return JsonResponse({
                'success': False,
                'error': 'All fields are required'
            }, status=400)
        
        # Email content
        email_subject = f"Contact Form: {subject}"
        email_body = f"""
New Contact Form Submission

From: {name}
Email: {email}
Subject: {subject}

Message:
{message}

---
This email was sent from the Alice Proctor contact form.
        """
        
        # Send email
        try:
            send_mail(
                subject=email_subject,
                message=email_body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=['singhrajputaditya982@gmail.com'],
                fail_silently=False,
            )
            
            return JsonResponse({
                'success': True,
                'message': 'Your message has been sent successfully! We will get back to you soon.'
            })
            
        except Exception as email_error:
            print(f"Email sending error: {str(email_error)}")
            return JsonResponse({
                'success': False,
                'error': 'Failed to send email. Please try again later.'
            }, status=500)
            
    except json.JSONDecodeError:
        return JsonResponse({
            'success': False,
            'error': 'Invalid JSON data'
        }, status=400)
        
    except Exception as e:
        print(f"Contact form error: {str(e)}")
        return JsonResponse({
            'success': False,
            'error': 'An error occurred. Please try again later.'
        }, status=500)
