import logging
from typing import List
from app.schemas import AnalyzedClause, LawyerConsultationPack

logger = logging.getLogger(__name__)

class PrepAgent:
    """
    Consultation Agent (prepAgent):
    Generates actionable checklists, flags missing standard protections,
    and drafts questions for a licensed attorney based on the analyzed clauses.
    """

    SYSTEM_INSTRUCTION = """You are OpenTerms AI's Lawyer Consultation Agent (prepAgent).
Your objective is to empower the user for their attorney meeting by synthesizing:
1. Critical Red Flags: The highest-severity liabilities in the agreement.
2. Missing Protections: Essential commercial or statutory clauses absent from this draft.
3. Questions for Counsel: Pinpointed, strategic questions the user should ask their attorney.

Ground strictly in legal best practices for the selected perspective."""

    def build_prep_pack_offline(
        self,
        clauses: List[AnalyzedClause],
        perspective: str,
        doc_type: str
    ) -> LawyerConsultationPack:
        p_lower = perspective.lower()
        red_clauses = [c for c in clauses if c.perspectiveRiskLevel == "RED"]
        yellow_clauses = [c for c in clauses if c.perspectiveRiskLevel == "YELLOW"]

        critical_red_flags: List[str] = []
        for rc in red_clauses:
            critical_red_flags.append(f"{rc.clauseTitle} (Page {rc.pageNumber}): {rc.riskReasoning}")

        if not critical_red_flags:
            if yellow_clauses:
                critical_red_flags.append(f"{yellow_clauses[0].clauseTitle}: Potential risk requiring clarification on notice and default terms.")
            else:
                critical_red_flags.append("No critical red flags identified for this perspective under standard terms.")

        # Determine missing protections based on doc_type and perspective
        missing_protections: List[str] = []
        clause_titles_joined = " ".join([c.clauseTitle.lower() for c in clauses])

        if "freelancer" in p_lower or "contractor" in p_lower:
            if "liability cap" not in clause_titles_joined and "limitation of liability" not in clause_titles_joined:
                missing_protections.append("Mutual Limitation of Liability Cap: Contract lacks an explicit monetary ceiling on contractor damages.")
            if "cure" not in clause_titles_joined:
                missing_protections.append("Notice & Opportunity to Cure: Lacks mandatory 15-30 day written warning before client can terminate for cause.")
            if "kill fee" not in clause_titles_joined and "deposit" not in clause_titles_joined:
                missing_protections.append("Upfront Deposit / Kill Fee: Missing protection for work-in-progress if client terminates project early.")
            if "portfolio" not in clause_titles_joined:
                missing_protections.append("Portfolio / Marketing Rights: Missing explicit right for contractor to showcase finished work in professional portfolios.")

        elif "tenant" in p_lower:
            if "quiet enjoyment" not in clause_titles_joined:
                missing_protections.append("Covenant of Quiet Enjoyment: Missing explicit landlord guarantee of uninterrupted premises possession.")
            if "cam cap" not in clause_titles_joined and "expense cap" not in clause_titles_joined:
                missing_protections.append("Operating Expense / CAM Cap: No annual cap (e.g. 3-5%) on common area maintenance pass-through charges.")
            if "abatement" not in clause_titles_joined:
                missing_protections.append("Rent Abatement on Casualty: Missing rent pause provision if premises become unusable due to fire or flooding.")

        elif "employee" in p_lower:
            if "severance" not in clause_titles_joined:
                missing_protections.append("Severance Guarantee: No defined severance payment structure in event of termination without cause.")
            if "good reason" not in clause_titles_joined:
                missing_protections.append("Resignation for Good Reason: Inability to trigger severance if duties or salary are unilaterally slashed.")

        else: # Landlord, Employer, Client
            if "audit" not in clause_titles_joined:
                missing_protections.append("Audit & Inspection Rights: Absence of formal right to inspect books, records, or premises on reasonable notice.")
            if "injunctive relief" not in clause_titles_joined:
                missing_protections.append("Immediate Injunctive Relief: Missing provision allowing immediate court injunction upon breach of confidentiality/IP.")

        if not missing_protections:
            missing_protections.append("Force Majeure & Unforeseen Delays: Ensure events outside control excuse temporary performance delays.")
            missing_protections.append("Attorneys' Fees Clause: Ensure the prevailing party in litigation recovers reasonable legal costs.")

        # Questions for Counsel
        questions: List[str] = [
            f"Given our local jurisdiction, is the current {red_clauses[0].clauseTitle if red_clauses else 'indemnification and termination structure'} customary or unusually aggressive?",
            f"What specific redline language should we propose to cap our financial exposure as a {perspective}?",
            "Are any non-compete, non-solicitation, or restrictive covenants enforceable in our state/territory?",
            "If the counterparty enters bankruptcy or repudiates the agreement, what immediate lien or escrow protections do we have?"
        ]

        return LawyerConsultationPack(
            criticalRedFlags=critical_red_flags,
            missingProtections=missing_protections,
            questionsForCounsel=questions
        )

prep_agent = PrepAgent()
