from fastapi import APIRouter
from pydantic import BaseModel
from app.services.parsing_service import parse_document
from app.services.fraud_detection_service import assess_fraud_risk


router = APIRouter()

class VerificationRequest(BaseModel):
    text: str


@router.post("/gig_worker")
async def verify_gig_worker(request: VerificationRequest):
    # Step 1: OCR component is ignored as requested.
    # We now expect raw text to be passed in the request.
    text = request.text

    # step 2: Parse fields via gemini API 
    parsed_data = await parse_document(text) # returns json dict


    # Step 3: Fraud detection / risk score
    risk_data = await assess_fraud_risk(parsed_data, text)


    return {**parsed_data, **risk_data.dict()}