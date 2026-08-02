# 🧠 AI Document Intelligence Assistant

<div align="center">

![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![React](https://img.shields.io/badge/react-18-61DAFB)
![FastAPI](https://img.shields.io/badge/fastapi-0.115-009688)

**An AI-powered document analysis platform that allows users to upload documents and interact with them intelligently using Retrieval-Augmented Generation (RAG).**

*Built for the InventaCore AI Intern Build Challenge 2026*

</div>

---

## 📋 Table of Contents

- [Problem Statement](#-problem-statement)
- [Solution](#-solution)
- [Features](#-features)
- [Architecture](#-architecture)
- [Technology Stack](#-technology-stack)
- [Folder Structure](#-folder-structure)
- [Installation](#-installation)
- [Environment Setup](#-environment-setup)
- [Running Instructions](#-running-instructions)
- [Testing Instructions](#-testing-instructions)
- [Sample Data](#-sample-data)
- [AI Tools Used](#-ai-tools-used)
- [Challenges & Solutions](#-challenges--solutions)
- [Future Improvements](#-future-improvements)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Problem Statement

Businesses and students spend significant time reading, understanding, summarizing, and extracting information from large documents. Manual document analysis is:

- **Time-consuming** — Reading through 50+ page reports takes hours
- **Error-prone** — Easy to miss critical details buried in long text
- **Inconsistent** — Different people extract different insights
- **Not scalable** — Impossible to analyze hundreds of documents manually

## 💡 Solution

An **AI Document Intelligence Assistant** that uses **Retrieval-Augmented Generation (RAG)** and **local LLMs** to:

1. **Ingest** documents (PDF, TXT, DOCX) automatically
2. **Index** content using vector embeddings for fast retrieval
3. **Answer questions** about documents with source-backed responses
4. **Generate summaries** with executive overviews, key points, and action items
5. **Extract structured information** — names, dates, organizations, numbers, tasks, deadlines
6. **Export results** as PDF summaries or JSON data

All processing happens **locally** — no data leaves your machine, no API keys required.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 📤 **Smart Upload** | Drag & drop interface with file validation and progress tracking |
| 🤖 **AI Chat** | RAG-powered Q&A with source references and conversation history |
| 📊 **Auto Summary** | Executive summary, key points, action items, findings, conclusions |
| 🔍 **Info Extraction** | Names, dates, organizations, numbers, tasks, deadlines |
| 📥 **Export** | Download summaries as PDF or extracted data as JSON |
| 📱 **Responsive UI** | Modern SaaS-style interface, works on all devices |
| 🔒 **Private** | 100% local processing — no data sent to external services |
| 💰 **Free** | No API keys, no paid services, fully open-source stack |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                   │
│                                                             │
│  Landing Page │ Dashboard │ Upload │ Document Workspace     │
│  Tailwind CSS │ React Router │ Axios │ Lucide Icons         │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API (JSON)
┌──────────────────────────┴──────────────────────────────────┐
│                     BACKEND (FastAPI)                        │
│                                                             │
│  /api/documents  /api/chat  /api/summary  /api/extract      │
│  /api/export/{id}/pdf  /api/export/{id}/json  /api/stats     │
└────────┬──────────────────┬──────────────────┬──────────────┘
         │                  │                  │
    ┌────┴────┐      ┌──────┴──────┐     ┌────┴────┐
    │ SQLite  │      │  ChromaDB   │     │  Groq   │
    │ (Meta)  │      │ (Vectors)   │     │ (LLM)  │
    │SQLAlchemy│     │ +Embeddings │     │Llama 3.1│
    └─────────┘      └─────────────┘     └─────────┘
```

### RAG Pipeline Flow

```
Document Upload
     ↓
Text Extraction (PyMuPDF / python-docx)
     ↓
Text Cleaning & Normalization
     ↓
Chunking (500 chars, 50 overlap)
     ↓
Embedding Generation (all-MiniLM-L6-v2)
     ↓
Vector Storage (ChromaDB)
     ↓
User Query → Embedding → Similarity Search → Top-K Chunks
     ↓
Context Injection → LLM (Groq) → Source-Backed Answer
```

---

## 🛠 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 18 + Vite | Modern SPA with fast HMR |
| **Styling** | Tailwind CSS | Utility-first responsive design |
| **Routing** | React Router v6 | Client-side navigation |
| **HTTP** | Axios | API communication |
| **Icons** | Lucide React | Consistent, beautiful icons |
| **Backend** | Python FastAPI | Async REST API framework |
| **PDF Extraction** | pypdf | Pure Python PDF text extraction (no C compiler needed) |
| **DOCX Extraction** | python-docx | Microsoft Word document parsing |
| **Text Splitting** | LangChain | Smart document chunking |
| **Embeddings** | sentence-transformers | `all-MiniLM-L6-v2` (free, fast) |
| **Vector Store** | ChromaDB | Persistent vector database |
| **LLM** | Groq | Free cloud inference (Llama 3.1 8B Instant) |
| **Database** | SQLite + SQLAlchemy | Document metadata storage |
| **PDF Export** | ReportLab | Server-side PDF generation |
| **Containerization** | Docker Compose | One-command deployment |

---

## 📁 Folder Structure

```
AI_Document_Intelligence_Assistant/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI app entry point
│   │   ├── config.py                # Application settings
│   │   ├── database.py              # SQLAlchemy database setup
│   │   ├── models.py                # Database models
│   │   ├── schemas.py               # Pydantic request/response schemas
│   │   ├── routers/
│   │   │   ├── documents.py         # Document CRUD endpoints
│   │   │   ├── chat.py              # AI chat endpoint
│   │   │   ├── summary.py           # Summary generation
│   │   │   ├── extraction.py        # Information extraction
│   │   │   └── export.py            # PDF/JSON export
│   │   ├── services/
│   │   │   ├── document_processor.py # Text extraction & chunking
│   │   │   ├── embedding_service.py  # ChromaDB + embeddings
│   │   │   ├── llm_service.py        # Groq LLM integration
│   │   │   └── extraction_service.py # Info extraction (LLM + regex)
│   │   └── utils/
│   │       └── helpers.py           # Utility functions
│   ├── uploads/                     # Uploaded document files
│   ├── requirements.txt             # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── main.jsx                 # React entry point
│   │   ├── App.jsx                  # Router setup
│   │   ├── index.css                # Tailwind directives
│   │   ├── components/
│   │   │   ├── Layout.jsx           # Sidebar + topbar layout
│   │   │   ├── FileUpload.jsx       # Drag & drop upload zone
│   │   │   ├── DocumentCard.jsx     # Document list item
│   │   │   ├── ChatInterface.jsx    # AI chat with messages
│   │   │   ├── SummaryView.jsx      # Summary display
│   │   │   ├── ExtractionView.jsx   # Extracted info cards
│   │   │   └── ExportButton.jsx     # PDF/JSON export
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx      # Marketing landing page
│   │   │   ├── Dashboard.jsx        # Stats + document list
│   │   │   ├── UploadPage.jsx       # Upload interface
│   │   │   ├── DocumentWorkspace.jsx # Document viewer + AI
│   │   │   └── SettingsPage.jsx     # Configuration page
│   │   ├── services/
│   │   │   └── api.js              # Axios API client
│   │   └── hooks/
│   │       └── useDocuments.js      # Document state hook
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── Dockerfile
├── docker-compose.yml               # One-command deployment
├── .env.example                     # Environment template
├── .gitignore
├── README.md
├── docs/
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── DEMO_SCRIPT.md
├── screenshots/                     # App screenshots
├── demo/
│   └── submission_answers.md
└── sample_data/
    └── sample_report.txt            # Sample document for testing
```

---

## 🚀 Installation

### Prerequisites

- **Python 3.11+** — [Download](https://python.org)
- **Node.js 18+** — [Download](https://nodejs.org)
- **Groq API Key** — [Get free key](https://console.groq.com)
- **Git** — [Download](https://git-scm.com)

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/AI_Document_Intelligence_Assistant.git
cd AI_Document_Intelligence_Assistant
```

### 2. Get Groq API Key

1. Visit [console.groq.com](https://console.groq.com)
2. Sign up for a free account
3. Create an API key
4. Copy the key to your `.env` file (see Environment Setup below)

### 3. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 4. Setup Frontend

```bash
cd ../frontend

# Install dependencies
npm install
```

---

## ⚙️ Environment Setup

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your preferences (defaults work out of the box)
```

Key environment variables:

| Variable | Default | Description |
|----------|---------|-------------|
| `GROQ_API_KEY` | — | Your Groq API key (required) |
| `GROQ_MODEL` | `llama-3.1-8b-instant` | LLM model to use |
| `CHUNK_SIZE` | `500` | Text chunk size (chars) |
| `CHUNK_OVERLAP` | `50` | Overlap between chunks |
| `TOP_K_RESULTS` | `5` | Chunks retrieved per query |

---

## ▶️ Running Instructions

### Option A: Manual Setup (Recommended for Development)

**Terminal 1 — Start Backend:**
```bash
cd backend
source venv/bin/activate  # Windows: venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 — Start Frontend:**
```bash
cd frontend
npm run dev
```

Open **http://localhost:5173** in your browser.

### Option B: Docker Compose

```bash
# Start everything
docker-compose up --build
```

Open **http://localhost:5173**.

### API Documentation

Once the backend is running, visit:
- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## 🧪 Testing Instructions

### Manual Testing Flow

1. **Upload a Document**
   - Navigate to `/upload`
   - Drag & drop `sample_data/sample_report.txt` or click to browse
   - Verify the upload completes and status shows "Ready"

2. **Chat with Document**
   - Navigate to the document workspace
   - Click the "AI Chat" tab
   - Ask: *"What was the total revenue in Q2?"*
   - Verify the answer references the document content

3. **Generate Summary**
   - Click the "Summary" tab
   - Click "Generate Summary"
   - Verify all sections are populated: executive summary, key points, action items

4. **Extract Information**
   - Click the "Extraction" tab
   - Click "Extract Information"
   - Verify names, dates, organizations, numbers, tasks, and deadlines are extracted

5. **Export**
   - Click "Export PDF" or "Export JSON" buttons
   - Verify the files download correctly

6. **Dashboard**
   - Navigate to `/dashboard`
   - Verify the document appears in the list
   - Verify stats cards show correct counts

### Sample Questions to Test

| Question | Expected Behavior |
|----------|-------------------|
| "What is the total revenue?" | Answer: $4.2 million with source reference |
| "Who is the VP of Operations?" | Answer: Sarah Mitchell |
| "What are the action items?" | Lists items from the document |
| "What is the meaning of life?" | Answer: "I don't find that information in the document" |

---

## 📄 Sample Data

The `sample_data/` folder contains `sample_report.txt` — a mock Q2 2026 business report for testing all features:

- **Revenue data** — $4.2M total
- **People** — Sarah Mitchell, James Rodriguez, Lisa Chang, David Kim
- **Organizations** — TechNova Solutions Inc., GlobalTech Corp, Meridian Healthcare
- **Dates** — Q2 2026, deadlines in August-October 2026
- **Action items** — Mobile app launch, hiring, integrations, fundraising

Upload this file to test all features end-to-end.

---

## 🤖 AI Tools Used

| Tool | Purpose | Why |
|------|---------|-----|
| **Groq** | Cloud LLM inference | Free tier, fast, no local setup needed |
| **Llama 3.1** | Language model | High-quality, open-source, capable |
| **sentence-transformers** | Text embeddings | Free, fast, accurate similarity search |
| **all-MiniLM-L6-v2** | Embedding model | Small, fast, excellent performance |
| **ChromaDB** | Vector database | Easy to use, persistent, free |
| **LangChain** | Text splitting | Smart chunking with overlap |
| **RAG (Retrieval-Augmented Generation)** | Architecture pattern | Reduces hallucination, provides sources |

---

## 🚧 Challenges & Solutions

| Challenge | Solution |
|-----------|----------|
| **LLM hallucination** | RAG with strict system prompts that instruct the model to cite sources and admit when information isn't available |
| **Large document processing** | Chunking strategy (500 chars, 50 overlap) with RecursiveCharacterTextSplitter for semantic boundaries |
| **PDF text extraction quality** | Switched from PyPDF2 to PyMuPDF for significantly better extraction accuracy |
| **Vector search performance** | ChromaDB with cosine similarity, persistent storage, and efficient HNSW indexing |
| **Free deployment** | Groq free tier for LLM inference — no paid APIs needed |
| **Cross-platform compatibility** | Docker Compose for consistent environments, manual setup instructions for development |

---

## 🔮 Future Improvements

- [ ] **User authentication** — Multi-user support with login system
- [ ] **Batch upload** — Process multiple documents simultaneously
- [ ] **Document comparison** — Compare two documents side by side
- [ ] **Image/PDF OCR** — Extract text from scanned documents and images
- [ ] **Real-time streaming** — Stream LLM responses token-by-token
- [ ] **Web search integration** — Ground answers in real web data
- [ ] **Custom model fine-tuning** — Domain-specific document analysis
- [ ] **Collaborative annotations** — Team comments on documents
- [ ] **API access** — RESTful API for programmatic access
- [ ] **Mobile app** — Native iOS/Android experience

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for InventaCore AI Intern Build Challenge 2026**

*Powered by open-source AI — Groq, Llama 3.1, and the Python/React ecosystem*

</div>
