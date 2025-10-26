# verify.py
from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException
from pydantic import BaseModel
from app.services.parsing_service import parse_document
from app.services.fraud_detection_service import assess_fraud_risk
import PyPDF2
import io
from PIL import Image
from fastapi.middleware.cors import CORSMiddleware
from flask import jsonify, make_response

app = FastAPI()
origins = [
        "http://localhost",
        "http://localhost:3003",
    ]

app.add_middleware(
        CORSMiddleware,
        allow_origins=origins,
        allow_credentials=True,
        allow_methods=["*"],  # Allows all methods (GET, POST, PUT, DELETE, etc.)
        allow_headers=["*"],  # Allows all headers
)

router = APIRouter()

class VerificationRequest(BaseModel):
    text: str

@router.get("/health")
async def health_check():
    return {"status": "ok"}


# NEW ENDPOINT: Accept file uploads
@router.post("verify/gig_worker/upload")
async def verify_gig_worker_upload(file: UploadFile = File(...)):
    """
    Accept PDF or image file, extract text via OCR, then verify
    """
    
    try:
        print("hello")  
        # Read file content
        content = await file.read()
        
        # Extract text based on file type
        if file.filename.endswith('.pdf'):
            text = extract_text_from_pdf(content)
        elif file.filename.endswith(('.png', '.jpg', '.jpeg')):
            text = extract_text_from_image(content)
        else:
            raise HTTPException(status_code=400, detail="Unsupported file type")
        
        if not text or len(text.strip()) < 10:
            raise HTTPException(status_code=400, detail="Could not extract text from document")
        
        # Step 2: Parse fields via gemini API / parsing service
        parsed_data = await parse_document(text)
        
        # Step 3: Fraud detection / risk score
        risk_data = await assess_fraud_risk(parsed_data, text)
        
        # Return response in the structure your frontend expects
        response = {
            "name": parsed_data.get("name"),
            "platform": parsed_data.get("platform"),
            "income_estimate": parsed_data.get("income_estimate"),
            "date_range": parsed_data.get("date_range"),
            "risk_score": risk_data.risk_score,
            "risk_level": risk_data.risk_level,
            "ai_reason": risk_data.ai_reason,
            "issues_detected": risk_data.issues_detected or [],
            "component_scores": risk_data.component_scores or {},
            "verified": True,
            "extracted_text_preview": text[:200] + "..." if len(text) > 200 else text
        }

        
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")


# KEEP OLD ENDPOINT: For direct text input
@router.post("/gig_worker")
async def verify_gig_worker(request: VerificationRequest):
    """
    Accept raw text directly
    """
    text = request.text
    parsed_data = await parse_document(text)
    risk_data = await assess_fraud_risk(parsed_data, text)
    return {
        **parsed_data,
        **risk_data.dict(),
        "verified": True
    }


# Helper functions for OCR
def extract_text_from_pdf(content: bytes) -> str:
    """Extract text from PDF bytes"""
    pdf_file = io.BytesIO(content)
    pdf_reader = PyPDF2.PdfReader(pdf_file)
    text = ""
    for page in pdf_reader.pages:
        page_text = page.extract_text()
        if page_text:
            text += page_text
    return text


def extract_text_from_image(content: bytes) -> str:
    """Extract text from image bytes using OCR"""
    image = Image.open(io.BytesIO(content))
    text = pytesseract.image_to_string(image)
    return text


