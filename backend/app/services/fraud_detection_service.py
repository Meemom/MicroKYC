from models.risk_models import RiskAssessment
from google import genai
from dotenv import load_dotenv

load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

async def assess_fraud_risk(transaction_data: dict) -> RiskAssessment:
     return RiskAssessment(
        risk_score="",
        risk_level="",
        ai_reason="",
        issues_detected=[],
    )