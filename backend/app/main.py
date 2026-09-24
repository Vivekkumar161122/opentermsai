import logging
from fastapi import FastAPI, Request, status
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware

from app.config import LEGAL_DISCLAIMER, GEMINI_MODEL
from app.services.gemini_client import gemini_service
from app.routes import analysis, chat, export

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("opentermsai")

app = FastAPI(
    title="OpenTerms AI API",
    description="Agentic Legal Document Navigation, Risk Analysis & Contract Simplification",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(analysis.router)
app.include_router(chat.router)
app.include_router(export.router)

@app.get("/")
def read_root():
    return {
        "service": "OpenTerms AI API",
        "status": "operational",
        "engine": GEMINI_MODEL,
        "geminiClientActive": gemini_service.has_client,
        "disclaimer": LEGAL_DISCLAIMER
    }

@app.get("/health")
def healthcheck():
    return {
        "status": "healthy",
        "geminiConnected": gemini_service.has_client
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
