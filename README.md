<div align="center">

# ⚖️ OpenTerms AI
### Agentic Legal Document Navigation, Asymmetric Risk Analysis & Contract Simplification

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-GenAI_SDK-4285F4?style=for-the-badge&logo=google)](https://ai.google.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

<p align="center">
  <b>Democratizing legal access by translating dense contracts into actionable, role-based insights, plain-English summaries, and attorney consultation packs.</b>
</p>

</div>

---

## 🌟 Key Highlights

- **🎯 Asymmetric Risk Flipping:** Dynamically evaluates contracts through your specific leverage lens (*Tenant ↔ Landlord*, *Freelancer ↔ Client*, *Employee ↔ Employer*). A covenant that protects an employer (**GREEN**) is flagged as a critical hazard (**RED**) for an employee.
- **⚡ Split-Screen Interactive Deep-Linking:** Real-time synchronized navigation between the left document viewer and right AI intelligence drawer. Clicking any risk card smoothly scrolls to and illuminates the verbatim contract excerpt.
- **📖 8th-Grade Plain-English Translation:** Strips archaic legal jargon (*inter alia*, uncapped indemnities, liquidated damages) into actionable, plain-language summaries.
- **🛡️ Lawyer Consultation Prep-Pack:** Generates an executive attorney consultation briefing containing critical red flags, missing statutory protections, and pinpointed questions for legal counsel. Downloadable in Markdown (`.md`) or JSON.
- **💬 Grounded Contract Q&A:** Multi-turn conversational legal assistant strictly grounded in the document context with zero-hallucination guardrails and clause citations.
- **📂 Universal Ingestion:** Supports drag-and-drop ingestion of PDF, DOCX, and TXT agreements up to 25MB with structural page preservation.

---

## 🏗️ Multi-Agent Architecture

```
                                  +------------------------------+
                                  |     Next.js 14 Frontend      |
                                  |  (Split-Screen Dashboard)    |
                                  +--------------+---------------+
                                                 |
                       REST API Calls / Upload   |  Deep-link & Synchronized State
                                                 v
                                  +------------------------------+
                                  |      FastAPI Backend         |
                                  |      (App Router & Models)   |
                                  +--------------+---------------+
                                                 |
       +-----------------------------------------+-----------------------------------------+
       |                                         |                                         |
       v                                         v                                         v
+-------------------+                 +---------------------+                    +-------------------+
|  ingestAgent      |                 |     riskAgent       |                    |   simplifyAgent   |
| (PDF/DOCX Parser  |                 | (Asymmetric Role-   |                    | (8th-Grade Plain  |
| & Page Extractor) |                 |  Based Evaluator)   |                    |  English Logic)   |
+-------------------+                 +----------+----------+                    +-------------------+
                                                 |
                                                 v
                                      +---------------------+
                                      |     prepAgent       |
                                      | (Attorney Checklists|
                                      |  & Consultation Pack|
                                      +---------------------+
                                                 |
                                                 v
                               +-----------------------------------+
                               | Google Gemini 1.5 Pro / 2.5 Flash |
                               | (Structured Output & Pydantic)    |
                               +-----------------------------------+
```

### Specialized Agents

| Agent | Module | Role & Responsibility |
| :--- | :--- | :--- |
| **`ingestAgent`** | `app.services.ingest_agent` | Ingests PDF/DOCX binary streams, preserves structural page metadata, and splits documents into addressable clause units. |
| **`riskAgent`** | `app.services.risk_agent` | Calculates fairness and liability asymmetrically based on counterparty leverage and contract context. |
| **`simplifyAgent`** | `app.services.simplify_agent` | Translates legalese into 8th-grade readability level summaries without legal Latin or ambiguous qualifiers. |
| **`prepAgent`** | `app.services.prep_agent` | Synthesizes critical hazards, detects absent customary protections (caps, cure periods), and formulates strategic questions for attorneys. |

---

## 📂 Project Organization

```text
opentermsai/
├── backend/
│   ├── app/
│   │   ├── config.py              # Environment configuration & retry backoff settings
│   │   ├── schemas.py             # Strict Pydantic models (SDLC Phase 2)
│   │   ├── sample_documents.py    # Preloaded Commercial Lease, MSA, & Employment agreements
│   │   ├── main.py                # FastAPI entrypoint with CORS & file validation middleware
│   │   ├── services/
│   │   │   ├── gemini_client.py   # Tenacity backoff & Google GenAI SDK integration
│   │   │   ├── ingest_agent.py    # Structural PDF/DOCX parser
│   │   │   ├── risk_agent.py      # Asymmetric role-based risk engine
│   │   │   ├── simplify_agent.py  # 8th-grade readability translator
│   │   │   ├── prep_agent.py      # Lawyer consultation pack generator
│   │   │   └── orchestrator.py    # Multi-agent orchestrator & disclaimer enforcement
│   │   └── routes/
│   │       ├── analysis.py        # /api/analyze-upload, /api/analyze-sample, /api/reanalyze
│   │       ├── chat.py            # /api/chat (Context-grounded contract Q&A)
│   │       └── export.py          # /api/export-prep-pack (Markdown & JSON exports)
│   ├── tests/
│   │   └── test_risk_agent.py     # Automated unit tests for asymmetric risk reversal
│   └── requirements.txt           # Python backend dependencies
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx         # Next.js root layout with dark theme
│   │   │   ├── page.tsx           # Split-screen dashboard connecting viewer & drawer
│   │   │   └── globals.css        # Custom scrollbars & highlight animations
│   │   ├── components/
│   │   │   ├── Header.tsx         # Role selector dropdown & contract preset switcher
│   │   │   ├── DocumentViewer.tsx # Left Pane: Document viewer with clickable highlights
│   │   │   ├── AiInsightsDrawer.tsx # Right Pane: Summary, Risk Matrix, Q&A, Lawyer Pack
│   │   │   ├── UploadModal.tsx    # Drag-and-drop contract uploader (under 25MB)
│   │   │   └── FooterDisclaimer.tsx # Mandatory statutory legal disclaimer
│   │   ├── lib/
│   │   │   └── api.ts             # Typed REST API client for backend
│   │   └── types.ts               # TypeScript interfaces matching backend Pydantic models
│   └── package.json               # Next.js frontend dependencies
├── .env.example                   # Environment variable template
├── .gitignore                     # Git ignore rules for Python & Node.js
├── pytest.ini                     # Pytest runner configuration
├── start.sh                       # 1-Click local launch script
└── README.md                      # Documentation
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js** >= 18.0.0
- **Python** >= 3.10
- **npm** or **pnpm** / **yarn**

### 1. Clone the Repository
```bash
git clone https://github.com/Vivekkumar161122/opentermsai.git
cd opentermsai
```

### 2. Environment Configuration (Optional for Live Gemini)
```bash
cp .env.example .env
# Add your Gemini API key:
# GEMINI_API_KEY="your-api-key"
```
> *Note: OpenTerms AI comes with high-fidelity deterministic agent fallback algorithms, enabling complete functionality out of the box even without an external API key.*

### 3. One-Click Launch
```bash
./start.sh
```
This automatically boots both the FastAPI backend and Next.js frontend.

* **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
* **Backend Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend API Health:** [http://localhost:8000/health](http://localhost:8000/health)

---

## 🧪 Automated Testing Suite

Run the full suite of unit tests verifying asymmetric risk score flipping and schema compliance:

```bash
# Activate backend environment
source backend/venv/bin/activate

# Execute pytest
pytest -v
```

### Test Coverage Highlights
* `test_risk_agent_flips_non_compete`: Confirms non-compete covenants flip from **RED** (Employee) to **GREEN** (Employer).
* `test_risk_agent_flips_indemnification`: Confirms uncapped indemnities flip from **RED** (Freelancer) to **GREEN** (Client).
* `test_risk_agent_flips_lease_entry`: Confirms entry without notice flips from **RED** (Tenant) to **GREEN** (Landlord).
* `test_orchestrator_schema_compliance_and_disclaimer`: Validates strict Pydantic JSON schema structure and mandatory legal disclaimer attachment.

---

## 🔒 Mandatory Legal Disclaimer

> *OpenTerms AI provides automated document structure breakdown and informational analysis only. It does not constitute legal advice or formal representation. Always consult a qualified attorney for legal decisions.*

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).
