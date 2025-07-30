from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Float, LargeBinary, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
from datetime import datetime  # ✅ Fixed import

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True)
    contact_number = Column(String)
    hashed_password = Column(String, nullable=False)
    role = Column(String, default="user")  # roles: admin, user

    projects = relationship("Project", back_populates="user")


class Project(Base):
    __tablename__ = "projects"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    description = Column(String)
    user_id = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="projects")
    models = relationship("ModelUsed", back_populates="project")


class ModelUsed(Base):
    __tablename__ = "models"
    id = Column(Integer, primary_key=True, index=True)
    feature_name = Column(String, nullable=False)
    model_type = Column(String, nullable=False)
    status = Column(String, default="pending")
    output_url = Column(String)
    project_id = Column(Integer, ForeignKey("projects.id"))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    project = relationship("Project", back_populates="models")

#features
#1.classification:
class classification_training(Base):
    __tablename__ = "classification_training"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer)
    model_name = Column(String)
    train_accuracy = Column(Float)
    val_accuracy = Column(Float)
    precision = Column(Float)
    recall = Column(Float)
    model_blob = Column(LargeBinary)
    class_names = Column(String)  # Comma-separated class labels
    timestamp = Column(DateTime, default=datetime.utcnow)

class classification_prediction(Base):
    __tablename__ = "classification_prediction"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String)
    predicted_class = Column(String)
    confidence_score = Column(Float)
    image_path = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)

class AnnotationRun(Base):
    __tablename__ = "annotation_runs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, index=True)
    model_used = Column(String)
    input_zip = Column(LargeBinary)
    output_zip = Column(LargeBinary)
    timestamp = Column(DateTime, default=datetime.utcnow)

    # ✅ Add this to fix the error
    training_runs = relationship("KeypointTrainingRun", back_populates="annotation", cascade="all, delete-orphan")


class KeypointTrainingRun(Base):
    __tablename__ = "keypoint_training_runs"
    
    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(String, nullable=False)
    annotation_id = Column(Integer, ForeignKey("annotation_runs.id", ondelete="CASCADE"), nullable=False)
    model_used = Column(String, nullable=False)  # "yolov8n" or "yolov8x"
    trained_model = Column(LargeBinary, nullable=False)  # The best .pt model binary

    # Separate metric columns
    precision = Column(Float, nullable=True)
    recall = Column(Float, nullable=True)
    map50 = Column(Float, nullable=True)
    map50_95 = Column(Float, nullable=True)

    timestamp = Column(DateTime, default=datetime.utcnow)

    annotation = relationship("AnnotationRun", back_populates="training_runs")
    predictions = relationship("PosePredictionRecord", back_populates="training", cascade="all, delete-orphan")

class PosePredictionRecord(Base):
    __tablename__ = "pose_prediction"

    id = Column(Integer, primary_key=True, index=True)
    training_id = Column(Integer, ForeignKey("keypoint_training_runs.id", ondelete="CASCADE"), nullable=False)
    input_zip = Column(LargeBinary, nullable=False)
    output_zip = Column(LargeBinary, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    training = relationship("KeypointTrainingRun", back_populates="predictions")
