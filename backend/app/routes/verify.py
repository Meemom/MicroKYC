from fastapi import APIRouter, UploadFile, File
from services.ocr_service import extract_text
from services.parsing_service import parse_document
from services.fraud_detection_service import assess_fraud_risk


router = APIRouter()


@router.post("/gig_worker")
async def verify_gig_worker(file: UploadFile = File(...)):
    # step 1: OCR 
    text = await extract_text(file)


    # step 2: Parse fields via gemini API 
    parsed_data = await parse_document(text) # returns json dict


    # Step 3: Fraud detection / risk score
    risk_data = await assess_fraud_risk(parsed_data, text)


    return {**parsed_data, **risk_data}