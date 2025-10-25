from pydantic import BaseModel

class RiskAssessment(BaseModel):
    risk_score: float
    risk_level: str
    summary: str