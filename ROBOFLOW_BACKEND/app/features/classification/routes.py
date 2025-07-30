from fastapi import APIRouter, UploadFile, File, Form, HTTPException, Query,Depends
from fastapi.responses import JSONResponse
from app.features.classification.mobilenet_processor import MobileNetTrainer
from app.features.classification.resnet_processor import ResNetTrainer
from app.database import SessionLocal,get_db
from app.models import classification_training, classification_prediction
import logging
from sqlalchemy.orm import Session

router = APIRouter()
logger = logging.getLogger(__name__)

def get_trainer(model_name: str, project_id: str, num_classes: int, class_names: list):
    model_name = model_name.lower()
    if model_name == "mobilenet":
        return MobileNetTrainer(project_id, num_classes, class_names)
    elif model_name == "resnet":
        return ResNetTrainer(project_id, num_classes, class_names)
    else:
        raise ValueError(f"Unsupported model: {model_name}")


@router.post("/train")
async def train_model(
    project_id: int = Form(...),
    num_classes: int = Form(...),
    class_names: str = Form(...),  # comma-separated
    model_name: str = Form(...),
    file: UploadFile = File(...)
):
    try:
        zip_bytes = await file.read()
        class_list = class_names.split(",")

        trainer = get_trainer(model_name, project_id, num_classes, class_list)
        result = trainer.process_and_train(zip_bytes)

        if "error" not in result:
            db = SessionLocal()
            log = classification_training(
                project_id=project_id,
                model_name=model_name,
                train_accuracy=result["train_accuracy"],
                val_accuracy=result["val_accuracy"],
                precision=result["precision"],
                recall=result["recall"],
                model_blob=trainer.model_blob,
                class_names=class_names,
            )
            db.add(log)
            db.commit()
            db.refresh(log)
            model_id = log.id
            db.close()

            result["model_id"] = model_id

        return JSONResponse(content=result)

    except Exception as e:
        logger.exception("Training failed.")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/predict")
async def predict_image(
    model_id: int = Form(...),
    file: UploadFile = File(...)
):
    try:
        image_bytes = await file.read()

        # Load metadata to decide trainer type
        db = SessionLocal()
        log = db.query(classification_training).filter_by(id=model_id).first()
        db.close()

        if not log:
            raise HTTPException(status_code=404, detail="Model not found")

        model_name = log.model_name.lower()
        if model_name == "mobilenet":
            trainer = MobileNetTrainer.load_local(model_id)
        elif model_name == "resnet":
            trainer = ResNetTrainer.load_local(model_id)
        else:
            raise HTTPException(status_code=400, detail="Unsupported model type in database")

        result = trainer.predict_from_bytes(image_bytes)

        db = SessionLocal()
        log_entry = classification_prediction(
            project_id=trainer.project,
            predicted_class=result["predicted_class"],
            confidence_score=result["confidence_score"],
            image_path=f"model-id-{model_id}"
        )
        db.add(log_entry)
        db.commit()
        db.close()

        return JSONResponse(content=result)

    except Exception as e:
        logger.exception("Prediction failed.")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/auto-label/metrics")
def get_training_metrics(training_id: int = Query(...), db: Session = Depends(get_db)):
    try:
        training_record = db.query(classification_training).filter(classification_training.id == training_id).first()

        if not training_record:
            raise HTTPException(status_code=404, detail="Training record not found for the given ID")

        metrics = {
            "train_accuracy": training_record.train_accuracy,
            "val_accuracy": training_record.val_accuracy,
            "precision": training_record.precision,
            "recall": training_record.recall,
        }

        return JSONResponse(content={"status": "Training Successfull", "metrics": metrics})
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
