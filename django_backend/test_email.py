"""
Quick script to test email configuration
Run: python test_email.py
"""

import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'exam_proctoring.settings')
django.setup()

from django.core.mail import send_mail
from django.conf import settings

def test_email():
    print("Testing email configuration...")
    print(f"From: {settings.EMAIL_HOST_USER}")
    print(f"To: singhrajputaditya982@gmail.com")
    
    try:
        send_mail(
            subject='Test Email - Alice Proctor Contact Form',
            message='This is a test email from Alice Proctor contact form setup. If you receive this, email configuration is working correctly!',
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=['singhrajputaditya982@gmail.com'],
            fail_silently=False,
        )
        print("✅ Email sent successfully!")
        print("Check your inbox: singhrajputaditya982@gmail.com")
        
    except Exception as e:
        print(f"❌ Error sending email: {str(e)}")
        print("\nTroubleshooting:")
        print("1. Check EMAIL_HOST_USER in .env file")
        print("2. Check EMAIL_HOST_PASSWORD (use Gmail App Password)")
        print("3. Make sure 2-Step Verification is enabled on Gmail")
        print("4. Generate App Password from: https://myaccount.google.com/apppasswords")

if __name__ == '__main__':
    test_email()
