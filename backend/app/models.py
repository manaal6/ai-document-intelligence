"""SQLAlchemy database models."""

from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from .database import Base


class Document(Base):
    """Document model for storing uploaded file metadata and processing results."""

    __tablename__ = "documents"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    filename = Column(String(255), nullable=False)
    original_filename = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(Integer, nullable=False)  # bytes
    file_type = Column(String(10), nullable=False)  # pdf, txt, docx
    status = Column(String(20), default="processing")  # processing, ready, error
    extracted_text = Column(Text, nullable=True)
    summary = Column(Text, nullable=True)
    key_points = Column(Text, nullable=True)  # JSON string
    action_items = Column(Text, nullable=True)  # JSON string
    extracted_info = Column(Text, nullable=True)  # JSON string
    error_message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
