from fastapi import APIRouter, UploadFile, File
from app.services import ocr_service, parsing_service, fraud_detection_service
from app.utils import file_utils
from app.utils.log_utils import logger

router = APIRouter()

@router.post("/document")
async def verify_document(file: UploadFile = File(...)):
    try:
        # Validate file
        if not file_utils.validate_file_type(file.filename):
            return {"error": "Invalid file type"}
            
        # Extract text
        text = await ocr_service.extract_text(file)
        
        # Parse document
        parsed_data = await parsing_service.parse_document(text)
        
        # Assess risk
        risk_assessment = await fraud_detection_service.assess_risk(parsed_data)
        
        return {
            "parsed_data": parsed_data,
            "risk_assessment": risk_assessment
        }
        
    except Exception as e:
        logger.error(f"Error processing document: {str(e)}")
        return {"error": "Failed to process document"}