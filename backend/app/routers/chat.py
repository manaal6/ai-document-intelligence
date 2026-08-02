"""AI Chat router — RAG-based question answering."""

import json

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Document
from ..schemas import ChatRequest, ChatResponse
from ..services.embedding_service import query_similar_chunks
from ..services.llm_service import CHAT_SYSTEM_PROMPT, build_chat_prompt, query_groq

router = APIRouter(prefix="/api", tags=["chat"])


@router.post("/chat", response_model=ChatResponse)
async def chat_with_document(request: ChatRequest, db: Session = Depends(get_db)):
    """Ask a question about a document using RAG."""
    # Get document
    doc = db.query(Document).filter(Document.id == request.document_id).first()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found.")

    if doc.status != "ready":
        raise HTTPException(
            status_code=400,
            detail=f"Document is not ready for chat. Status: {doc.status}",
        )

    # Retrieve relevant chunks
    context_chunks = query_similar_chunks(request.document_id, request.message)

    if not context_chunks:
        return ChatResponse(
            answer="I couldn't find relevant information in the document for your question.",
            sources=[],
        )

    # Build RAG prompt
    prompt = build_chat_prompt(request.message, context_chunks)

    # Add conversation history
    if request.conversation_history:
        history_text = "\n".join(
            f"{'User' if msg.get('role') == 'user' else 'Assistant'}: {msg.get('content', '')}"
            for msg in request.conversation_history[-6:]  # Last 6 messages
        )
        prompt = f"Previous conversation:\n{history_text}\n\n{prompt}"

    # Query LLM
    answer = query_groq(prompt, CHAT_SYSTEM_PROMPT)

    # Build sources
    sources = [chunk["text"][:200] for chunk in context_chunks]

    return ChatResponse(answer=answer, sources=sources)
