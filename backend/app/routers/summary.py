"""Summary generation router."""

import json
import re

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Document
from ..schemas import SummaryResponse
from ..services.llm_service import SUMMARY_SYSTEM_PROMPT, build_summary_prompt, query_groq

router = APIRouter(prefix="/api", tags=["summary"])


def parse_summary_response(response: str) -> dict:
    """Parse the LLM's JSON response for summary."""
    cleaned = response.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
        cleaned = re.sub(r"\s*```$", "", cleaned)

    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return {
            "executive_summary": response,
            "key_points": [],
            "action_items": [],
            "important_findings": [],
            "conclusions": "",
        }


@router.post("/summary/{document_id}", response_model=SummaryResponse)
async def generate_summary(document_id: int, db: Session = Depends(get_db)):
    """Generate a comprehensive AI summary of the document."""
    doc = db.query(Document).filter(Document.id == document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if not doc.extracted_text:
        raise HTTPException(status_code=400, detail="Document text not extracted yet.")

    # Generate summary via LLM
    prompt = build_summary_prompt(doc.extracted_text)
    response = query_groq(prompt, SUMMARY_SYSTEM_PROMPT)

    # Parse response
    result = parse_summary_response(response)

    # Save to database
    doc.summary = result.get("executive_summary", "")
    doc.key_points = json.dumps(result.get("key_points", []))
    doc.action_items = json.dumps(result.get("action_items", []))
    db.commit()

    return SummaryResponse(
        executive_summary=result.get("executive_summary", ""),
        key_points=result.get("key_points", []),
        action_items=result.get("action_items", []),
        important_findings=result.get("important_findings", []),
        conclusions=result.get("conclusions", ""),
    )
