# Architecture Documentation

## System Overview

The AI Document Intelligence Assistant follows a three-tier architecture:

```
┌────────────────────────────────────────────────────┐
│                  CLIENT TIER                        │
│                                                    │
│   React SPA (Vite + Tailwind CSS)                  │
│   - Landing Page (Marketing)                       │
│   - Dashboard (Stats + Document List)              │
│   - Upload Interface (Drag & Drop)                 │
│   - Document Workspace (Chat + Summary + Extract)  │
│   - Settings Page                                  │
│                                                    │
└────────────────────┬───────────────────────────────┘
                     │ HTTP REST (JSON)
                     │ Port 5173 → 8000 proxy
┌────────────────────┴───────────────────────────────┐
│                  APPLICATION TIER                   │
│                                                    │
│   FastAPI (Python 3.11+)                           │
│   - Document Router (CRUD + Upload)                │
│   - Chat Router (RAG Q&A)                          │
│   - Summary Router (AI Summary Generation)         │
│   - Extraction Router (Structured Info)            │
│   - Export Router (PDF/JSON Download)              │
│                                                    │
│   Services:                                        │
│   - DocumentProcessor (Text Extraction + Chunking) │
│   - EmbeddingService (ChromaDB + SentenceTrans.)   │
│   - LLMService (Ollama Integration)                │
│   - ExtractionService (LLM + Regex Fallback)       │
│                                                    │
└────────┬────────────┬───────────────┬─────────────┘
         │            │               │
┌────────┴──┐  ┌──────┴──────┐  ┌────┴──────────┐
│ DATA TIER │  │ VECTOR TIER │  │  AI TIER      │
│           │  │             │  │               │
│ SQLite    │  │ ChromaDB    │  │ Ollama        │
│ (Meta +   │  │ (Embeddings │  │ (Llama 3.1 / │
│  Status)  │  │  + Search)  │  │  Qwen 2.5)   │
│           │  │             │  │               │
│SQLAlchemy │  │ Cosine      │  │ Local LLM     │
│ ORM       │  │ Similarity  │  │ Inference     │
└───────────┘  └─────────────┘  └───────────────┘
```

## Data Flow

### Document Upload Flow
```
User → Upload File (PDF/TXT/DOCX)
  → Validate (type, size)
  → Save to disk (backend/uploads/)
  → Create DB record (SQLite)
  → Extract text (PyMuPDF / python-docx)
  → Clean text (whitespace, special chars)
  → Chunk text (500 chars, 50 overlap)
  → Generate embeddings (all-MiniLM-L6-v2)
  → Store in ChromaDB with doc_id metadata
  → Update DB status: "ready"
```

### RAG Chat Flow
```
User → Ask Question
  → Embed query (same model as document)
  → Search ChromaDB for top-K similar chunks (filtered by doc_id)
  → Build RAG prompt: system + context chunks + question
  → Send to Ollama LLM
  → Return answer + source chunks to user
```

### Summary Generation Flow
```
User → Request Summary
  → Get extracted text from DB
  → Build summary prompt (truncated to 8K chars)
  → Send to Ollama with structured JSON prompt
  → Parse JSON response
  → Save to DB (summary, key_points, action_items)
  → Return to frontend
```

## Key Design Decisions

1. **ChromaDB over FAISS** — ChromaDB is persistent by default, has better Python API, and handles metadata filtering natively.

2. **pypdf for PDF extraction** — Pure Python, no C compiler needed, works on Python 3.13+ out of the box.

3. **RAG over fine-tuning** — RAG provides source-backed answers without training, works with any document, and avoids hallucination better than fine-tuning for this use case.

4. **Local LLM via Ollama** — Zero cost, complete privacy, no API keys needed, works offline.

5. **Hybrid extraction** — LLM-based extraction with regex fallback ensures the feature works even if the LLM returns malformed JSON.
