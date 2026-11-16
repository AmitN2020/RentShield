from typing import List, Tuple, Set
from app.schemas.analysis import (
    ClauseCategory,
    ExtractedClause,
    RiskLevel,
    MandatoryClauseName,
    MissingClause
)

# Canonical 17 category weights from CLAUSE_RISK_FRAMEWORK.md (sum = 1.0)
CATEGORY_WEIGHTS = {
    ClauseCategory.RENT_DEPOSIT: 0.20,             # Security deposit size, refund terms & deductions
    ClauseCategory.LOCKIN: 0.15,                   # Lock-in duration & early exit penalties
    ClauseCategory.TERMINATION_NOTICE: 0.12,       # Notice periods, delivery method & default terms
    ClauseCategory.MAINTENANCE: 0.10,              # Maintenance, society charges & repair split
    ClauseCategory.UTILITIES: 0.08,                # Direct utility splits
    ClauseCategory.LATE_PAYMENT_PENALTY: 0.06,     # Late payment fees & grace period
    ClauseCategory.OVERSTAY: 0.05,                 # Post-lease overstay penalties
    ClauseCategory.SUBLETTING: 0.04,               # Subletting restrictions & roommate rules
    ClauseCategory.FOOD_HABITS: 0.04,              # Lifestyle / food restrictions
    ClauseCategory.OTHER: 0.04,                    # Miscellaneous / hidden charges
    ClauseCategory.DURATION: 0.03,                 # Lease tenure (11 months) & renewal terms
    ClauseCategory.DISPUTE_RESOLUTION: 0.03,        # Mediation & court jurisdiction
    ClauseCategory.GOVERNING_LAW: 0.02,             # State law enforceability
    ClauseCategory.PARTIES: 0.015,                 # Identity verification
    ClauseCategory.PROPERTY: 0.015,                # Property description & inclusions
    ClauseCategory.PETS: 0.005,                    # Pet policy guidelines
    ClauseCategory.WITNESSES: 0.005,               # Formal execution validity
}

MANDATORY_CLAUSE_SPECS = {
    MandatoryClauseName.PARTIES: {
        "importance": "Without full legal names, permanent addresses, and PAN/Aadhaar details, legal enforceability against either party or identity theft protection is severely impaired.",
        "recommended_text": "This Agreement is entered into between [Landlord Full Name], PAN: [Landlord PAN], residing at [Landlord Permanent Address] (hereinafter 'Lessor'), and [Tenant Full Name], PAN: [Tenant PAN], residing at [Tenant Permanent Address] (hereinafter 'Lessee')."
    },
    MandatoryClauseName.PROPERTY: {
        "importance": "Exact schedule of the premises (flat number, floor, car parking slot, fixture inventory) prevents later disputes on leased area boundaries.",
        "recommended_text": "The leased premises consists of Flat No. [Unit], [Floor] Floor, measuring approximately [Sq.Ft] sq.ft, at [Complete Building Address, Bengaluru - PIN], together with dedicated reserved covered car parking slot No. [Slot] and fixtures enumerated in Schedule A."
    },
    MandatoryClauseName.DURATION: {
        "importance": "Clear start and end dates (customarily 11 months in Karnataka to avoid mandatory registration fees) protect the tenant against arbitrary early eviction.",
        "recommended_text": "This lease shall be valid for a fixed tenure of 11 (eleven) months commencing from [Start Date] and expiring on [End Date]. Any renewal shall be on mutually agreed terms in writing at least 30 days prior to expiry."
    },
    MandatoryClauseName.RENT_DEPOSIT: {
        "importance": "Specifies monthly rent, due date, refundable security deposit quantum (capped at 2 months under modern Karnataka tenancy guidelines), and strict refund timeline upon vacating.",
        "recommended_text": "The monthly rent is fixed at INR [Amount], payable on or before the [Due Day, e.g. 5th] of every calendar month. The Lessee has paid an interest-free refundable security deposit of INR [Amount] (equivalent to 2 months' rent). The entire deposit shall be refunded via bank transfer simultaneously upon handover of vacant possession within 7 days, subject only to unpaid utility dues and mutually verified damages excluding normal wear and tear."
    },
    MandatoryClauseName.LATE_PAYMENT_PENALTY: {
        "importance": "Prevents arbitrary exorbitant daily penalties or immediate eviction notices for minor banking or payroll delays.",
        "recommended_text": "A grace period of 7 (seven) days from the due date shall be granted for rent remittance. In the event of continued delay beyond the grace period, a reasonable late fee not exceeding INR 100 per day or 1% simple interest per month shall apply."
    },
    MandatoryClauseName.LOCKIN: {
        "importance": "Guarantees tenant stability while ensuring fair exit rights in unavoidable contingencies like job loss, medical emergency, or corporate job transfer.",
        "recommended_text": "There shall be a mutual lock-in period of [e.g., 3 to 6] months. Provided that in the event of job relocation outside Bengaluru, unforeseen job termination, or serious medical emergencies, the Lessee may terminate the lease during the lock-in period by providing 30 days' advance written notice without financial penalty beyond forfeiture of pro-rata notice period rent."
    },
    MandatoryClauseName.TERMINATION_NOTICE: {
        "importance": "Ensures equal reciprocal notice requirements (typically 30–60 days) and transparent delivery procedures.",
        "recommended_text": "Either party may terminate this agreement post lock-in by serving 30 (thirty) days' advance written notice or by payment of 1 (one) month rent in lieu thereof. Notice delivered via registered email or WhatsApp shall constitute valid legal notice."
    },
    MandatoryClauseName.MAINTENANCE: {
        "importance": "Draws a strict line between minor everyday maintenance (tenant) and major structural / seepage / plumbing / society capital expenditures (landlord).",
        "recommended_text": "The Lessee shall be responsible for minor internal day-to-day repairs up to INR 1,000 per incident. The Lessor shall remain solely responsible for all structural repairs, roof/external wall seepage, major electrical rewiring, main plumbing pipelines, and society capital improvement sinking fund levies."
    },
    MandatoryClauseName.UTILITIES: {
        "importance": "Clear allocation of metered electricity (BESCOM), BWSSB water, LPG gas, and regular society maintenance.",
        "recommended_text": "The Lessee shall pay for actual metered electricity (BESCOM) and gas consumption. Monthly society maintenance charges of INR [Amount] and water charges shall be paid directly by [Lessee/Lessor as agreed]."
    },
    MandatoryClauseName.SUBLETTING: {
        "importance": "Clarifies subletting restrictions while preserving rights for bona fide family members and immediate co-habitants.",
        "recommended_text": "The Lessee shall not sublet or assign the leased premises to third parties without prior written consent of the Lessor, provided that immediate family members and listed co-tenants shall be permitted to reside."
    },
    MandatoryClauseName.DISPUTE_RESOLUTION: {
        "importance": "Provides an amicable dispute mechanism and establishes local Bengaluru legal jurisdiction.",
        "recommended_text": "In the event of any dispute arising out of this Agreement, the parties shall first attempt to resolve it amicably via mutual mediation. If unresolved within 30 days, the courts located in Bengaluru, Karnataka shall have exclusive jurisdiction."
    }
}


def calculate_overall_risk(extracted_clauses: List[ExtractedClause]) -> Tuple[float, RiskLevel]:
    """
    Computes the weighted overall risk score and maps it to a RiskLevel enum
    based on deterministic category weights and raw clause risk scores.
    """
    if not extracted_clauses:
        return 5.0, RiskLevel.MODERATE

    weighted_score = 0.0
    weight_accumulated = 0.0

    # Group scores by category to handle multiple clauses in the same category
    category_scores: dict[ClauseCategory, list[int]] = {}
    for clause in extracted_clauses:
        category_scores.setdefault(clause.category, []).append(clause.raw_risk_score)

    # Use max risk score within high-impact categories or average within moderate categories
    for cat, scores in category_scores.items():
        weight = CATEGORY_WEIGHTS.get(cat, 0.02)
        # Taking the highest risk score found in this category protects tenant from masked traps
        cat_score = max(scores)
        weighted_score += cat_score * weight
        weight_accumulated += weight

    if weight_accumulated > 0:
        final_score = round(weighted_score / weight_accumulated, 1)
    else:
        final_score = 5.0

    # Ensure bounds [1.0, 10.0]
    final_score = max(1.0, min(10.0, final_score))

    if final_score <= 3.0:
        risk_level = RiskLevel.LOW
    elif final_score <= 6.0:
        risk_level = RiskLevel.MODERATE
    elif final_score <= 8.0:
        risk_level = RiskLevel.HIGH
    else:
        risk_level = RiskLevel.CRITICAL

    return final_score, risk_level


def detect_missing_clauses(extracted_clauses: List[ExtractedClause]) -> List[MissingClause]:
    """
    Cross-checks the extracted clauses against the 11 mandatory rental clauses
    and generates actionable missing clause entries.
    """
    present_categories: Set[str] = {c.category.value for c in extracted_clauses}
    missing_list: List[MissingClause] = []

    for mandatory_name, info in MANDATORY_CLAUSE_SPECS.items():
        # Match mandatory enum name to category value
        if mandatory_name.value not in present_categories:
            missing_list.append(
                MissingClause(
                    clause_name=mandatory_name,
                    importance=info["importance"],
                    recommended_text=info["recommended_text"]
                )
            )

    return missing_list


def extract_bengaluru_specific_alerts(extracted_clauses: List[ExtractedClause]) -> List[str]:
    """
    Extracts key Bengaluru-specific compliance issues from clause text.
    """
    alerts = []
    for c in extracted_clauses:
        lower_text = c.original_text.lower()
        # Deposit > 2 months check
        if c.category == ClauseCategory.RENT_DEPOSIT:
            for num in ["5 months", "6 months", "10 months", "ten months", "six months"]:
                if num in lower_text:
                    alerts.append(f"Security Deposit of {num} flagged: Karnataka High Court precedents and modern tenancy guidelines recommend capping deposits at 2 months' rent.")
                    break
            if "painting charges" in lower_text or "one month rent will be deducted" in lower_text:
                alerts.append("Automatic painting deduction flagged: Mandatory forfeiture of one month's rent for painting is an exploitative Bengaluru market friction; wear-and-tear should not be charged.")
        # Lockin without emergency clause
        if c.category == ClauseCategory.LOCKIN and ("no exception" in lower_text or "entire period" in lower_text or c.raw_risk_score >= 8):
            alerts.append("Severe Lock-in clause without corporate relocation / emergency exemption detected.")
        # Non-veg / visitors restriction
        if c.category == ClauseCategory.FOOD_HABITS and ("non-veg" in lower_text or "visitor" in lower_text or "curfew" in lower_text):
            alerts.append("Restrictive lifestyle / food clause detected: Overreaching restrictions on private residential tenancy.")
        # Asymmetric notice
        if c.category == ClauseCategory.TERMINATION_NOTICE and c.raw_risk_score >= 7:
            alerts.append("Asymmetric notice period or unilateral landlord eviction rights detected.")

    return list(dict.fromkeys(alerts))
