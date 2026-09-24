import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env from backend directory or project root if present
load_dotenv()
load_dotenv(Path(__file__).parent.parent / ".env")
load_dotenv(Path(__file__).parent.parent.parent / ".env")

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
# Recommended model: gemini-2.5-flash or gemini-2.5-pro / gemini-3.7-flash
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

MAX_FILE_SIZE_MB = 25
ALLOWED_EXTENSIONS = {".pdf", ".docx", ".txt"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
    "text/plain",
    "application/octet-stream",  # Often sent for binary files
}

LEGAL_DISCLAIMER = (
    "OpenTerms AI provides automated document structure breakdown and informational analysis only. "
    "It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions."
)
