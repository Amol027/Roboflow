from passlib.context import CryptContext
from jose import jwt
from app.config import settings
import smtplib
from email.mime.text import MIMEText
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password):
    return pwd_context.hash(password)

def verify_password(password, hashed):
    return pwd_context.verify(password, hashed)

from datetime import datetime, timedelta

def create_jwt_token(user_id: int):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(days=7)  # Token valid for 7 days
    }
    return jwt.encode(payload, settings.JWT_SECRET_KEY, algorithm="HS256")


def generate_otp():
    return str(random.randint(100000, 999999))

def send_email_otp(receiver_email: str, otp: str):
    msg = MIMEText(f"Your OTP code is: {otp}")
    msg["Subject"] = "Your OTP Code"
    msg["From"] = settings.EMAIL_SENDER
    msg["To"] = receiver_email

    with smtplib.SMTP(settings.EMAIL_HOST, settings.EMAIL_PORT) as server:
        server.starttls()
        server.login(settings.EMAIL_SENDER, settings.EMAIL_PASSWORD)
        server.send_message(msg)
