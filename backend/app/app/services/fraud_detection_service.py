from app.models.risk_models import RiskAssessment
import google.generativeai as genai
import os

# Configure Gemini
genai.configure(api_key=os.getenv('GEMINI_API_KEY'))
model = genai.GenerativeModel('gemini-pro')

async def assess_risk(parsed_data: dict) -> RiskAssessment:
    # Use Gemini to assess risk
    prompt = f"""
    Please assess the risk level for this freelancer based on the following data:
    {parsed_data}
    
    Consider:
    1. Income stability
    2. Platform reputation
    3. Length of history
    
    Provide:
    1. Risk score (0-1)
    2. Risk level (Low/Medium/High)
    3. Brief summary
    """
    
    response = model.generate_content(prompt)
    # TODO: Process the response to extract structured assessment
    
    # For now, using example assessment
    return RiskAssessment(
        risk_score=0.3,
        risk_level="Low",
        summary="Stable income on reputable platform"
    )