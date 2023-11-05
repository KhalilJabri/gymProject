from django.core.mail import send_mail, EmailMessage
from django.conf import settings

def send_otp_via_email(email, content):
    email = EmailMessage('Verification Code', content, settings.EMAIL_HOST, [email])
    email.content_subtype = 'html'  # Set the content type as HTML
    email.send()

def send_greetings_mail_coach(email, content):
    email = EmailMessage('Greeting Mail', content, settings.EMAIL_HOST, [email])
    email.content_subtype = 'html'
    try:
        email.send()
    except Exception as e:
        print(f"Error sending email to : {str(e)}")

def send_greetings_mail_employee(email, content):
    email = EmailMessage('Greeting Mail', content, settings.EMAIL_HOST, [email])
    email.content_subtype = 'html'
    try:
        email.send()
    except Exception as e:
        print(f"Error sending email to : {str(e)}")

def send_greetings_mail_Member(email, content):
    email = EmailMessage('Greeting Mail', content, settings.EMAIL_HOST, [email])
    email.content_subtype = 'html'
    try:
        email.send()
    except Exception as e:
        print(f"Error sending email to : {str(e)}")

def send_reminder_mail(email, content):
    email = EmailMessage('Votre adhésion au gymnase a expiré.', content, settings.EMAIL_HOST, [email])
    email.content_subtype = 'html'
    # email.send()
    try:
        email.send()
    except Exception as e:
        # Handle any email sending errors here
        print(f"Error sending email to : {str(e)}")