from pydantic import BaseModel

class RiskAssessment(BaseModel):
    risk_score: float
    risk_level: str
    ai_reason: str
    issues_detected: list[str]
    component_scores: dict[ str, float ]