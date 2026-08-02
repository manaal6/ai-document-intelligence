"""Information extraction router."""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Document
from ..schemas import ExtractionResponse
from ..services.extraction_service import extract_information

router = APIRouter(prefix="/api", tags=["extraction"])


@router.post("/extract/{document_id}", response_model=ExtractionResponse)
async def extract_document_info(document_id: int, db: Session = Depends(get_db)):
    """Extract structured information from the document."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if not doc.extracted_text:
        raise HTTPException(status_code=400, detail="Document text not extracted yet.")

    # Extract information
    result = await extract_information(doc.extracted_text)

    # Save to database
    doc.extracted_info = json.dumps(result)
    db.commit()

    return ExtractionResponse(
        names=result.get("names", []),
        dates=result.get("dates", []),
        organizations=result.get("organizations", []),
        numbers=result.get("numbers", []),
        tasks=result.get("tasks", []),
        deadlines=result.get("deadlines", []),
    )
