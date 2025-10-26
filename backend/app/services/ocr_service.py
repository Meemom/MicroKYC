<<<<<<< Updated upstream
import pytesseract
from fastapi import UploadFile
from models.ocr_models import OCRResult  # optional if you have this model

async def extract_text(file: UploadFile) -> str:
    # Save uploaded file temporarily
    contents = await file.read()
    with open(f"/tmp/{file.filename}", "wb") as f:
        f.write(contents)

    # OCR extraction
    text = pytesseract.image_to_string(f"/tmp/{file.filename}")
    return text
=======
import os
from dotenv import load_dotenv
import google.generativeai as genai
from fastapi import UploadFile

load_dotenv()

genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_NAME = "models/gemini-2.5-pro"

model = genai.GenerativeModel(MODEL_NAME)

async def extract_text_from_image(file: UploadFile) -> str:
    """
    OCR using Gemini Vision — no Tesseract needed.
    Works with JPG, PNG, PDF scan images.
    """
    img_bytes = await file.read()

    image_part = {
        "mime_type": file.content_type or "image/png",
        "data": img_bytes
    }

    prompt = "Extract ALL readable text from this document. Return plain text only."

    try:
        response = model.generate_content(
            [prompt, image_part]
        )
        return (response.text or "").strip()
    except Exception as e:
        print(f"⚠️ OCR Error: {e}")
        return ""
>>>>>>> Stashed changes
