"""Pydantic schemas for request/response validation."""

from datetime import datetime
from typing import Optional

from pydantic import BaseModel


# ── Document Schemas ──────────────────────────────────────────────

class DocumentResponse(BaseModel):
    """Schema for document list/detail responses."""
    id: int
    filename: str
    original_filename: str
    file_size: int
    file_type: str
    status: str
    summary: Optional[str] = None
    key_points: Optional[str] = None
    action_items: Optional[str] = None
    extracted_info: Optional[str] = None
    error_message: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """Schema for paginated document list."""
    documents: list[DocumentResponse]
    total: int


# ── Chat Schemas ──────────────────────────────────────────────────

class ChatRequest(BaseModel):
    """Schema for chat request."""
    document_id: int
    message: str
    conversation_history: list[dict] = []


class ChatResponse(BaseModel):
    """Schema for chat response."""
    answer: str
    sources: list[str] = []


# ── Summary Schemas ──────────────────────────────────────────────

class SummaryResponse(BaseModel):
    """Schema for summary response."""
    executive_summary: str
    key_points: list[str]
    action_items: list[str]
    important_findings: list[str]
    conclusions: str


# ── Extraction Schemas ──────────────────────────────────────────

class ExtractionResponse(BaseModel):
    """Schema for information extraction response."""
    names: list[str]
    dates: list[str]
    organizations: list[str]
    numbers: list[str]
    tasks: list[str]
    deadlines: list[str]


# ── Stats Schemas ──────────────────────────────────────────────

class StatsResponse(BaseModel):
    """Schema for dashboard statistics."""
    total_documents: int
    total_queries: int
    summaries_generated: int
    total_size_bytes: int
    recent_documents: list[DocumentResponse]


# ── Export Schemas ──────────────────────────────────────────────

class ExportJSONResponse(BaseModel):
    """Schema for JSON export."""
    document_id: int
    filename: str
    extracted_info: dict
    summary: str
