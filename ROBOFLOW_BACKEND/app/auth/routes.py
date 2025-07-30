from fastapi import APIRouter, Depends, HTTPException, status, Body
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from app.database import get_db, add_to_blacklist
from app.models import User
from app.auth.schemas import RegisterRequest, LoginRequest, AuthResponse
from app.auth.service import register_user, login_user
from app.auth.utils import generate_otp, send_email_otp, hash_password, create_jwt_token
from app.auth.otp_store import otp_map, resend_cooldown_map
from app.auth.dependencies import get_current_user
from datetime import datetime, timedelta
from app.config import settings

router = APIRouter()

@router.post("/register", response_model=AuthResponse)
def register(data: RegisterRequest, db: Session = Depends(get_db)):
    return register_user(data, db)

@router.post("/login", response_model=AuthResponse)
def login(data: LoginRequest, db: Session = Depends(get_db)):
    return login_user(data, db)

@router.post("/logout")
async def logout(current_user=Depends(get_current_user)):
    token = current_user.token
    add_to_blacklist(token)
    return JSONResponse(status_code=status.HTTP_200_OK, content={"message": "Logged out successfully"})

@router.post("/send-otp")
def send_otp(payload: dict = Body(...)):
    email = payload.get("email")
    if not email:
        raise HTTPException(status_code=400, detail="Email is required")

    now = datetime.utcnow()
    cooldown = resend_cooldown_map.get(email)
    if cooldown and (now - cooldown).total_seconds() < 60:
        raise HTTPException(status_code=429, detail="Please wait before requesting another OTP")

    otp = generate_otp()
    expiry = now + timedelta(minutes=settings.OTP_EXPIRY_MINUTES)
    otp_map[email] = {"otp": otp, "expires_at": expiry}
    resend_cooldown_map[email] = now

    send_email_otp(email, otp)
    return {"message": "OTP sent"}

@router.post("/verify-otp")
def verify_otp(email: str, otp: str):
    record = otp_map.get(email)
    if not record:
        raise HTTPException(status_code=404, detail="OTP not found")
    if record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if datetime.utcnow() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")
    return {"message": "OTP verified"}

@router.post("/reset-password")
def reset_password(email: str, otp: str, new_password: str, db: Session = Depends(get_db)):
    record = otp_map.get(email)
    if not record:
        raise HTTPException(status_code=404, detail="OTP not found")
    if record["otp"] != otp:
        raise HTTPException(status_code=400, detail="Invalid OTP")
    if datetime.utcnow() > record["expires_at"]:
        raise HTTPException(status_code=400, detail="OTP expired")

    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.hashed_password = hash_password(new_password)
    db.commit()

    token = create_jwt_token(user.id)
    return {"message": "Password reset successful", "token": token}
