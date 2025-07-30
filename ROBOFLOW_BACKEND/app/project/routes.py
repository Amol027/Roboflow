from fastapi import APIRouter, Depends, HTTPException, Header
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Project, ModelUsed, User
from app.project.schemas import ProjectCreate, ProjectResponse
from jose import jwt, JWTError
from app.config import settings

router = APIRouter()

def get_current_user_role(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        token = authorization.split(" ")[-1]
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("user_id")
        user = db.query(User).filter(User.id == user_id).first()
        return user
    except:
        raise HTTPException(status_code=401, detail="Invalid token")

@router.post("/", response_model=ProjectResponse)
def create_project(
    data: ProjectCreate,
    db: Session = Depends(get_db),
    user: User = Depends(get_current_user_role)
):
    # ✅ Allow both user and admin
    if user.role not in ["admin", "user"]:
        raise HTTPException(status_code=403, detail="Unauthorized to create projects")

    # ✅ Link project to current user
    project = Project(
        name=data.name,
        description=data.description,
        user_id=user.id
    )

    db.add(project)
    db.commit()
    db.refresh(project)
    return project