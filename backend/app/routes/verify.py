# backend/app/routes/verify.py
from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional, Dict, Any
import asyncio
import time

# Internal services (make sure these files exist)
from app.services.ocr_service import extract_text_from_image
from app.services.parsing_service import parse_document
from app.services.fraud_detection_service import assess_fraud_risk

router = APIRouter()

def _clean_text(t: str) -> str:
    if not t:
        return ""
    # simple de-noise for UI
    lines = [ln.strip() for ln in t.splitlines()]
    lines = [ln for ln in lines if ln]                 # drop blank lines
    return "\n".join(lines[:500])                      # cap for safety/UI

@router.post("/file", summary="Full pipeline: OCR → Parse → Risk (demo mode)")
async def verify_document(
    file: Optional[UploadFile] = File(None, description="Image/PDF of paystub/bank stmt"),
    # Optional shortcut: you can pass text directly if you want to bypass OCR during testing
    raw_text_override: Optional[str] = Form(None, description="If provided, OCR is skipped and this text is used")
) -> JSONResponse:
    """
    Returns:
    {
      success, meta, ocr: {raw_text, cleaned_text, model_used},
      parsing: {parsed, model_used},
      risk: {risk_score, risk_level, recommendation, component_scores, issues_detected, ai_reason, summary}
    }
    """
    t0 = time.time()

    # --- 1) OCR (or use override) ---
    if not file and not raw_text_override:
        raise HTTPException(status_code=400, detail="Provide an image/PDF file or raw_text_override.")

    try:
        if raw_text_override:
            raw_text = raw_text_override
            ocr_model = "manual-override"
            filename = "N/A (override)"
            content_type = "text/plain"
            size = len(raw_text_override.encode("utf-8"))
        else:
            filename = file.filename
            content_type = file.content_type or "application/octet-stream"
            # For UI/debug, get size before the read:
            # UploadFile doesn't expose size; read the bytes once and reuse for OCR
            file_bytes = await file.read()
            size = len(file_bytes)

            # repackage bytes back to UploadFile-like for your OCR service (simple shim)
            class _MemUpload:
                filename = filename
                content_type = content_type
                async def read(self_non):
                    return file_bytes

            raw_text = await extract_text_from_image(_MemUpload())
            ocr_model = "Gemini-Vision"  # keep in sync with your ocr_service
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OCR failed: {e}")

    cleaned_text = _clean_text(raw_text)

    # --- 2) Parsing with LLM ---
    try:
        parsed = await parse_document(cleaned_text or raw_text or "")
        parsing_model = "Gemini-2.5"     # set to your actual model name used in parsing_service
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Parsing failed: {e}")

    # --- 3) Risk scoring ---
    try:
        # assess_fraud_risk expects (parsed_dict, raw_text)
        risk = await assess_fraud_risk(parsed, raw_text=cleaned_text or raw_text or "")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Risk scoring failed: {e}")

    t1 = time.time()

    # --- 4) Pretty demo response ---
    payload: Dict[str, Any] = {
        "success": True,
        "meta": {
            "filename": filename,
            "content_type": content_type,
            "size_bytes": size,
            "elapsed_ms": int((t1 - t0) * 1000)
        },
        "ocr": {
            "model_used": ocr_model,
            "raw_text": raw_text,
            "cleaned_text": cleaned_text
        },
        "parsing": {
            "model_used": parsing_model,
            "parsed": parsed  # already a dict
        },
        "risk": {
            # `risk` is expected to be a pydantic model or dict—handle both
            **(risk.dict() if hasattr(risk, "dict") else risk)
        },
        # For demo mode UX: a single paragraph the MC can read out
        "summary_for_demo": _make_demo_summary(parsed, risk, filename)
    }
    return JSONResponse(payload)


def _make_demo_summary(parsed: Dict[str, Any], risk: Any, filename: str) -> str:
    """
    Friendly one-paragraph summary for demo narration.
    """
    name = parsed.get("name") or "Unknown worker"
    platform = parsed.get("platform") or "Unknown platform"
    date_range = parsed.get("date_range") or "Unknown period"
    total_income = parsed.get("income_estimate") or parsed.get("total_earnings") or "N/A"

    # normalize the risk object
    if hasattr(risk, "dict"):
        risk = risk.dict()
    level = (risk.get("risk_level") or "Unknown").title()
    score = risk.get("risk_score")
    rec = risk.get("recommendation") or "N/A"
    issues = risk.get("issues_detected") or []
    issues_str = "; ".join(issues[:3]) if issues else "No major issues detected"

    return (
        f"Processed '{filename}'. Extracted a document for {name} on {platform} "
        f"covering {date_range}. Estimated income: {total_income}. "
        f"Risk level is {level} (score: {score}). Key signals: {issues_str}. "
        f"Recommendation: {rec}."
    )
