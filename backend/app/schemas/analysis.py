from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field


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
    FOOD_HABITS = "Food Habits & Lifestyle"
    LOCKIN = "Lock-in Period"
    OVERSTAY = "Overstay Consequences"
    DISPUTE_RESOLUTION = "Dispute Resolution"
    GOVERNING_LAW = "Governing Law"
    WITNESSES = "Witnesses"
    OTHER = "Other / Miscellaneous"


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
    original_text: str = Field(description="Exact verbatim excerpt or clause from the document")
    simplified_explanation: str = Field(description="Plain English translation for a tenant")
    raw_risk_score: int = Field(ge=1, le=10, description="Clause risk rating between 1 and 10 based on scoring rules")
    risk_level: RiskLevel
    risk_reasoning: str = Field(description="Why this clause is safe, risky, or unfair in Bengaluru rental context")
    suggested_rewrite: Optional[str] = Field(default=None, description="Tenant-friendly alternative counter-clause text (only recommended for HIGH or CRITICAL risk)")


class MissingClause(BaseModel):
    clause_name: MandatoryClauseName = Field(description="Name of the missing mandatory clause")
    importance: str = Field(description="Why this clause is essential under Karnataka tenancy norms")
    recommended_text: str = Field(description="Standard balanced clause text to insert into agreement")


class ContractAnalysisResult(BaseModel):
    clauses: List[ExtractedClause]
    missing_mandatory_clauses: List[MissingClause]
    weighted_overall_score: float = Field(ge=1.0, le=10.0, description="Calculated weighted overall risk score")
    risk_category: RiskLevel
    summary: str = Field(description="Executive summary of the agreement risk analysis")
    total_clauses_analyzed: int = 0
    high_critical_risk_count: int = 0
    bengaluru_norm_violations: List[str] = Field(default_factory=list, description="Specific local violations like deposit > 2 months, excessive painting deduction, etc.")
