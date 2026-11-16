import json
import re
from abc import ABC, abstractmethod
from typing import Dict, Any, List
from app.schemas.analysis import ExtractedClause, ClauseCategory, RiskLevel

DEFAULT_COUNTER_CLAUSES = {
    ClauseCategory.RENT_DEPOSIT: "The Lessee has paid an interest-free refundable security deposit equivalent to 2 months' rent. The entire deposit shall be refunded via bank transfer within 15 days of handover, subject only to unpaid utility dues and mutually verified physical damages, excluding normal wear and tear and mandatory painting charges.",
    ClauseCategory.LOCKIN: "There shall be a mutual lock-in period of 3 months. Provided that in the event of unforeseen job relocation outside Bengaluru, employment termination, or serious medical emergencies, the Lessee may terminate the lease by giving 30 days' advance written notice without forfeiture of the security deposit.",
    ClauseCategory.TERMINATION_NOTICE: "Either party may terminate this agreement by providing 30 (thirty) days' advance written notice or payment of 1 (one) month rent in lieu thereof, ensuring equal and symmetric notice rights for both parties.",
    ClauseCategory.MAINTENANCE: "The Lessee shall be responsible for minor internal day-to-day repairs up to ₹1,000 per incident. The Lessor shall remain solely responsible for all structural repairs, roof/wall seepage, main plumbing pipelines, and society capital improvement sinking fund levies.",
    ClauseCategory.UTILITIES: "The Lessee shall pay for actual metered electricity (BESCOM) and gas consumption. The Lessor shall not interrupt or disconnect any utility supplies under any dispute circumstances.",
    ClauseCategory.FOOD_HABITS: "The Lessee shall use the leased premises for lawful residential purposes with quiet enjoyment, without arbitrary restrictions on dietary choices or reasonable visitor hours.",
    ClauseCategory.LATE_PAYMENT_PENALTY: "A grace period of 7 (seven) days from the due date shall be granted for rent remittance. In the event of continued delay beyond the grace period, a reasonable late fee not exceeding ₹100 per day shall apply.",
    ClauseCategory.OVERSTAY: "In the event the Lessee overstays post-expiration without written renewal, a reasonable pro-rata daily charge equal to standard rent shall apply. The Lessor shall not resort to lock changing or unilateral extrajudicial eviction.",
    ClauseCategory.SUBLETTING: "The Lessee shall not sublet or assign the leased premises to third parties without prior written consent of the Lessor, provided that immediate family members and listed co-tenants shall be permitted to reside.",
    ClauseCategory.DISPUTE_RESOLUTION: "In the event of any dispute arising out of this Agreement, the parties shall first attempt to resolve it amicably via mutual mediation. If unresolved within 30 days, the courts located in Bengaluru, Karnataka shall have exclusive jurisdiction.",
    ClauseCategory.GOVERNING_LAW: "This Agreement shall be governed by and construed in accordance with the laws of India and the statutory tenancy guidelines applicable in the State of Karnataka.",
}

class BaseLLMProvider(ABC):
    def __init__(self, api_key: str, model: str):
        self.api_key = api_key
        self.model = model

    @abstractmethod
    async def extract_clauses_and_summary(self, contract_text: str) -> Dict[str, Any]:
        """
        Calls the LLM provider, extracts categorized clauses,
        raw risk scores (1-10), explanations, risk rationale, and rewrites.
        """
        pass

    @classmethod
    def clean_json_text(cls, text: str) -> str:
        """
        Strips markdown codeblocks, preambles, and backticks to return clean JSON.
        """
        text = text.strip()
        # Remove ```json ... ``` blocks
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
        text = text.strip()

        # Find first { and last }
        first_brace = text.find("{")
        last_brace = text.rfind("}")
        if first_brace != -1 and last_brace != -1 and last_brace > first_brace:
            text = text[first_brace:last_brace + 1]

        return text

    @classmethod
    def parse_clauses_from_dict(cls, data: dict) -> tuple[str, List[ExtractedClause]]:
        summary = data.get("summary", "Rental agreement clause analysis complete.")
        raw_clauses = data.get("clauses", [])
        
        parsed_clauses: List[ExtractedClause] = []
        valid_categories = {c.value: c for c in ClauseCategory}
        
        for item in raw_clauses:
            cat_str = item.get("category", "")
            # Match category or fallback
            matched_cat = valid_categories.get(cat_str)
            if not matched_cat:
                for k, v in valid_categories.items():
                    if k.lower() in cat_str.lower() or cat_str.lower() in k.lower():
                        matched_cat = v
                        break
            if not matched_cat:
                matched_cat = ClauseCategory.OTHER
                
            raw_score = int(item.get("raw_risk_score", 5))
            raw_score = max(1, min(10, raw_score))
            
            orig_text = item.get("original_text", "").strip()
            
            # Map score to risk level based on CLAUSE_RISK_FRAMEWORK.md
            if raw_score <= 3:
                risk_lvl = RiskLevel.LOW
            elif raw_score <= 6:
                risk_lvl = RiskLevel.MODERATE
            elif raw_score <= 8:
                risk_lvl = RiskLevel.HIGH
            else:
                risk_lvl = RiskLevel.CRITICAL
                
            suggested_rewrite = item.get("suggested_rewrite")
            if suggested_rewrite and isinstance(suggested_rewrite, str):
                suggested_rewrite = suggested_rewrite.strip()
                if suggested_rewrite.lower() in ("null", "none", "n/a", ""):
                    suggested_rewrite = None

            # Counter clause is recommended only if it is HIGH or CRITICAL risk (score >= 7)
            if risk_lvl not in (RiskLevel.HIGH, RiskLevel.CRITICAL) or raw_score < 7:
                suggested_rewrite = None
            elif not suggested_rewrite:
                # Provide standard tenant-friendly amendment if LLM omitted it
                suggested_rewrite = DEFAULT_COUNTER_CLAUSES.get(matched_cat)

            parsed_clauses.append(
                ExtractedClause(
                    category=matched_cat,
                    original_text=orig_text,
                    simplified_explanation=item.get("simplified_explanation", "").strip(),
                    raw_risk_score=raw_score,
                    risk_level=risk_lvl,
                    risk_reasoning=item.get("risk_reasoning", "").strip(),
                    suggested_rewrite=suggested_rewrite
                )
            )
            
        return summary, parsed_clauses
