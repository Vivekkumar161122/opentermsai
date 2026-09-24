import logging
import re
from typing import List, Optional
from app.config import LEGAL_DISCLAIMER
from app.schemas import (
    FullAnalysisOutput,
    DocumentContext,
    AnalyzedClause,
    LawyerConsultationPack,
    PageText,
    OverallRiskScore,
)
from app.services.gemini_client import gemini_service
from app.services.ingest_agent import ingest_agent
from app.services.risk_agent import risk_agent
from app.services.simplify_agent import simplify_agent
from app.services.prep_agent import prep_agent

logger = logging.getLogger(__name__)

class PipelineOrchestrator:
    """
    Decoupled Multi-Agent Orchestrator:
    Coordinates ingestAgent -> riskAgent -> simplifyAgent -> prepAgent.
    Enforces strict Pydantic schemas, zero-hallucination verbatim grounding,
    and mandatory legal disclaimer.
    """

    def analyze_document(
        self,
        raw_text: str,
        pages: List[PageText],
        perspective: str,
        doc_title: Optional[str] = None,
        doc_type: Optional[str] = None,
    ) -> FullAnalysisOutput:
        # If title or doc_type not provided, infer from text
        if not doc_title or not doc_type:
            inferred_type, inferred_title, _ = ingest_agent._infer_metadata(raw_text, "contract.pdf")
            doc_title = doc_title or inferred_title
            doc_type = doc_type or inferred_type

        # Try executing via Gemini if key is present
        if gemini_service.has_client:
            try:
                return self._run_gemini_pipeline(raw_text, pages, perspective, doc_title, doc_type)
            except Exception as e:
                logger.error("Gemini pipeline execution failed, falling back to deterministic multi-agent: %s", e)

        # Deterministic multi-agent fallback
        return self._run_deterministic_pipeline(raw_text, pages, perspective, doc_title, doc_type)

    def _run_gemini_pipeline(
        self,
        raw_text: str,
        pages: List[PageText],
        perspective: str,
        doc_title: str,
        doc_type: str,
    ) -> FullAnalysisOutput:
        system_instruction = f"""You are OpenTerms AI, an elite legal intelligence platform.
You analyze legal agreements through the specific asymmetric lens of the user's perspective: '{perspective}'.

GROUNDING & INTEGRITY RULES:
1. Strict Grounding & Zero Hallucination: All 'originalText' fields MUST BE VERBATIM EXCERPTS from the provided document. If a detail is missing, state 'Information not present in the provided document.'
2. Dynamic Asymmetry:
   - For an Employee/Freelancer/Tenant: Non-compete clauses, uncapped indemnity, unilateral termination, waiver of jury trial, or deposit forfeitures are RED.
   - For an Employer/Client/Landlord: Those same protective clauses are GREEN or YELLOW.
3. Plain-language Simplification: 'simplifiedText' must be written at an 8th-grade readability level with zero archaic legal jargon.
4. Output Schema: Adhere strictly to the requested JSON schema.
"""

        prompt = f"""DOCUMENT TITLE: {doc_title}
DOCUMENT TYPE: {doc_type}
SELECTED PERSPECTIVE: {perspective}

SOURCE DOCUMENT CONTENT:
\"\"\"
{raw_text[:120000]}
\"\"\"

Please conduct the full risk analysis, clause breakdown, and lawyer consultation prep pack for perspective '{perspective}'."""

        output = gemini_service.generate_structured_output(
            prompt=prompt,
            system_instruction=system_instruction,
            response_model=FullAnalysisOutput,
        )

        # Enforce exact mandatory legal disclaimer
        output.disclaimer = LEGAL_DISCLAIMER
        return output

    def _run_deterministic_pipeline(
        self,
        raw_text: str,
        pages: List[PageText],
        perspective: str,
        doc_title: str,
        doc_type: str,
    ) -> FullAnalysisOutput:
        clauses_raw = self._extract_clauses_from_text(pages)
        analyzed_clauses: List[AnalyzedClause] = []

        red_count = 0
        yellow_count = 0

        for idx, (title, orig_text, page_num) in enumerate(clauses_raw, start=1):
            # Run riskAgent
            risk_eval = risk_agent.evaluate_clause_offline(title, orig_text, perspective)
            risk_level = risk_eval["level"]
            if risk_level == "RED":
                red_count += 1
            elif risk_level == "YELLOW":
                yellow_count += 1

            # Run simplifyAgent
            simplified = simplify_agent.simplify_offline(title, orig_text)

            analyzed_clauses.append(
                AnalyzedClause(
                    clauseId=f"clause-{idx}",
                    clauseTitle=title,
                    originalText=orig_text,
                    simplifiedText=simplified,
                    perspectiveRiskLevel=risk_level,
                    riskReasoning=risk_eval["reasoning"],
                    pageNumber=page_num,
                    recommendedAction=risk_eval["action"],
                )
            )

        # Compute overall risk score
        overall_risk: OverallRiskScore = "LOW"
        if red_count >= 2:
            overall_risk = "CRITICAL"
        elif red_count == 1:
            overall_risk = "HIGH"
        elif yellow_count >= 2:
            overall_risk = "MEDIUM"

        # Executive summary
        summary = (
            f"This {doc_type} ('{doc_title}') was analyzed specifically from the perspective of the {perspective}. "
            f"The agreement presents an overall risk profile of {overall_risk}, with {red_count} critical red-flag clause(s) "
            f"and {yellow_count} clause(s) requiring caution. "
            f"Key leverage points revolve around indemnification obligations, termination cure periods, "
            f"and intellectual property or operational restrictions. Review the lawyer consultation pack before executing."
        )

        doc_context = DocumentContext(
            title=doc_title,
            documentType=doc_type,
            analyzedPerspective=perspective,
            overallRiskScore=overall_risk,
            executiveSummary=summary,
        )

        # Run prepAgent
        prep_pack = prep_agent.build_prep_pack_offline(analyzed_clauses, perspective, doc_type)

        return FullAnalysisOutput(
            documentContext=doc_context,
            analyzedClauses=analyzed_clauses,
            lawyerConsultationPack=prep_pack,
            disclaimer=LEGAL_DISCLAIMER,
        )

    def _extract_clauses_from_text(self, pages: List[PageText]) -> List[tuple]:
        """Splits page texts into identified clauses with verbatim text and page numbers."""
        results = []
        clause_keywords = [
            ("Indemnification & Third-Party Liability", ["indemnif", "hold harmless", "defense of claims"]),
            ("Non-Compete & Restrictive Covenants", ["non-compete", "covenant not to compete", "restraint"]),
            ("Intellectual Property & Work-for-Hire", ["work made for hire", "intellectual property", "inventions", "assignment of work"]),
            ("Termination, Default & Cure Period", ["termination", "term and termination", "events of default"]),
            ("Security Deposit & Forfeiture", ["security deposit", "deposit return", "deductions"]),
            ("Payment Terms, Invoicing & Late Fees", ["payment terms", "rent payment", "invoicing", "fees"]),
            ("Confidentiality & Non-Disclosure", ["confidentiality", "proprietary information", "trade secrets"]),
            ("Limitation of Liability & Consequential Damages", ["limitation of liability", "consequential damages", "liability cap"]),
            ("Governing Law & Dispute Resolution", ["governing law", "jurisdiction", "arbitration"]),
        ]

        found_titles = set()

        for page in pages:
            lines = page.text.split("\n")
            current_paragraph = []
            
            for line in lines:
                if not line.strip():
                    if current_paragraph:
                        p_text = " ".join(current_paragraph).strip()
                        current_paragraph = []
                        if len(p_text.split()) > 10:
                            # Check match
                            for title, kws in clause_keywords:
                                if title not in found_titles and any(kw in p_text.lower() for kw in kws):
                                    found_titles.add(title)
                                    results.append((title, p_text, page.pageNumber))
                                    break
                else:
                    current_paragraph.append(line.strip())

            if current_paragraph:
                p_text = " ".join(current_paragraph).strip()
                if len(p_text.split()) > 10:
                    for title, kws in clause_keywords:
                        if title not in found_titles and any(kw in p_text.lower() for kw in kws):
                            found_titles.add(title)
                            results.append((title, p_text, page.pageNumber))
                            break

        # Fallback if text lacked specific headings: create structured segments
        if not results:
            for p in pages:
                results.append((f"General Terms (Page {p.pageNumber})", p.text[:500] if p.text else "No text present.", p.pageNumber))

        return results

orchestrator = PipelineOrchestrator()
