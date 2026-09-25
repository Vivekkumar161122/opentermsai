# OpenTerms AI — Agentic Legal Document Navigation & Risk Analysis

> Built for **PromptWars: Virtual (Exclusive Edition)** by **Hack2skill**  
> **Challenge Theme:** *AI for Legal Assistance & Access*

OpenTerms AI is an enterprise-grade agentic GenAI legal intelligence platform built to democratize legal access by translating dense contracts into actionable, role-based insights, plain-English summaries, and attorney consultation prep-packs powered by Google Gemini.

[![Vercel Deployment](https://img.shields.io/badge/Deploy%20with-Vercel-black?style=flat&logo=vercel)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.11+](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://www.python.org/)
[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash%20%7C%201.5%20Pro-8E75B2.svg)](https://ai.google.dev/)

---

## 🎯 Problem Statement Alignment

Legal documents (commercial leases, independent contractor MSAs, employment agreements) are intentionally engineered with **asymmetric leverage**. A single provision—such as uncapped indemnification, 48-hour default deposit seizure, or a 24-month worldwide non-compete—provides total protection (**GREEN**) for an enterprise, but represents an existential financial hazard (**RED**) for a tenant, freelancer, or employee. Non-lawyers cannot afford $500–$800/hr retainers just to navigate basic agreements.

**OpenTerms AI addresses this by providing:**
1. **Asymmetric Risk Inversion (Core Innovation):** Dynamically inverts risk ratings and strategies when switching between counterparty lenses (Tenant ⇄ Landlord, Freelancer ⇄ Client, Employee ⇄ Employer).
2. **8th-Grade Plain-English Translation:** Translates dense legalese and archaic boilerplate into clear language anyone can understand.
3. **1-Click Proposed Redlines:** Provides ready-to-negotiate contract amendments and equitable revision language with one-click clipboard copying.
4. **Attorney Consultation Prep-Pack:** Detects missing statutory/commercial protections and auto-generates actionable checklists with pointed interrogation questions for outside counsel.
5. **Context-Grounded Q&A:** Grounded conversation citing exact verbatim clauses with interactive deep-links into the legal document viewer.
6. **Strict Legal Boundaries:** Built-in statutory disclaimers ensuring the tool operates strictly as an informational and navigation aid, never replacing licensed legal counsel.

---

## 🏗️ Multi-Agent Architecture

```text
                                  +------------------------------+
                                  |     Next.js 14 Frontend      |
                                  |   (Luxury Obsidian Split)    |
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
│   │   │   ├── layout.tsx         # Next.js root layout with Plus Jakarta Sans & Newsreader
│   │   │   ├── page.tsx           # Split-screen workstation connecting viewer & drawer
│   │   │   └── globals.css        # Obsidian styling, glassmorphism, & parchment textures
│   │   ├── components/
│   │   │   ├── Header.tsx         # Role selector, flip button, preset switcher, & status
│   │   │   ├── DocumentViewer.tsx # Left Pane: Search highlighter, match counters, & margin ribbons
│   │   │   ├── AiInsightsDrawer.tsx # Right Pane: SVG Risk Gauge, 1-click redline, & checklist
│   │   │   ├── ArchitectureModal.tsx # Interactive 4-agent Gemini pipeline modal
│   │   │   ├── SettingsModal.tsx  # Live backend health test & custom API configuration
│   │   │   ├── UploadModal.tsx    # Drag-and-drop contract uploader (under 25MB)
│   │   │   └── FooterDisclaimer.tsx # Mandatory statutory legal disclaimer
│   │   ├── lib/
│   │   │   ├── api.ts             # Typed REST API client with zero-crash demo fallback
│   │   │   └── demoData.ts        # Pre-computed grounded analysis for all 3 sample agreements
│   │   └── types.ts               # TypeScript interfaces matching backend Pydantic models
│   ├── vercel.json                # Vercel deployment configuration
│   └── package.json               # Next.js frontend dependencies
├── vercel.json                    # Root monorepo Vercel deployment configuration
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
> *Note: OpenTerms AI comes with built-in high-fidelity deterministic agent fallback algorithms, enabling complete functionality out of the box even without an external API key.*

### 3. One-Click Launch
```bash
./start.sh
```
This automatically boots both the FastAPI backend and Next.js frontend.

* **Frontend Dashboard:** [http://localhost:3000](http://localhost:3000)
* **Backend Swagger Docs:** [http://localhost:8000/docs](http://localhost:8000/docs)
* **Backend API Health:** [http://localhost:8000/health](http://localhost:8000/health)

---

## ☁️ 1-Click Vercel Deployment

Deploying OpenTerms AI to Vercel is instantaneous:

1. Import this repository into [Vercel](https://vercel.com).
2. The included `vercel.json` automatically handles the Next.js build.
3. *(Optional)* Add the `NEXT_PUBLIC_API_URL` environment variable if you host the FastAPI backend separately (e.g. on Railway, Render, or GCP Cloud Run).
4. If deployed without a live backend, OpenTerms AI automatically activates its **Interactive Standalone Showcase Mode**, providing full risk inversion, contract Q&A, and Attorney Prep-Pack generation with zero crashes!

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
