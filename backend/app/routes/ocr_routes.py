from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models.ocr_models import OCRResult
from app.services.ocr_proc import process_image
import tempfile

router = APIRouter(prefix="/ocr", tags=["OCR"])

@router.post("/", response_model=OCRResult)
async def run_ocr(file: UploadFile = File(...)):
    """Upload an image and extract text using Tesseract."""
    try:
        # Save the uploaded file to a temporary path
        with tempfile.NamedTemporaryFile(delete=False, suffix=".png") as tmp:
            tmp.write(await file.read())
            tmp_path = tmp.name

        # Run OCR
        result = process_image(tmp_path)
        return result

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
