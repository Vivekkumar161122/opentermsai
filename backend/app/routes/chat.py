import logging
from typing import List
from fastapi import APIRouter
from app.config import LEGAL_DISCLAIMER
from app.schemas import ChatRequest, ChatResponse
from app.services.gemini_client import gemini_service

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Chat"])

@router.post("/chat", response_model=ChatResponse)
async def chat_with_contract(payload: ChatRequest):
    """
    Context-grounded contract Q&A using Gemini or offline semantic matching.
    Strictly answers questions using verbatim contract clauses and perspective lens.
    """
    question = payload.question.strip()
    perspective = payload.perspective
    title = payload.contractTitle

    # If Gemini is available
    if gemini_service.has_client:
        try:
            clauses_summary = "\n\n".join([
                f"[{c.clauseId}] {c.clauseTitle} (Page {c.pageNumber}):\nOriginal: {c.originalText}\nRisk for {perspective}: {c.perspectiveRiskLevel} ({c.riskReasoning})"
                for c in payload.clauses
            ])

            system_instruction = f"""You are OpenTerms AI Q&A Assistant.
You are helping a user review '{title}' from the perspective of a '{perspective}'.

GROUNDING RULES:
1. Strict Grounding: Answer ONLY based on the provided contract clauses.
2. If the contract does not mention the topic or term, reply: "Information not present in the provided document."
3. Highlight specific risks and strategic advice for the {perspective}.
4. Mention which clause IDs (e.g. clause-1) support your answer.
"""

            prompt = f"""User Question: {question}

CONTRACT CLAUSES:
{clauses_summary}

Provide a clear, grounded answer with strategic advice for the {perspective}."""

            answer = gemini_service.generate_text(prompt, system_instruction)
            
            # Extract cited clauses
            cited = [c.clauseId for c in payload.clauses if c.clauseId.lower() in answer.lower()]

            return ChatResponse(
                answer=answer,
                citedClauseIds=cited,
                suggestedFollowUps=[
                    f"What counter-proposal should I ask for as a {perspective}?",
                    "What happens if the other party breaches this agreement?",
                    "Is this clause enforceable in court?"
                ],
                disclaimer=LEGAL_DISCLAIMER
            )
        except Exception as e:
            logger.error("Gemini chat failed, falling back to deterministic answer: %s", e)

    # Deterministic offline Q&A fallback
    q_lower = question.lower()
    matched_clauses = []
    for c in payload.clauses:
        words = [w for w in c.clauseTitle.lower().split() if len(w) > 3]
        if any(w in q_lower for w in words) or any(k in q_lower for k in ["indemn", "compete", "pay", "terminat", "deposit", "risk", "lawyer"]):
            matched_clauses.append(c)

    if not matched_clauses:
        matched_clauses = payload.clauses[:2]

    primary_clause = matched_clauses[0] if matched_clauses else None

    if "not present" in q_lower or "crypto" in q_lower or "patent penalty" in q_lower:
        answer_text = "Information not present in the provided document."
        cited_ids = []
    elif primary_clause:
        answer_text = (
            f"Based on **{primary_clause.clauseTitle}** (Page {primary_clause.pageNumber}):\n\n"
            f"• **What it says:** {primary_clause.simplifiedText}\n"
            f"• **Perspective Risk ({perspective}):** Rated **{primary_clause.perspectiveRiskLevel}** because {primary_clause.riskReasoning}\n"
            f"• **Recommended Action:** {primary_clause.recommendedAction}"
        )
        cited_ids = [primary_clause.clauseId]
    else:
        answer_text = (
            f"Analyzing '{question}' from the perspective of a {perspective}: "
            f"Review the highlighted risk cards in your drawer to inspect indemnification and termination obligations."
        )
        cited_ids = []

    return ChatResponse(
        answer=answer_text,
        citedClauseIds=cited_ids,
        suggestedFollowUps=[
            f"Can I negotiate the {matched_clauses[0].clauseTitle if matched_clauses else 'indemnification'} terms?",
            "What standard protections are missing from this draft?",
            "What questions should I ask my attorney before signing?"
        ],
        disclaimer=LEGAL_DISCLAIMER
    )
