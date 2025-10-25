from models.risk_models import RiskAssessment
import os 
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# TO DO: create function to accept weights for different risk factors from bank -> ICEBOX
# these are just default values 
WEIGHTS = {
     "income_consistency": 0.4, 
     "income_trend": 0.3,
     "document_authenticity": 0.25,
     "payment_frequency": 0.15,
}

async def assess_fraud_risk(parsed_data: dict, raw_text: str) -> RiskAssessment:
    """
    Uses Gemini API to assess fraud risk based on parsed financial data.
    Returns a RiskAssessment Pydantic model."""

    # TO DO : implement format and consistency check (e.g. name, platform, etc.)

    # GEMINI AI SCORING 
    prompt = f"""
    You are a document authenticity analyst. The following text is extracted from a financial record.
    Assess the likelihood that this document is synthetic or tampered with.
     
    Respond with a JSON object:
        {{
        "ai_fraud_risk": float between 0 and 1,
        "reasoning": "short explanation"
        }}
        
    Text:
    {raw_text}
     """

    try:
        response = client.models.generate_content(
            model="gemini-1.5-pro",
            contents=prompt
        )
        start = response.text.find("{")
        end = response.text.rfind("}") + 1
        ai_result = json.loads(response.text[start:end])
        ai_risk = float(ai_result.get("ai_fraud_risk", 0.3))
        ai_reason = ai_result.get("reasoning", "No detailed explanation provided.")
    except Exception as e:
        ai_risk = 0.3
        ai_reason = f"AI model error: {e}"

    # TO DO: implement individual component scoring logic 
    component_scores = {
        "income_consistency": None, 
         "income_trend": None,
        "document_authenticity": None,
        "payment_frequency": None,
    }

    # TO DO: replace None with actual scoring thresholds
    risk_score = sum(WEIGHTS[k] * v for k, v in component_scores.items())
    risk_level = (
        "High" if None else
        "Moderate" if None else
        "Low"
    )
     
    return RiskAssessment(
        risk_score="",
        risk_level="",
        ai_reason="",
        issues_detected=[],
    )