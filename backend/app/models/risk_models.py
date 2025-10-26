from typing import Dict, List, Optional
from pydantic import BaseModel
from .parse_models import ParsedDocument

class RiskAssessment(BaseModel):
    risk_score: float
    risk_level: str
    ai_reason: str
    issues_detected: List[str]
    component_scores: Dict[str, float]
    recommendation: str
    parsed: Optional[ParsedDocument] = None
    doc_id: Optional[str] = None
