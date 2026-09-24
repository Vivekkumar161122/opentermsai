from fastapi import APIRouter, Response
from pydantic import BaseModel
from typing import Literal
from app.schemas import FullAnalysisOutput

router = APIRouter(prefix="/api", tags=["Export"])

class ExportPayload(BaseModel):
    analysis: FullAnalysisOutput
    format: Literal["markdown", "json"] = "markdown"

@router.post("/export-prep-pack")
async def export_prep_pack(payload: ExportPayload):
    """Generates downloadable Attorney Consultation Pack in Markdown or JSON format."""
    analysis = payload.analysis
    ctx = analysis.documentContext
    pack = analysis.lawyerConsultationPack

    if payload.format == "json":
        return Response(
            content=analysis.model_dump_json(indent=2),
            media_type="application/json",
            headers={
                "Content-Disposition": f'attachment; filename="OpenTerms_Attorney_Prep_{ctx.analyzedPerspective}.json"'
            }
        )

    # Markdown format
    lines = [
        f"# ATTORNEY CONSULTATION PACK: {ctx.title}",
        f"**Analyzed Perspective:** {ctx.analyzedPerspective}",
        f"**Document Type:** {ctx.documentType}",
        f"**Overall Aggregated Risk:** {ctx.overallRiskScore}",
        "",
        "## Executive Summary",
        ctx.executiveSummary,
        "",
        "---",
        "## 1. Critical Red Flags",
    ]
    for rf in pack.criticalRedFlags:
        lines.append(f"- ⚠️ **{rf}**")

    lines.extend([
        "",
        "## 2. Missing Standard Protections",
    ])
    for mp in pack.missingProtections:
        lines.append(f"- 🛡️ {mp}")

    lines.extend([
        "",
        "## 3. Targeted Questions For Your Attorney",
    ])
    for idx, q in enumerate(pack.questionsForCounsel, start=1):
        lines.append(f"{idx}. {q}")

    lines.extend([
        "",
        "---",
        "## 4. Clause Risk Breakdown",
    ])
    for c in analysis.analyzedClauses:
        badge = "🟢 GREEN" if c.perspectiveRiskLevel == "GREEN" else ("🟡 YELLOW" if c.perspectiveRiskLevel == "YELLOW" else "🔴 RED")
        lines.extend([
            f"### {c.clauseTitle} [{badge}] - Page {c.pageNumber}",
            f"**Plain-English Summary:** {c.simplifiedText}",
            f"**Risk Rationale ({ctx.analyzedPerspective}):** {c.riskReasoning}",
            f"**Counter-Proposal / Action:** {c.recommendedAction}",
            "**Original Verbatim Excerpt:**",
            f"> {c.originalText}",
            ""
        ])

    lines.extend([
        "---",
        f"*{analysis.disclaimer}*"
    ])

    markdown_content = "\n".join(lines)
    return Response(
        content=markdown_content,
        media_type="text/markdown",
        headers={
            "Content-Disposition": f'attachment; filename="OpenTerms_Attorney_Prep_{ctx.analyzedPerspective}.md"'
        }
    )
