# InventaCore AI Intern Build Challenge 2026 — Submission Answers

---

## 1. Project Title

**AI Document Intelligence Assistant**

---

## 2. Project Description (Google Form)

An AI-powered document analysis platform that allows users and organizations to upload documents and interact with them intelligently. Using Retrieval-Augmented Generation (RAG) with local LLMs, the system enables users to ask questions about their documents, generate comprehensive summaries, extract structured information, and export results — all running 100% locally with no paid APIs or external services required.

---

## 3. Problem Statement

Businesses, students, and researchers spend significant time reading, understanding, summarizing, and extracting information from large documents. Manual document analysis is time-consuming, error-prone, inconsistent, and doesn't scale. There is a need for an intelligent, free, and private tool that can automate document understanding using modern AI techniques.

---

## 4. Proposed Solution

An AI Document Intelligence Assistant that combines:
- **RAG (Retrieval-Augmented Generation)** for accurate, source-backed Q&A
- **Local LLMs via Ollama** for free, private inference
- **Vector embeddings** for fast semantic search across document chunks
- **Multi-format support** (PDF, TXT, DOCX) with automatic text extraction
- **Structured information extraction** using LLM with regex fallback
- **Modern web UI** built with React and Tailwind CSS

---

## 5. Target Users

- Students analyzing research papers and textbooks
- Researchers reviewing literature and reports
- Small businesses processing internal documents
- Professionals handling contracts, reports, and proposals
- Teams needing to collaborate on document analysis

---

## 6. Main Features

1. **Document Upload** — Drag & drop interface for PDF, TXT, and DOCX files with validation and progress tracking
2. **AI Chat** — RAG-powered Q&A with conversation history, source references, and hallucination prevention
3. **Auto Summary** — One-click generation of executive summary, key points, action items, findings, and conclusions
4. **Information Extraction** — Automatic extraction of names, dates, organizations, numbers, tasks, and deadlines
5. **Export** — Download summaries as PDF or extracted data as JSON
6. **Dashboard** — Overview of documents, stats, and search functionality
7. **Settings** — Configure model, chunking, and RAG parameters
8. **Responsive Design** — Works on desktop and mobile devices

---

## 7. Workflow

1. User uploads a document (PDF/TXT/DOCX)
2. Backend extracts text using PyMuPDF or python-docx
3. Text is cleaned and split into chunks (500 chars, 50 overlap)
4. Chunks are embedded using sentence-transformers/all-MiniLM-L6-v2
5. Embeddings are stored in ChromaDB with document metadata
6. User can now:
   - **Chat**: Ask questions → query is embedded → top-K chunks retrieved → context sent to LLM → answer with sources
   - **Summarize**: Document text sent to LLM with structured prompt → JSON summary returned
   - **Extract**: Document text sent to LLM → structured entities returned
   - **Export**: Summary or extraction data downloaded as PDF/JSON

---

## 8. Technologies and AI Tools

| Category | Technology |
|----------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, React Router, Axios, Lucide Icons |
| Backend | Python FastAPI, SQLAlchemy, SQLite |
| AI/ML | Ollama (Llama 3.1 / Qwen 2.5), sentence-transformers, ChromaDB |
| Document Processing | PyMuPDF, python-docx, LangChain text splitters |
| Export | ReportLab (PDF generation) |
| Deployment | Docker Compose |

**AI Tools Specifically:**
- Ollama — Local LLM inference engine
- Llama 3.1 — Open-source large language model
- sentence-transformers/all-MiniLM-L6-v2 — Text embedding model
- ChromaDB — Vector database for similarity search
- RAG architecture — Retrieval-Augmented Generation pattern

---

## 9. Current Project Status

**Complete and functional.** All 8 core features are implemented and ready for testing:
- ✅ Document upload with validation
- ✅ Text extraction pipeline (PDF, TXT, DOCX)
- ✅ RAG-based AI chat with sources
- ✅ Summary generation with all sections
- ✅ Information extraction (6 categories)
- ✅ Dashboard with stats and search
- ✅ PDF and JSON export
- ✅ Responsive UI across all pages
- ✅ Docker deployment support
- ✅ Full documentation and demo script

---

## 10. Known Limitations

1. **Requires Ollama installed locally** — Users must install Ollama and pull a model before using AI features
2. **No user authentication** — Single-user design; multi-user support planned for future
3. **LLM response time** — First query may take 5-15 seconds depending on hardware
4. **Document size limit** — 20MB maximum per upload
5. **No OCR support** — Cannot extract text from scanned PDFs or images
6. **Embedding model limited to English** — all-MiniLM-L6-v2 is English-only
7. **Single-process backend** — SQLite limits concurrent write operations

---

## 11. Testing Instructions

### Prerequisites
1. Install Python 3.11+, Node.js 18+, and Ollama
2. Pull an Ollama model: `ollama pull llama3.1`

### Quick Start
```bash
# Backend
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### Test Flow
1. Open http://localhost:5173
2. Navigate to Upload page
3. Upload `sample_data/sample_report.txt`
4. Go to Document Workspace
5. Test AI Chat: Ask "What was the total revenue?"
6. Test Summary: Click "Generate Summary"
7. Test Extraction: Click "Extract Information"
8. Test Export: Download PDF and JSON
9. Check Dashboard: Verify stats are updated
