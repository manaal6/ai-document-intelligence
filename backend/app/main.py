"""AI Document Intelligence Assistant — FastAPI Application."""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .config import settings
from .database import init_db
from .routers import chat, documents, extraction, export, summary

# Initialize database tables
init_db()

# Create FastAPI app
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="AI-powered document analysis platform using RAG and local LLMs.",
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(documents.router)
app.include_router(chat.router)
app.include_router(summary.router)
app.include_router(extraction.router)
app.include_router(export.router)

# Serve uploaded files (for development)
app.mount("/uploads", StaticFiles(directory=str(settings.UPLOAD_DIR)), name="uploads")


@app.get("/")
async def root():
    """Health check endpoint."""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "docs": "/docs",
    }


@app.get("/api/stats")
async def get_stats():
    """Dashboard statistics endpoint."""
    from sqlalchemy.orm import Session

    from .database import SessionLocal
    from .models import Document

    db = SessionLocal()
    try:
        total_documents = db.query(Document).count()
        total_size = sum(doc.file_size for doc in db.query(Document).all())
        summaries_generated = db.query(Document).filter(Document.summary.isnot(None)).count()
        recent = db.query(Document).order_by(Document.created_at.desc()).limit(5).all()

        return {
            "total_documents": total_documents,
            "total_queries": 0,  # Could track in future
            "summaries_generated": summaries_generated,
            "total_size_bytes": total_size,
            "recent_documents": [
                {
                    "id": doc.id,
                    "filename": doc.filename,
                    "original_filename": doc.original_filename,
                    "file_size": doc.file_size,
                    "file_type": doc.file_type,
                    "status": doc.status,
                    "created_at": doc.created_at.isoformat() if doc.created_at else None,
                    "updated_at": doc.updated_at.isoformat() if doc.updated_at else None,
                }
                for doc in recent
            ],
        }
    finally:
        db.close()
