import logging
from typing import Optional, List
from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from pydantic import BaseModel

from app.schemas import (
    FullAnalysisOutput,
    AnalysisRequest,
    PageText,
)
from app.services.ingest_agent import ingest_agent
from app.services.orchestrator import orchestrator
from app.sample_documents import SAMPLE_DOCUMENTS

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/api", tags=["Analysis"])

class SampleDocumentMeta(BaseModel):
    id: str
    title: str
    documentType: str
    defaultPerspective: str
    availablePerspectives: List[str]
    description: str

@router.get("/samples", response_model=List[SampleDocumentMeta])
async def list_sample_documents():
    """Returns catalog of preloaded contracts ready for instant role-based risk analysis."""
    result = []
    for k, v in SAMPLE_DOCUMENTS.items():
        result.append(
            SampleDocumentMeta(
                id=v["id"],
                title=v["title"],
                documentType=v["documentType"],
                defaultPerspective=v["defaultPerspective"],
                availablePerspectives=v["availablePerspectives"],
                description=v["description"]
            )
        )
    return result

@router.post("/analyze-sample", response_model=FullAnalysisOutput)
async def analyze_sample(
    sample_id: str = Form(..., description="ID of preloaded sample contract"),
    perspective: str = Form(..., description="Lens of analysis e.g. Tenant, Freelancer, Landlord")
):
    """Analyzes a preloaded contract under a chosen perspective lens."""
    if sample_id not in SAMPLE_DOCUMENTS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Sample document '{sample_id}' not found."
        )

    doc_data = SAMPLE_DOCUMENTS[sample_id]
    pages: List[PageText] = doc_data["pages"]
    raw_text = "\n\n".join([f"--- PAGE {p.pageNumber} ---\n{p.text}" for p in pages])

    output = orchestrator.analyze_document(
        raw_text=raw_text,
        pages=pages,
        perspective=perspective,
        doc_title=doc_data["title"],
        doc_type=doc_data["documentType"]
    )
    return output

@router.post("/analyze-upload", response_model=FullAnalysisOutput)
async def analyze_uploaded_file(
    file: UploadFile = File(..., description="PDF or DOCX or TXT contract file"),
    perspective: str = Form("Tenant", description="Selected perspective lens")
):
    """
    Ingests PDF/DOCX contract file, extracts structural pages,
    and runs multi-agent risk and plain-English analysis pipeline.
    """
    filename = file.filename or "contract.pdf"
    content_type = file.content_type or ""
    file_bytes = await file.read()

    # Enforce 25MB file size limit
    if len(file_bytes) > 25 * 1024 * 1024:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum allowable limit of 25MB."
        )

    lower_filename = filename.lower()
    if lower_filename.endswith(".pdf") or "pdf" in content_type:
        ingested = ingest_agent.parse_pdf(file_bytes, filename)
    elif lower_filename.endswith(".docx") or "officedocument" in content_type:
        ingested = ingest_agent.parse_docx(file_bytes, filename)
    elif lower_filename.endswith(".txt") or "text" in content_type:
        text_content = file_bytes.decode("utf-8", errors="replace")
        ingested = ingest_agent.parse_text(text_content, filename)
    else:
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Unsupported format. Only PDF (.pdf), Word (.docx), and plain text (.txt) files are supported."
        )

    output = orchestrator.analyze_document(
        raw_text=ingested.rawText,
        pages=ingested.pages,
        perspective=perspective,
        doc_title=ingested.title,
        doc_type=ingested.documentType
    )
    return output

@router.post("/reanalyze", response_model=FullAnalysisOutput)
async def reanalyze_perspective(payload: AnalysisRequest):
    """
    Dynamically flips analysis lens for an already ingested document,
    instantly recalculating asymmetric risk ratings and lawyer prep-pack.
    """
    if payload.sampleId and payload.sampleId in SAMPLE_DOCUMENTS:
        doc_data = SAMPLE_DOCUMENTS[payload.sampleId]
        pages = doc_data["pages"]
        raw_text = "\n\n".join([f"--- PAGE {p.pageNumber} ---\n{p.text}" for p in pages])
        title = doc_data["title"]
        doc_type = doc_data["documentType"]
    elif payload.pages and len(payload.pages) > 0:
        pages = payload.pages
        raw_text = payload.rawText or "\n\n".join([f"--- PAGE {p.pageNumber} ---\n{p.text}" for p in pages])
        title = payload.documentTitle or "Contract Document"
        doc_type = "Legal Agreement"
    elif payload.rawText:
        ingested = ingest_agent.parse_text(payload.rawText, payload.documentTitle or "document.txt")
        pages = ingested.pages
        raw_text = ingested.rawText
        title = ingested.title
        doc_type = ingested.documentType
    else:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Must supply either sampleId, pages, or rawText for reanalysis."
        )

    output = orchestrator.analyze_document(
        raw_text=raw_text,
        pages=pages,
        perspective=payload.perspective,
        doc_title=title,
        doc_type=doc_type
    )
    return output
