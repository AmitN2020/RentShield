import os
import logging
from typing import Optional, Tuple
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

from app.schemas.analysis import ContractAnalysisResult, RiskLevel
from app.services.pdf_parser import extract_text_from_pdf
from app.services.scoring_engine import (
    calculate_overall_risk,
    detect_missing_clauses,
    extract_bengaluru_specific_alerts
)
from app.services.llm.factory import LLMProviderFactory

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("rara_backend")

app = FastAPI(
    title="Rental Agreement Risk Analyzer API",
    version="1.0.0",
    description="LLM-powered Bengaluru rental agreement analyzer with deterministic risk scoring."
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/api/v1/health")
async def health_check():
    status = LLMProviderFactory.get_providers_status()
    return {
        "status": "healthy",
        "service": "Rental Agreement Risk Analyzer",
        "location_focus": "Bengaluru, Karnataka",
        "default_provider": status["default_provider"],
        "providers": status["providers"]
    }


@app.get("/api/v1/providers")
async def get_providers():
    """
    Returns the list of LLM providers preconfigured by the administrator in .env.
    """
    return LLMProviderFactory.get_providers_status()


async def _run_analysis_pipeline(
    text: str,
    provider_name: Optional[str] = None
) -> Tuple[ContractAnalysisResult, str]:
    if not text or len(text.strip()) < 20:
        raise HTTPException(status_code=400, detail="Contract text is empty or too short for analysis.")

    # Primary provider: Groq. If it fails, fallback to OpenRouter.
    active_provider = "groq"
    extracted_data = None

    try:
        logger.info("Attempting contract analysis with primary provider: groq")
        provider = LLMProviderFactory.get_provider("groq")
        extracted_data = await provider.extract_clauses_and_summary(text)
    except Exception as groq_err:
        logger.warning(
            f"Primary provider 'groq' failed: {groq_err}. "
            f"Automatically switching to fallback provider 'openrouter'..."
        )
        try:
            active_provider = "openrouter"
            provider = LLMProviderFactory.get_provider("openrouter")
            extracted_data = await provider.extract_clauses_and_summary(text)
            logger.info("Successfully completed contract analysis with fallback provider: openrouter")
        except Exception as openrouter_err:
            logger.error(f"Fallback provider 'openrouter' also failed: {openrouter_err}")
            raise HTTPException(
                status_code=502,
                detail=f"Both primary provider (Groq: {str(groq_err)}) and fallback provider (OpenRouter: {str(openrouter_err)}) failed."
            )

    clauses = extracted_data["clauses"]
    summary = extracted_data.get("summary", "Analysis completed.")

    # 3. Deterministic scoring math (never trust arbitrary LLM overall score)
    weighted_score, risk_level = calculate_overall_risk(clauses)

    # 4. Mandatory clause cross-checking
    missing_clauses = detect_missing_clauses(clauses)

    # 5. Bengaluru specific market alerts
    bengaluru_alerts = extract_bengaluru_specific_alerts(clauses)

    # Count high/critical clauses
    high_critical_count = sum(1 for c in clauses if c.risk_level in [RiskLevel.HIGH, RiskLevel.CRITICAL])

    result = ContractAnalysisResult(
        clauses=clauses,
        missing_mandatory_clauses=missing_clauses,
        weighted_overall_score=weighted_score,
        risk_category=risk_level,
        summary=summary,
        total_clauses_analyzed=len(clauses),
        high_critical_risk_count=high_critical_count,
        bengaluru_norm_violations=bengaluru_alerts
    )
    return result, active_provider


@app.post("/api/v1/analyze")
async def analyze_pdf(
    file: UploadFile = File(...),
    provider: Optional[str] = Form(None)
):
    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    try:
        pdf_bytes = await file.read()
        extracted_text, pages_meta, method = extract_text_from_pdf(pdf_bytes)
    except Exception as e:
        logger.exception("Failed to parse PDF document")
        raise HTTPException(status_code=422, detail=f"Failed to parse PDF: {str(e)}")

    if not extracted_text.strip():
        raise HTTPException(
            status_code=422,
            detail="Could not extract text from this document. If this is a low-resolution scan, please ensure readable image quality."
        )

    analysis_result, used_provider = await _run_analysis_pipeline(
        text=extracted_text,
        provider_name=provider
    )

    return {
        "filename": file.filename,
        "page_count": len(pages_meta),
        "extraction_method": method,
        "raw_text": extracted_text,
        "active_provider": used_provider,
        "analysis": analysis_result
    }


@app.post("/api/v1/analyze-text")
async def analyze_text(payload: dict):
    text = payload.get("text", "")
    provider = payload.get("provider", None)
    
    analysis_result, used_provider = await _run_analysis_pipeline(
        text=text,
        provider_name=provider
    )
    return {
        "filename": payload.get("filename", "Pasted Agreement Text"),
        "page_count": 1,
        "extraction_method": "direct_text",
        "raw_text": text,
        "active_provider": used_provider,
        "analysis": analysis_result
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
