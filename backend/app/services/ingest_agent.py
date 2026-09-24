import io
import logging
from typing import List, Tuple
import pypdf
import docx

from app.schemas import PageText, IngestedDocument

logger = logging.getLogger(__name__)

class IngestAgent:
    """
    Parser Agent (ingestAgent):
    Extracts raw text from PDF/DOCX/TXT files while preserving structural metadata
    (page numbers, clause blocks, section markers).
    """

    def parse_pdf(self, file_bytes: bytes, filename: str = "document.pdf") -> IngestedDocument:
        reader = pypdf.PdfReader(io.BytesIO(file_bytes))
        pages: List[PageText] = []
        raw_text_parts: List[str] = []

        for idx, page in enumerate(reader.pages, start=1):
            text = page.extract_text() or ""
            text = text.strip()
            pages.append(PageText(pageNumber=idx, text=text))
            raw_text_parts.append(f"--- PAGE {idx} ---\n{text}")

        raw_text = "\n\n".join(raw_text_parts)
        doc_type, title, suggested_roles = self._infer_metadata(raw_text, filename)

        return IngestedDocument(
            title=title,
            documentType=doc_type,
            pages=pages,
            rawText=raw_text,
            suggestedRoles=suggested_roles
        )

    def parse_docx(self, file_bytes: bytes, filename: str = "document.docx") -> IngestedDocument:
        doc = docx.Document(io.BytesIO(file_bytes))
        paragraphs = [p.text for p in doc.paragraphs if p.text.strip()]
        
        # Approximate 400 words per page for DOCX
        words_per_page = 400
        pages: List[PageText] = []
        current_page_text: List[str] = []
        current_word_count = 0
        page_num = 1

        for p in paragraphs:
            p_words = len(p.split())
            if current_word_count + p_words > words_per_page and current_page_text:
                pages.append(PageText(pageNumber=page_num, text="\n\n".join(current_page_text)))
                page_num += 1
                current_page_text = [p]
                current_word_count = p_words
            else:
                current_page_text.append(p)
                current_word_count += p_words

        if current_page_text:
            pages.append(PageText(pageNumber=page_num, text="\n\n".join(current_page_text)))

        raw_text = "\n\n".join([f"--- PAGE {p.pageNumber} ---\n{p.text}" for p in pages])
        doc_type, title, suggested_roles = self._infer_metadata(raw_text, filename)

        return IngestedDocument(
            title=title,
            documentType=doc_type,
            pages=pages,
            rawText=raw_text,
            suggestedRoles=suggested_roles
        )

    def parse_text(self, text_content: str, filename: str = "document.txt") -> IngestedDocument:
        # Split on existing page markers if present or chunk
        chunks = text_content.split("--- PAGE ")
        pages: List[PageText] = []
        if len(chunks) > 1:
            for c in chunks:
                if not c.strip():
                    continue
                lines = c.split("\n", 1)
                page_header = lines[0].split(" ---")[0].strip()
                try:
                    p_num = int(page_header)
                except ValueError:
                    p_num = len(pages) + 1
                body = lines[1] if len(lines) > 1 else ""
                pages.append(PageText(pageNumber=p_num, text=body.strip()))
        else:
            pages.append(PageText(pageNumber=1, text=text_content.strip()))

        doc_type, title, suggested_roles = self._infer_metadata(text_content, filename)
        return IngestedDocument(
            title=title,
            documentType=doc_type,
            pages=pages,
            rawText=text_content,
            suggestedRoles=suggested_roles
        )

    def _infer_metadata(self, raw_text: str, filename: str) -> Tuple[str, str, List[str]]:
        lower = raw_text.lower()
        if "lease" in lower or "landlord" in lower or "tenant" in lower:
            return "Commercial Lease Agreement", "Commercial Property Lease", ["Tenant", "Landlord"]
        elif "employment" in lower or "employer" in lower or "employee" in lower:
            return "Employment Agreement", "Executive Employment Agreement", ["Employee", "Employer"]
        elif "contractor" in lower or "freelance" in lower or "services agreement" in lower:
            return "Independent Contractor Agreement", "Master Services Agreement", ["Freelancer", "Client"]
        elif "non-disclosure" in lower or "confidentiality" in lower or "nda" in lower:
            return "Non-Disclosure Agreement (NDA)", "Mutual Non-Disclosure Agreement", ["Disclosing Party", "Receiving Party"]
        elif "saas" in lower or "software as a service" in lower or "license" in lower:
            return "SaaS Terms of Service", "Enterprise Software Agreement", ["Customer", "Vendor"]
        
        # Default
        clean_name = filename.replace(".pdf", "").replace(".docx", "").replace(".txt", "").replace("_", " ").title()
        return "General Commercial Contract", clean_name or "Standard Legal Agreement", ["Party A", "Party B"]

ingest_agent = IngestAgent()
