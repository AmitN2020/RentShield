# RentShield Bengaluru: Rental Agreement Risk Analyzer

A legaltech web application tailored specifically for tenants in **Bengaluru, Karnataka**. It provides automated PDF ingestion, clause-by-clause categorization across **17 functional categories**, deterministic weighted risk scoring, missing mandatory clause detection (11-point checklist), and an automated WhatsApp negotiation assistant.

---

## 🚀 Key Features

* **Bengaluru Market Grounding:** Evaluates rental terms against Karnataka norms (2-month deposit benchmark, 1-month painting deduction prohibition, lock-in emergency exit requirements).
* **Deterministic Risk Scoring:** Mathematically calculates category weights ($S_{overall} = \sum_{i=1}^{17} Score_i \times Weight_i$) rather than arbitrary LLM output.
* **11-Point Missing Clause Detection:** Scans for essential statutory provisions and supplies ready-to-insert recommended draft text.
* **Administrator-Configured LLM Backends:** All API keys reside strictly on the server in `.env`. The user simply switches between configured providers (e.g. Google Gemini, Groq, OpenRouter, OpenAI) from the UI dropdown.
* **Interactive WhatsApp Negotiator:** 1-click generator for polite, assertive WhatsApp negotiation messages citing market norms and proposing fair amendments.
* **Dual Parsing Engine:** Digital PDF extraction via `pypdf` with automatic OCR fallback.
* **Split-Screen Raw Document Viewer:** Synchronized raw text review alongside categorized risk cards.

---

## 🛠️ Tech Stack

* **Frontend:** React 19 (Vite) + Tailwind CSS + Lucide Icons + Canvas Confetti
* **Backend:** Python 3.12 (FastAPI) + Pydantic v2 + Uvicorn + PyPDF
* **Design:** Dark mode, glassmorphism, responsive dashboard layout

---

## ⚙️ Admin LLM Configuration (`backend/.env`)

Configure your preferred LLM provider and API keys in `backend/.env`:

```env
# Default provider (gemini, groq, openrouter, openai_compatible)
LLM_PROVIDER=gemini

# Optional model override (leave blank to use provider defaults)
LLM_MODEL=

# Admin API Keys
GEMINI_API_KEY=your_gemini_api_key
GROQ_API_KEY=your_groq_api_key
OPENROUTER_API_KEY=your_openrouter_api_key
OPENAI_API_KEY=your_openai_api_key
```

When users visit the app, the engine selector will show which providers are configured and allow them to switch between them. Users never have to supply or manage API keys.

---

## ⚡ Quick Start

### 1. Start the Backend API (FastAPI)

```bash
cd backend
# Activate virtual environment
.\venv\Scripts\activate   # Windows
# source venv/bin/activate # Linux/macOS

# Start uvicorn server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

The API will be available at `http://localhost:8000` (API documentation at `http://localhost:8000/docs`).

### 2. Start the Frontend (Vite)

```bash
cd frontend
npm install --legacy-peer-deps
npm run dev -- --host --port 5173
```

Open your browser at `http://localhost:5173`.
