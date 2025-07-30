from sqlalchemy import Column, Integer, String, Float, LargeBinary, DateTime
from db import Base
from datetime import datetime

class PolygonAnnotationRecord(Base):
    __tablename__ = "polygon_annotations"

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, nullable=False)
    task_name = Column(String, nullable=False)
    model_name = Column(String, nullable=False)
    model_path = Column(String)
    image_name = Column(String)
    object_count = Column(Integer)
    output_image = Column(LargeBinary)
    status = Column(String, default="Pending")
    created_at = Column(DateTime, default=datetime.utcnow)
