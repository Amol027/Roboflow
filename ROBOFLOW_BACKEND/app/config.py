# app/config.py
from pydantic_settings import BaseSettings  # ✅ updated import
from pydantic import EmailStr

class Settings(BaseSettings):
    DATABASE_URL: str
    JWT_SECRET_KEY: str
    OTP_EXPIRY_MINUTES: int
    EMAIL_HOST: str
    EMAIL_PORT: int
    EMAIL_SENDER: str
    EMAIL_PASSWORD: str

    class Config:
        env_file = ".env"

settings = Settings()
