"""Export router — PDF summary and JSON extraction download."""

import io
import json

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Document

router = APIRouter(prefix="/api/export", tags=["export"])


@router.get("/{document_id}/pdf")
async def export_summary_pdf(document_id: int, db: Session = Depends(get_db)):
    """Export the document summary as a PDF file."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if not doc.summary:
        raise HTTPException(status_code=400, detail="No summary available. Generate one first.")

    # Create PDF in memory
    buffer = io.BytesIO()
    pdf_doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=1 * inch)
    styles = getSampleStyleSheet()
    elements = []

    # Title
    title_style = ParagraphStyle(
        "CustomTitle", parent=styles["Title"], fontSize=18, spaceAfter=20
    )
    elements.append(Paragraph(f"Document Summary: {doc.original_filename}", title_style))
    elements.append(Spacer(1, 12))

    # Executive Summary
    heading_style = ParagraphStyle(
        "CustomHeading", parent=styles["Heading2"], fontSize=14, spaceAfter=8
    )
    elements.append(Paragraph("Executive Summary", heading_style))
    elements.append(Paragraph(doc.summary, styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Key Points
    if doc.key_points:
        elements.append(Paragraph("Key Points", heading_style))
        try:
            points = json.loads(doc.key_points)
            for i, point in enumerate(points, 1):
                elements.append(Paragraph(f"{i}. {point}", styles["Normal"]))
        except json.JSONDecodeError:
            elements.append(Paragraph(doc.key_points, styles["Normal"]))
        elements.append(Spacer(1, 12))

    # Action Items
    if doc.action_items:
        elements.append(Paragraph("Action Items", heading_style))
        try:
            items = json.loads(doc.action_items)
            for i, item in enumerate(items, 1):
                elements.append(Paragraph(f"{i}. {item}", styles["Normal"]))
        except json.JSONDecodeError:
            elements.append(Paragraph(doc.action_items, styles["Normal"]))

    # Build PDF
    pdf_doc.build(elements)
    buffer.seek(0)

    filename = f"summary_{doc.original_filename.rsplit('.', 1)[0]}.pdf"
    return StreamingResponse(
        buffer,
        media_type="application/pdf",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


@router.get("/{document_id}/json")
async def export_extraction_json(document_id: int, db: Session = Depends(get_db)):
    """Export the extracted information as a JSON file."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if not doc.extracted_info:
        raise HTTPException(status_code=400, detail="No extraction data available. Run extraction first.")

    extracted = json.loads(doc.extracted_info) if doc.extracted_info else {}

    export_data = {
        "document_id": doc.id,
        "filename": doc.original_filename,
        "extracted_info": extracted,
        "summary": doc.summary or "",
    }

    content = json.dumps(export_data, indent=2, ensure_ascii=False)
    buffer = io.BytesIO(content.encode("utf-8"))
    buffer.seek(0)

    filename = f"extraction_{doc.original_filename.rsplit('.', 1)[0]}.json"
    return StreamingResponse(
        buffer,
        media_type="application/json",
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )
