from sqlalchemy import Column, Integer, String, Float, LargeBinary, DateTime
from database import Base

class DetectionModelTraining(Base):
    __tablename__ = "detection_model_training"

    id = Column(Integer, primary_key=True, index=True)
    
    model_name = Column(String)
    raw_zip = Column(LargeBinary)
    output_zip = Column(LargeBinary)
    num_classes = Column(Integer)
    class_names = Column(String)
    data_size = Column(Integer)
    confidence_score = Column(Float)
    x_min = Column(Integer)
    y_min = Column(Integer)
    x_max = Column(Integer)
    y_max = Column(Integer)
    timestamp = Column(DateTime)
    status = Column(String)
   
