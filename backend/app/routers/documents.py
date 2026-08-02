"""Document management router — upload, list, get, delete."""

import json
import os
import shutil
from pathlib import Path

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile
from sqlalchemy.orm import Session

from ..config import settings
from ..database import get_db
from ..models import Document
from ..schemas import DocumentListResponse, DocumentResponse
from ..services.document_processor import process_document
from ..services.embedding_service import add_document_chunks, delete_document_chunks
from ..utils.helpers import generate_filename

router = APIRouter(prefix="/api/documents", tags=["documents"])

ALLOWED_EXTENSIONS = settings.ALLOWED_EXTENSIONS
MAX_SIZE_BYTES = settings.MAX_FILE_SIZE_MB * 1024 * 1024


@router.post("/upload", response_model=DocumentResponse)
async def upload_document(
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
):
    """Upload and process a document (PDF, TXT, or DOCX)."""
    # Validate file extension
    if not file.filename:
        raise HTTPException(status_code=400, detail="No filename provided.")

    ext = file.filename.rsplit(".", 1)[-1].lower() if "." in file.filename else ""
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type '{ext}' not supported. Allowed: {', '.join(ALLOWED_EXTENSIONS)}",
        )

    # Read file content and check size
    content = await file.read()
    if len(content) > MAX_SIZE_BYTES:
        raise HTTPException(
            status_code=400,
            detail=f"File too large. Maximum size: {settings.MAX_FILE_SIZE_MB}MB.",
        )

    # Save file
    safe_name = generate_filename(file.filename, prefix="doc")
    file_path = settings.UPLOAD_DIR / safe_name
    with open(file_path, "wb") as f:
        f.write(content)

    # Create database record
    doc = Document(
        filename=safe_name,
        original_filename=file.filename,
        file_path=str(file_path),
        file_size=len(content),
        file_type=ext,
        status="processing",
    )
    db.add(doc)
    db.commit()
    db.refresh(doc)

    # Process document (extract text, chunk, embed)
    try:
        cleaned_text, chunks = process_document(str(file_path), ext)
        doc.extracted_text = cleaned_text
        doc.status = "processing"

        # Add chunks to vector store
        add_document_chunks(doc.id, chunks)

        doc.status = "ready"
    except Exception as e:
        doc.status = "error"
        doc.error_message = str(e)

    db.commit()
    db.refresh(doc)
    return doc


@router.get("", response_model=DocumentListResponse)
async def list_documents(
    search: str = "",
    db: Session = Depends(get_db),
):
    """List all documents with optional search."""
    query = db.query(Document)
    if search:
        query = query.filter(Document.original_filename.ilike(f"%{search}%"))
    query = query.order_by(Document.created_at.desc())
    total = query.count()
    documents = query.all()
    return DocumentListResponse(documents=documents, total=total)


@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: int, db: Session = Depends(get_db)):
    """Get a specific document by ID."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")
    return doc


@router.delete("/{document_id}")
async def delete_document(document_id: int, db: Session = Depends(get_db)):
    """Delete a document and its associated data."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    # Delete from vector store
    try:
        delete_document_chunks(document_id)
    except Exception:
        pass  # ChromaDB might not have the collection yet

    # Delete file from disk
    if os.path.exists(doc.file_path):
        os.remove(doc.file_path)

    # Delete from database
    db.delete(doc)
    db.commit()
    return {"message": "Document deleted successfully.", "id": document_id}
