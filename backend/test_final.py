import pytest
from app.services.parsing_service import parse_document
from app.services.fraud_detection_service import assess_fraud_risk

@pytest.mark.asyncio
async def test_parsing_to_fraud_detection_integration():
    # Test data
    sample_text = """
    Name: John Doe
    Date of Birth: 1990-01-01
    Document Number: ABC123456
    """
    
    # Test parsing
    parsed_data = await parse_document(sample_text)
    assert parsed_data is not None
    assert "name" in parsed_data
    
    # Test fraud detection with parsed data
    risk_assessment = await assess_fraud_risk(parsed_data, raw_text=sample_text)
    assert risk_assessment.risk_score >= 0.0
    assert risk_assessment.risk_score <= 1.0
    assert risk_assessment.risk_level in ["LOW", "MEDIUM", "HIGH"]
    assert isinstance(risk_assessment.summary, str)
    assert isinstance(risk_assessment.issues_detected, list)
    assert isinstance(risk_assessment.component_scores, dict)