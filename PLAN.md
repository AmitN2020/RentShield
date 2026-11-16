# Product Requirement & Implementation Blueprint: Rental Agreement Risk Analyzer

## 1. Product Executive Summary

The **Rental Agreement Risk Analyzer** is a specialized, web-based legaltech utility designed specifically for tenants in Bengaluru, Karnataka. It allows users to upload digital PDFs or scanned PDFs of rental agreements and receive a structured  clause-by-clause breakdown with a simplified summary, missing mandatory clause detection, risk scoring, and negotiation assistance.

### Key Value Propositions

* **Bengaluru-Grounded Rule Engine:** Evaluates terms against local market norms (e.g., 2-month deposit caps, lock-in terms, 90-day rent hike notice).
* **Missing Clause Identification:** Cross-checks contracts against mandatory clause requirements.
* **Deterministic Risk Scoring:** Calculates clause-by-clause and overall weighted risk scores based on clear mathematical weights rather than arbitrary LLM output.
* **Modular LLM Provider Architecture:** Features an abstract strategy pattern supporting runtime-swappable LLM backends (OpenRouter, Groq, Google Gemini, OpenAI, Ollama) via unified configuration.
* **Negotiation Assistant:** Generates polite, ready-to-send WhatsApp messages to landlords requesting specific, fair amendments.
* **100% Free-Tier Compatible Architecture:** Built using open-source libraries and generous free-tier cloud platforms.

---

## 2. Tech Stack Specification (Strictly Free-Tier Compatible)

| Component                   | Framework / Library / Service                               | Rationale / Free Tier Details                                                             |
| :-------------------------- | :---------------------------------------------------------- | :---------------------------------------------------------------------------------------- |
| **Frontend**                | React (Vite) + Tailwind CSS + Lucide Icons                  | Fast client-side rendering, easily hosted on Vercel or Netlify free tiers.                |
| **PDF Rendering**           | `pdfjs-dist` / `react-pdf`                                  | In-browser PDF preview and side-by-side text highlighting.                                |
| **Backend API**             | Python (FastAPI)                                            | Asynchronous execution, native Pydantic schema validation, clean REST endpoints.          |
| **Backend Hosting**         | Render.com / Hugging Face Spaces                            | Free Web Service tiers (e.g., Render 512MB RAM or HF Spaces Docker container).            |
| **OCR Pipeline**            | `pdf2image` + `pytesseract` (Tesseract OCR)                 | Converts scanned PDF pages into in-memory images and executes Tesseract OCR.              |
| **Digital PDF Parsing**     | `pdfplumber` / `pypdf`                                      | Fast, open-source extraction for native digital text PDFs.                                |
| **LLM Abstraction**         | Custom Abstract Base Class (`BaseLLMProvider`) or LiteLLM   | Unified adapter interface supporting LiteLLM or OpenAI-compatible completion protocols.   |
| **Supported LLM Providers** | OpenRouter, Groq, Google Gemini, OpenAI, Local Ollama, etc. | Configurable via `LLM_PROVIDER` and `LLM_API_KEY` in `.env`.                              |
| **Data Storage**            | Browser LocalStorage / IndexedDB                            | Client-side persistence for zero-cost operation; optional Supabase free tier for history. |

---

## 3. Feature List

### Feature 1: PDF Document Ingestion & Dual Parsing Engine

* File drop zone supporting digital `.pdf` and scanned `.pdf` files.
* **Smart Parsing Switch:**
  1. Attempts native text extraction via `pdfplumber`.
  2. If extracted text density is below a defined threshold (indicating a scanned PDF), automatically falls back to `pdf2image` + `pytesseract` OCR processing across all pages.

### Feature 2: Modular Swappable LLM Architecture

### Feature 3: Clause Extraction & Categorization

Splits the rental agreement contents and classifies the clauses into the 17 categories below:

1. **Parties Involved** *(Full names, addresses, and IDs like Aadhaar/PAN of landlord and tenant)*
2. **Property Details** *(Exact address, property type, size/sq.ft, floor, amenities, and inclusions)*
3. **Rent and Security Deposit** *(Monthly rent amount, due date, payment mode, deposit size, refund timeline, and lawful deduction terms)*
4. **Lease Duration** *(Start and end dates, 11-month term to avoid mandatory registration under Registration Act 1908, and renewal terms)*
5. **Maintenance and Repairs** *(Demarcation of minor repair limits for tenant vs. major structural/plumbing repairs for landlord)*
6. **Utilities** *(Responsibility for electricity, water, gas, internet, and society charges)*
7. **Termination and Notice Period** *(Notice period duration, early termination rules, and delivery method like email or written letter)*
8. **Subletting** *(Rules and permissions regarding subletting or unauthorized occupants)*
9. **Pets** *(Explicit rules regarding pets, allowed types, or prior approval requirements)*
10. **Penalty for Late Payment** *(Daily fine or percentage penalty for rent paid after the due date)*
11. **Food Habits & Lifestyle** *(Restrictions on non-vegetarian food, alcohol, drugs, or community norms)*
12. **Lock-in Period** *(Minimum stay duration during which neither party can terminate without penalty)*
13. **Overstay Consequences** *(Financial penalties for occupying the property post-lease expiration without renewal)*
14. **Dispute Resolution** *(Process for resolving conflicts, including mediation and court jurisdiction)*
15. **Governing Law** *(Reference to applicable laws, such as Karnataka Rent Act 1999 / Karnataka tenancy framework)*
16. **Witnesses** *(Signatures, names, and addresses of two witnesses validating the agreement)*
17. **Other / Miscellaneous** *(Any additional clauses, indemnities, fixture installation rules, broker fee lines, or catch-all terms)*

### Feature 4: Missing Mandatory Clause Identification

Scans the contract against a checklist of mandatory clauses and reports which one are missing int the contract:

- Parties Involved: Full names, addresses, and identity numbers (PAN/Aadhaar) for landlord and tenant.
- Property Details: Complete address, property type, unit number, and physical description.
- Lease Duration: Clear start/end dates (typically 11 months) and renewal terms.
- Rent and Security Deposit: Stated monthly rent, due date, payment method, deposit amount, and refund conditions.
- Penalty for Late Payment: Defined grace period and reasonable late fee structure.
- Lock-in Period: Stated minimum stay duration (e.g., 3–6 months) and exit penalty terms.
- Termination and Notice Period: Advance notice requirement (e.g., 30–60 days) and exit conditions.
- Maintenance and Repairs: Explicit division between minor tenant repairs and major landlord repairs.
- Utilities: Clear allocation of electricity, water, gas, and society maintenance payments.
- Subletting: Explicit rule barring or allowing subletting with written consent.
- Dispute Resolution: Clear path for handling disputes (e.g., mediation, Bangalore court jurisdiction).

### Feature 5: Deterministic & Weighted Risk Scoring

* Assigns clause risk scores (1–10) using rule-based criteria grounded in Karnataka tenancy norms and market realities.

Calculates the overall risk score using a weighted mathematical model:

$$
S_{overall} = \sum_{i=1}^{17} (Score_i \times Weight_i)
$$

### Feature 6: Interactive Visual Dashboard & Negotiation Assistant

- Split-screen view showing PDF text alongside categorized risk flags.
- Visual color coding: Green (Low Risk), Yellow (Moderate Risk), Orange (High Risk), Red (Critical Risk).
- "Copy Negotiation Message" button generating pre-formatted WhatsApp text for flagged terms.

---

## 4. Data Schemas & Models

```python
from pydantic import BaseModel, Field
from typing import List, Optional
from enum import Enum

class RiskLevel(str, Enum):
    LOW = "LOW"
    MODERATE = "MODERATE"
    HIGH = "HIGH"
    CRITICAL = "CRITICAL"

class ClauseCategory(str, Enum):
    PARTIES = "Parties Involved"
    PROPERTY = "Property Details"
    RENT_DEPOSIT = "Rent and Security Deposit"
    DURATION = "Lease Duration"
    MAINTENANCE = "Maintenance and Repairs"
    UTILITIES = "Utilities"
    TERMINATION_NOTICE = "Termination and Notice Period"
    SUBLETTING = "Subletting"
    PETS = "Pets"
    LATE_PAYMENT_PENALTY = "Penalty for Late Payment"
    FOOD_HABITS = "Food Habits"
    LOCKIN = "Lock-in Period"
    OVERSTAY = "Overstay Consequences"
    DISPUTE_RESOLUTION = "Dispute Resolution"
    GOVERNING_LAW = "Governing Law"
    WITNESSES = "Witnesses"
    OTHER = "Other/Miscellaneous Text"

class MandatoryClauseName(str, Enum):
    PARTIES = "Parties Involved"
    PROPERTY = "Property Details"
    DURATION = "Lease Duration"
    RENT_DEPOSIT = "Rent and Security Deposit"
    LATE_PAYMENT_PENALTY = "Penalty for Late Payment"
    LOCKIN = "Lock-in Period"
    TERMINATION_NOTICE = "Termination and Notice Period"
    MAINTENANCE = "Maintenance and Repairs"
    UTILITIES = "Utilities"
    SUBLETTING = "Subletting"
    DISPUTE_RESOLUTION = "Dispute Resolution"

class ExtractedClause(BaseModel):
    category: ClauseCategory
    original_text: str = Field(description="Exact verbatim excerpt from the document")
    simplified_explanation: str = Field(description="Plain English translation for a tenant")
    raw_risk_score: int = Field(ge=1, le=10, description="Clause risk rating between 1 and 10 based on scoring rules")
    risk_level: RiskLevel
    risk_reasoning: str = Field(description="Why this clause is risky in Bengaluru rental market context")
    suggested_rewrite: Optional[str] = Field(default=None, description="Tenant-friendly alternative clause text")

class MissingClause(BaseModel):
    clause_name: MandatoryClauseName = Field(description="Name of the missing mandatory clause")
    importance: str = Field(description="Why this clause is essential under Karnataka norms")
    recommended_text: str = Field(description="Standard clause text to insert into the agreement")

class ContractAnalysisResult(BaseModel):
    clauses: List[ExtractedClause]
    missing_mandatory_clauses: List[MissingClause]
    weighted_overall_score: float = Field(ge=1.0, le=10.0, description="Calculated weighted overall risk score")
    risk_category: RiskLevel
    summary: str = Field(description="Executive summary of the agreement risk analysis")
```

---

## 4. Modular Swappable LLM Architecture

The backend implements an **Abstract Strategy Pattern** allowing any OpenAI-compatible or proprietary provider to be plugged in seamlessly.

### Provider Class Diagram / Flow

```
[ FastAPI Endpoint ] ──> [ LLMProviderFactory ]
                               │
         ┌───────────────────────┼───────────────────────┬────────────────────────┐
         ▼                     ▼                     ▼                      ▼
[OpenRouterProvider]     [GroqProvider]       [GeminiProvider]     [CustomOpenAIProvider]
 (OpenRouter API)       (Groq Cloud API)        (Google API)        (Ollama/Local/OpenAI)
```

### Abstraction Implementation (`backend/app/services/llm/base.py`)

```python
from abc import ABC, abstractmethod
from app.schemas.analysis import ContractAnalysisResult

class BaseLLMProvider(ABC):
    """Abstract interface for swappable LLM backends."""
    
    @abstractmethod
    async def analyze_contract(self, text: str) -> ContractAnalysisResult:
        """Process extracted contract text and return validated structured analysis."""
        pass
```

### Multi-Provider Factory (`backend/app/services/llm/factory.py`)

```python
import os
from app.services.llm.base import BaseLLMProvider
from app.services.llm.openrouter import OpenRouterProvider
from app.services.llm.groq import GroqProvider
from app.services.llm.gemini import GeminiProvider
from app.services.llm.openai_compatible import GenericOpenAIProvider

class LLMProviderFactory:
    @staticmethod
    def get_provider() -> BaseLLMProvider:
        provider_name = os.getenv("LLM_PROVIDER", "openrouter").lower()
        
        if provider_name == "openrouter":
            return OpenRouterProvider(
                api_key=os.getenv("OPENROUTER_API_KEY"),
                model=os.getenv("LLM_MODEL", "meta-llama/llama-3.3-70b-instruct:free")
            )
        elif provider_name == "groq":
            return GroqProvider(
                api_key=os.getenv("GROQ_API_KEY"),
                model=os.getenv("LLM_MODEL", "llama-3.3-70b-versatile")
            )
        elif provider_name == "gemini":
            return GeminiProvider(
                api_key=os.getenv("GEMINI_API_KEY"),
                model=os.getenv("LLM_MODEL", "gemini-2.5-flash")
            )
        elif provider_name == "openai_compatible":
            return GenericOpenAIProvider(
                api_key=os.getenv("LLM_API_KEY"),
                base_url=os.getenv("LLM_BASE_URL", "https://api.openai.com/v1"),
                model=os.getenv("LLM_MODEL", "gpt-4o-mini")
            )
        else:
            raise ValueError(f"Unsupported LLM provider configured: {provider_name}")
```

---

## 5. Risk Scoring & System Weight Engine

To avoid arbitrary LLM scores, the backend applies a deterministic mathematical weighting engine on top of clause outputs:

$$
S_{overall} = \sum_{i=1}^{17} (Score_i \times Weight_i)
$$

### Weights Applied

```python
from backend.app.schemas.analysis import ClauseCategory, ExtractedClause, RiskLevel

# Precise weights matching all 17 clause categories from the evaluation framework
CATEGORY_WEIGHTS = {
    ClauseCategory.RENT_DEPOSIT: 0.20,             # Security deposit size, refund terms & deductions
    ClauseCategory.LOCKIN: 0.15,                   # Lock-in duration & early exit penalties
    ClauseCategory.TERMINATION_NOTICE: 0.12,       # Notice periods, delivery method & default terms
    ClauseCategory.MAINTENANCE: 0.10,              # Maintenance, society charges & repair split
    ClauseCategory.UTILITIES: 0.08,                # Electricity, water, and direct utility splits
    ClauseCategory.LATE_PAYMENT_PENALTY: 0.08,     # Late payment fees & overstay consequences
    ClauseCategory.PROPERTY: 0.05,                 # Property description, schedule & inclusions
    ClauseCategory.DURATION: 0.05,                 # Lease tenure (11 months) & renewal terms
    ClauseCategory.SUBLETTING: 0.05,               # Subletting restrictions & roommate rules
    ClauseCategory.PETS: 0.03,                     # Pet permissions & deposit terms
    ClauseCategory.FOOD_HABITS: 0.03,              # Lifestyle / food restrictions
    ClauseCategory.OVERSTAY: 0.02,                 # Post-lease overstay penalties
    ClauseCategory.PARTIES: 0.0,                   # Structural / boilerplate (weighted 0)
    ClauseCategory.DISPUTE_RESOLUTION: 0.0,        # Structural / boilerplate (weighted 0)
    ClauseCategory.GOVERNING_LAW: 0.0,             # Structural / boilerplate (weighted 0)
    ClauseCategory.WITNESSES: 0.0,                 # Structural / boilerplate (weighted 0)
    ClauseCategory.OTHER: 0.04                     # Miscellaneous text / unclassified clauses
}

def calculate_overall_risk(extracted_clauses: list[ExtractedClause]) -> tuple[float, RiskLevel]:
    """
    Computes the weighted overall risk score and maps it to a RiskLevel enum
    based on deterministic category weights and raw clause risk scores.
    """
    weighted_score = 0.0
    weight_accumulated = 0.0

    for clause in extracted_clauses:
        # Retrieve weight for the category; default to 0.02 if unmapped
        weight = CATEGORY_WEIGHTS.get(clause.category, 0.02)
        if weight > 0.0:
            weighted_score += clause.raw_risk_score * weight
            weight_accumulated += weight

    # Normalize if weights accumulated; fallback to 5.0 (Moderate) if empty
    final_score = round(weighted_score / weight_accumulated if weight_accumulated > 0 else 5.0, 2)

    # Determine risk category based on defined thresholds
    if final_score <= 3.0:
        risk_level = RiskLevel.LOW
    elif final_score <= 6.0:
        risk_level = RiskLevel.MODERATE
    elif final_score <= 8.0:
        risk_level = RiskLevel.HIGH
    else:
        risk_level = RiskLevel.CRITICAL

    return final_score, risk_level
```

---

## 6. Step-by-Step AI Agent Build Guide

### Phase 1: Environment & Modular LLM Backend Setup

1. **Repository Setup:** Initialize FastApi project with `poetry` or `pip` (`fastapi`, `uvicorn`, `pydantic`, `python-dotenv`, `pypdf`, `pdf2image`, `pytesseract`, `httpx`).
2. **Provider Layer (**`app/services/llm/`**):**
   * Create `base.py` defining `BaseLLMProvider`.
   * Create implementations for `OpenRouterProvider`, `GroqProvider`, `GeminiProvider`, and `GenericOpenAIProvider`.
   * Implement `LLMProviderFactory` in `factory.py`.
3. **Document Processor (**`app/services/pdf_parser.py`**):**
   * Build text extractor that attempts digital extraction via `pypdf`.
   * Fallback to `pdf2image` + `pytesseract` OCR if extracted character count is low (scanned PDFs).
4. **Scoring Service (**`app/services/scoring_engine.py`**):** Implement category weight calculations and missing clause detector.

### Phase 2: Core API Endpoints

1. `POST /api/v1/analyze`:
   * Accepts PDF file upload.
   * Runs document parsing -> LLM extraction via factory -> Scoring engine.
   * Returns `ContractAnalysisResult` JSON payload.
2. `GET /api/v1/health`: Returns API health and current active LLM provider name.

### Phase 3: React + Tailwind Frontend

1. **UI Components:**
   * **Upload Dropzone:** PDF-only upload component.
   * **Side-by-Side Viewer:** Document preview on left, analysis report on right.
   * **Risk Gauge Widget:** Displays overall risk level with color coding.
   * **Clause Cards:** Accordion list categorized by clause type with risk level, rationale, and suggested rewrite.
   * **WhatsApp Negotiator Modal:** Single-click copyable WhatsApp message generator for flagged high-risk clauses.
2. **API Integration:** Connect Vite frontend to FastAPI backend endpoints.

### Phase 4: Free-Tier Deployment & Testing

1. Configure Render / HuggingFace Spaces Docker container for FastAPI backend (ensuring Tesseract OCR dependencies are in `Dockerfile`).
2. Host Vite React app on Vercel or Netlify.
3. Test against sample Bengaluru rental agreement PDFs (digital and scanned).

---

## 7. Strict Execution Rules for AI Coding Assistant

1. **Modular Code Structure:** Maintain strict separation of concerns—PDF extraction, LLM adapter logic, scoring logic, and FastAPI controllers must reside in separate files.
2. **Strict Schema Adherence:** All LLM provider outputs must be validated using Pydantic schemas. If a provider output fails schema validation, trigger a fallback retry or raise a clear error.
3. **No Paid Dependencies:** Every external service, library, and deployment target specified must be operating within a genuine 100% free tier.
4. **Environment Swapping:** Switching between LLM providers (e.g., from Groq to OpenRouter or Google Gemini) must require modifying only `.env` key-value pairs without touching backend code logic.
5. **PDF Only:** Restrict file inputs to `.pdf` format across frontend validation and backend parsers.
6. **Graceful Error Handling:** If OCR or LLM calls fail, return clear JSON error messages (`422 Unprocessable Entity` or `500 Server Error`) to display cleanly in the React UI.
7. **Deterministic Weighted Scoring:** Never allow the LLM to output a random overall score string. The LLM must output individual clause scores, and Python backend math MUST calculate the final weighted average.