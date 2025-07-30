from sqlalchemy import Column, Integer, String, Text, LargeBinary, DateTime
from database import Base
import datetime

class NERModelTraining(Base):
    __tablename__ = "ner_model_training"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True)
    project_name = Column(String, default="")
    task_name = Column(String, default="")
    model_name = Column(String, nullable=False)
    input_text = Column(Text, nullable=False)
    input_file = Column(LargeBinary, nullable=False)
    entities = Column(Text, nullable=False)
    csv_data = Column(LargeBinary, nullable=False)
    num_entities = Column(Integer, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    status = Column(String, default="Pending")
    model_path = Column(String, nullable=False)
