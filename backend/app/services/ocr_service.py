import os
from fastapi import UploadFile
from app.services.ocr_proc import process_image
from app.models.ocr_models import OCRResult

async def extract_text(file: UploadFile) -> OCRResult:
    """Save uploaded image temporarily and extract text."""
    temp_path = f"/tmp/{file.filename}"

    # Save file temporarily
    contents = await file.read()
    with open(temp_path, "wb") as f:
        f.write(contents)

    # Run OCR
    text = process_image(temp_path)

    # Clean up temp file
    os.remove(temp_path)

    return OCRResult(text=text)
