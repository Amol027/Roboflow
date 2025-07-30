from sqlalchemy.orm import Session
from app.models import User
from app.auth.schemas import RegisterRequest, LoginRequest
from app.auth.utils import hash_password, verify_password, create_jwt_token
from fastapi import HTTPException

def register_user(data: RegisterRequest, db: Session):
    if db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already exists")
    
    user = User(
        name=data.name,
        email=data.email,
        contact_number=data.contact_number,
        hashed_password=hash_password(data.password),
        role="user"
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    return {
        "access_token": create_jwt_token(user.id),
        "user": {
            "id": user.id,
            "email": user.email
        }
    }

def login_user(data: LoginRequest, db: Session):
    user = db.query(User).filter(User.email == data.email).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {
        "access_token": create_jwt_token(user.id),
        "user": {
            "id": user.id,
            "email": user.email
        }
    }
