"""Document processing service: text extraction, cleaning, and chunking."""

import re

from pypdf import PdfReader
from docx import Document as DocxDocument

from ..config import settings


def extract_text_from_pdf(file_path: str) -> str:
    """Extract text from a PDF file using pypdf."""
    reader = PdfReader(file_path)
    text_parts = []
    for page in reader.pages:
        text = page.extract_text()
        if text:
            text_parts.append(text)
    return "\n".join(text_parts)


def extract_text_from_docx(file_path: str) -> str:
    """Extract text from a DOCX file."""
    doc = DocxDocument(file_path)
    text_parts = []
    for paragraph in doc.paragraphs:
        if paragraph.text.strip():
            text_parts.append(paragraph.text)
    return "\n".join(text_parts)


def extract_text_from_txt(file_path: str) -> str:
    """Extract text from a plain text file."""
    with open(file_path, "r", encoding="utf-8", errors="replace") as f:
        return f.read()


def extract_text(file_path: str, file_type: str) -> str:
    """Extract text based on file type."""
    extractors = {
        "pdf": extract_text_from_pdf,
        "docx": extract_text_from_docx,
        "txt": extract_text_from_txt,
    }
    extractor = extractors.get(file_type)
    if not extractor:
        raise ValueError(f"Unsupported file type: {file_type}")
    return extractor(file_path)


def clean_text(text: str) -> str:
    """Clean and normalize extracted text."""
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"[^\x20-\x7E\n\t]", "", text)
    return text.strip()


def chunk_text(text: str) -> list[str]:
    """Split text into overlapping chunks (no external dependencies)."""
    chunk_size = settings.CHUNK_SIZE
    chunk_overlap = settings.CHUNK_OVERLAP

    # Split on paragraph boundaries first
    paragraphs = re.split(r"\n\n+", text)
    chunks: list[str] = []
    current = ""

    for para in paragraphs:
        if len(current) + len(para) + 2 <= chunk_size:
            current = (current + "\n\n" + para).strip() if current else para
        else:
            if current:
                chunks.append(current)
            # If single paragraph exceeds chunk_size, split by sentence
            if len(para) > chunk_size:
                sentences = re.split(r"(?<=[.!?])\s+", para)
                buf = ""
                for sent in sentences:
                    if len(buf) + len(sent) + 1 <= chunk_size:
                        buf = (buf + " " + sent).strip() if buf else sent
                    else:
                        if buf:
                            chunks.append(buf)
                        buf = sent
                if buf:
                    current = buf
                else:
                    current = ""
            else:
                current = para

    if current:
        chunks.append(current)

    # Apply overlap: prepend tail of previous chunk
    if chunk_overlap > 0 and len(chunks) > 1:
        overlapped: list[str] = [chunks[0]]
        for i in range(1, len(chunks)):
            tail = chunks[i - 1][-chunk_overlap:]
            overlapped.append((tail + " " + chunks[i]).strip())
        return overlapped

    return chunks or [text[:chunk_size]]


def process_document(file_path: str, file_type: str) -> tuple[str, list[str]]:
    """Full pipeline: extract → clean → chunk. Returns (cleaned_text, chunks)."""
    raw_text = extract_text(file_path, file_type)
    cleaned_text = clean_text(raw_text)
    chunks = chunk_text(cleaned_text)
    return cleaned_text, chunks
