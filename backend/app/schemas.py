from typing import List, Literal, Optional
from pydantic import BaseModel, Field

RiskLevel = Literal["GREEN", "YELLOW", "RED"]
OverallRiskScore = Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]

class DocumentContext(BaseModel):
    title: str = Field(..., description="Name or title of the legal agreement")
    documentType: str = Field(..., description="Classification (e.g. Commercial Lease, NDA, Employment Agreement)")
    analyzedPerspective: str = Field(..., description="Lens of analysis e.g. Tenant, Landlord, Freelancer, Client")
    overallRiskScore: OverallRiskScore = Field(..., description="Overall aggregated risk: LOW | MEDIUM | HIGH | CRITICAL")
    executiveSummary: str = Field(..., description="High-level 2-3 paragraph breakdown of legal obligations and risks")

class AnalyzedClause(BaseModel):
    clauseId: str = Field(..., description="Unique identifier e.g. clause-1")
    clauseTitle: str = Field(..., description="Clear title e.g. Indemnification & Liability Cap")
    originalText: str = Field(..., description="Verbatim quote from the source contract text")
    simplifiedText: str = Field(..., description="Plain-language 8th-grade readability explanation")
    perspectiveRiskLevel: RiskLevel = Field(..., description="GREEN (protective/standard) | YELLOW (caution) | RED (critical risk/one-sided)")
    riskReasoning: str = Field(..., description="Detailed explanation of why it is risky or advantageous for the chosen role")
    pageNumber: int = Field(default=1, description="Page number where the clause appears in the source document")
    recommendedAction: str = Field(..., description="Specific counter-proposal, amendment, or negotiation tip")

class LawyerConsultationPack(BaseModel):
    criticalRedFlags: List[str] = Field(default_factory=list, description="Top high-severity hazards to negotiate immediately")
    missingProtections: List[str] = Field(default_factory=list, description="Standard statutory/commercial protections absent in the draft")
    questionsForCounsel: List[str] = Field(default_factory=list, description="Direct, pinpointed questions to ask your attorney")

class FullAnalysisOutput(BaseModel):
    documentContext: DocumentContext
    analyzedClauses: List[AnalyzedClause]
    lawyerConsultationPack: LawyerConsultationPack
    disclaimer: str = Field(
        default="OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions."
    )

class PageText(BaseModel):
    pageNumber: int
    text: str

class IngestedDocument(BaseModel):
    title: str
    documentType: str
    pages: List[PageText]
    rawText: str
    suggestedRoles: List[str]

class AnalysisRequest(BaseModel):
    perspective: str
    sampleId: Optional[str] = None
    rawText: Optional[str] = None
    pages: Optional[List[PageText]] = None
    documentTitle: Optional[str] = None

class ChatRequest(BaseModel):
    question: str
    perspective: str
    contractTitle: str
    clauses: List[AnalyzedClause]
    rawText: Optional[str] = None

class ChatResponse(BaseModel):
    answer: str
    citedClauseIds: List[str] = Field(default_factory=list)
    suggestedFollowUps: List[str] = Field(default_factory=list)
    disclaimer: str = Field(
        default="OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions."
    )
