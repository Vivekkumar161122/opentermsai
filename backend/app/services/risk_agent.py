import logging
from typing import Dict, Any, List
from app.schemas import RiskLevel

logger = logging.getLogger(__name__)

class RiskAgent:
    """
    Role-Based Risk Agent (riskAgent):
    Evaluates clauses through a user-selected lens (e.g., 'Tenant' vs. 'Landlord',
    'Employee' vs. 'Employer', 'Freelancer' vs. 'Client').
    Flags risks dynamically based on who holds the leverage.
    """

    SYSTEM_INSTRUCTION = """You are OpenTerms AI's Principal Risk Analysis Agent (riskAgent).
Your sole mandate is to evaluate contract clauses through the specific lens and asymmetric leverage of the user's selected perspective.

RULES:
1. Strict Grounding: Analyze ONLY the provided clause text. Never invent provisions.
2. Asymmetric Leverage:
   - A clause that gives unlimited protection to Party A is GREEN for Party A, but RED for Party B.
   - Example 1: Non-compete clause is GREEN for an Employer (protects assets), but RED for an Employee (impairs livelihood).
   - Example 2: Uncapped indemnification is GREEN for the Client (transfers liability), but RED for the Freelancer (unlimited financial ruin).
   - Example 3: Automatic renewal with short notice window is GREEN for a Vendor, but RED/YELLOW for a Customer.
   - Example 4: Landlord entry without 24hr notice is GREEN for Landlord, but RED for Tenant (breach of quiet enjoyment).
3. Risk Levels:
   - RED: Highly dangerous, one-sided, unrestricted liability, forfeit of rights, punitive remedy.
   - YELLOW: Ambiguous, moderately unfavorable, lacking standard reciprocity or cure period.
   - GREEN: Favorable, customary mutual standard, or beneficial protective barrier.
4. Output specific reasoning explaining WHY the clause hurts or protects this exact perspective.
"""

    def build_risk_prompt(self, clause_title: str, clause_text: str, perspective: str, doc_type: str) -> str:
        return f"""Document Type: {doc_type}
Selected Perspective Lens: {perspective}
Clause Title: {clause_title}
Original Verbatim Clause:
\"\"\"{clause_text}\"\"\"

Analyze this clause strictly for the '{perspective}'.
Determine:
1. perspectiveRiskLevel (GREEN, YELLOW, or RED)
2. riskReasoning (Detailed rationale explaining leverage and risk to {perspective})
3. recommendedAction (Practical revision or counter-offer)
"""

    def evaluate_clause_offline(self, clause_title: str, text: str, perspective: str) -> Dict[str, Any]:
        """
        Deterministic, rule-based risk evaluation used for testing,
        fast offline execution, and guaranteed asymmetric risk flipping.
        """
        p_lower = perspective.lower()
        t_lower = text.lower()
        title_lower = clause_title.lower()

        # Non-compete / restrictive covenant
        if "non-compete" in title_lower or "non-compete" in t_lower or "restraint of trade" in t_lower:
            if "employee" in p_lower or "contractor" in p_lower or "freelancer" in p_lower:
                return {
                    "level": "RED",
                    "reasoning": f"Imposes severe geographic and temporal restrictions on {perspective}'s ability to earn a living post-termination.",
                    "action": "Request removal of the non-compete clause or narrow it strictly to direct competitor solicitation with paid garden leave."
                }
            elif "employer" in p_lower or "client" in p_lower:
                return {
                    "level": "GREEN",
                    "reasoning": f"Safeguards company trade secrets, proprietary workflows, and prevents client poaching by the departing personnel.",
                    "action": "Ensure the clause remains enforceable under local state/jurisdiction laws."
                }

        # Indemnification / Liability
        if "indemnif" in title_lower or "liability" in title_lower or "hold harmless" in t_lower:
            has_cap = "liability cap" in t_lower or "aggregate" in t_lower or "limited to the fees" in t_lower
            if "freelancer" in p_lower or "contractor" in p_lower or "tenant" in p_lower or "employee" in p_lower:
                if not has_cap or "unlimited" in t_lower or "defend, indemnify" in t_lower:
                    return {
                        "level": "RED",
                        "reasoning": f"Exposes {perspective} to broad, potentially unlimited indemnification obligations for third-party claims without an aggregate liability cap.",
                        "action": "Cap indemnification strictly to the total fees paid under the contract and limit indemnity to proven gross negligence or willful misconduct."
                    }
                else:
                    return {
                        "level": "YELLOW",
                        "reasoning": f"Contains mutual indemnification with a liability cap, but still requires vigilance regarding legal defense costs.",
                        "action": "Ensure that claims arising from the counterparty's own acts or omissions are explicitly carved out."
                    }
            else: # Employer, Landlord, Client
                return {
                    "level": "GREEN",
                    "reasoning": f"Provides comprehensive indemnification protection, shifting third-party claims and defense costs away from the {perspective}.",
                    "action": "Maintain the indemnity requirement and verify that the counterparty maintains adequate commercial insurance."
                }

        # IP Assignment / Work Made for Hire
        if "intellectual property" in title_lower or "work made for hire" in title_lower or "ip ownership" in title_lower or "inventions" in t_lower:
            if "freelancer" in p_lower or "contractor" in p_lower or "employee" in p_lower:
                if "prior inventions" not in t_lower and "all rights, title" in t_lower:
                    return {
                        "level": "RED",
                        "reasoning": f"Sweeping IP assignment that assigns all work product without explicit reservation of background IP or pre-existing developer tooling.",
                        "action": "Add an explicit exhibit carving out Pre-Existing IP, open-source libraries, and reusable background tools."
                    }
                else:
                    return {
                        "level": "YELLOW",
                        "reasoning": f"Standard work-for-hire assignment that transfers deliverables to the client upon full payment.",
                        "action": "Ensure ownership transfer is explicitly conditioned upon receipt of full payment."
                    }
            else: # Client, Employer
                return {
                    "level": "GREEN",
                    "reasoning": f"Ensures complete ownership of all created IP, software code, and deliverables without residual licensing claims.",
                    "action": "Retain broad assignment language with power of attorney to execute filings if needed."
                }

        # Termination / Default / Security Deposit
        if "termination" in title_lower or "default" in title_lower or "security deposit" in title_lower or "entry" in title_lower:
            if "tenant" in p_lower or "freelancer" in p_lower or "employee" in p_lower:
                if "without cause" in t_lower and "immediate" in t_lower:
                    return {
                        "level": "RED",
                        "reasoning": f"Allows the counterparty to terminate or declare default immediately with no notice or opportunity to cure.",
                        "action": "Demand a mandatory 30-day written notice period and an opportunity to cure any alleged default."
                    }
                elif "deposit" in title_lower and ("forfeit" in t_lower or "non-refundable" in t_lower):
                    return {
                        "level": "RED",
                        "reasoning": f"Enforces potential forfeiture of the security deposit without itemized accounting or strict statutory escrow.",
                        "action": "Require that deposit deductions be backed by receipts and unspent funds returned within 14-21 business days."
                    }
                else:
                    return {
                        "level": "YELLOW",
                        "reasoning": f"Termination provisions contain operational dependencies that require careful scheduling.",
                        "action": "Ensure bilateral termination rights with equal notice periods."
                    }
            else: # Landlord, Client, Employer
                return {
                    "level": "GREEN",
                    "reasoning": f"Provides prompt recourse, unilateral termination flexibility, and protection against non-performing counterparties.",
                    "action": "Ensure statutory notice procedures are strictly respected to preserve enforceability."
                }

        # Payment Terms / Audit / Rent Escalation
        if "payment" in title_lower or "rent" in title_lower or "fee" in title_lower or "escalation" in title_lower:
            if "freelancer" in p_lower or "contractor" in p_lower:
                if "net 60" in t_lower or "net 90" in t_lower or "upon client receipt of funds" in t_lower or "pay-when-paid" in t_lower:
                    return {
                        "level": "RED",
                        "reasoning": f"Delayed payment terms (Net 60/90 or pay-when-paid) place cash-flow burdens squarely on {perspective}.",
                        "action": "Push for Net 15 or Net 30 with 1.5% monthly late payment fee on undisputed overdue invoices."
                    }
                else:
                    return {
                        "level": "YELLOW",
                        "reasoning": "Standard payment schedule, but lacks specific interest penalties for late disbursement.",
                        "action": "Include statutory late fee interest terms and right to pause work on delinquent balances."
                    }
            elif "tenant" in p_lower:
                if "escalat" in t_lower or "pass-through" in t_lower:
                    return {
                        "level": "YELLOW",
                        "reasoning": f"Rent or operating expense pass-throughs can increase unexpected monthly liabilities for the Tenant.",
                        "action": "Request an annual cap (e.g., maximum 3-5%) on controllable operating expense increases."
                    }
            else:
                return {
                    "level": "GREEN",
                    "reasoning": f"Affords financial predictability, favorable payment buffers, and expense pass-through mechanisms.",
                    "action": "Maintain clear audit trails for billing reconciliation."
                }

        # Default fallback
        if "employee" in p_lower or "tenant" in p_lower or "freelancer" in p_lower:
            return {
                "level": "YELLOW",
                "reasoning": f"Standard commercial provision, but terms should be reviewed to guarantee mutual reciprocity.",
                "action": "Review with attorney to ensure fair bilateral rights."
            }
        else:
            return {
                "level": "GREEN",
                "reasoning": f"Standard protective covenant aligned with institutional best practices for {perspective}.",
                "action": "Confirm adherence to relevant governing law."
            }

risk_agent = RiskAgent()
