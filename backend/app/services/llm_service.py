"""LLM service for interacting with Groq cloud API."""

import os
from groq import Groq

from ..config import settings


def _get_client() -> Groq:
    """Create and return a Groq client."""
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise ValueError("GROQ_API_KEY environment variable is not set.")
    return Groq(api_key=api_key)


def query_groq(prompt: str, system_prompt: str = "") -> str:
    """Send a prompt to the Groq API and return the response."""
    client = _get_client()
    model = os.getenv("GROQ_MODEL", settings.GROQ_MODEL or "qwen/qwen3.8-27b")

    messages = []
    if system_prompt:
        messages.append({"role": "system", "content": system_prompt})
    messages.append({"role": "user", "content": prompt})

    try:
        response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=settings.TEMPERATURE,
            max_tokens=settings.MAX_TOKENS,
        )
        return response.choices[0].message.content or "No response generated."
    except Exception as e:
        return f"Error communicating with Groq LLM: {str(e)}"


# ── Prompt Templates ──────────────────────────────────────────────

CHAT_SYSTEM_PROMPT = """You are an AI Document Intelligence Assistant. You help users understand
and analyze their documents. Follow these rules:

1. Answer questions ONLY based on the provided document context.
2. If the answer is not in the document, say "I don't find that information in the document."
3. Be concise but thorough.
4. When referencing information, mention which part of the document it comes from.
5. Never make up or hallucinate information that isn't in the context."""


SUMMARY_SYSTEM_PROMPT = """You are an AI Document Intelligence Assistant. Generate a comprehensive
analysis of the provided document text. Return your response as valid JSON with this exact structure:

{
  "executive_summary": "A 2-3 paragraph executive summary of the document...",
  "key_points": ["point 1", "point 2", ...],
  "action_items": ["action 1", "action 2", ...],
  "important_findings": ["finding 1", "finding 2", ...],
  "conclusions": "A paragraph summarizing the conclusions..."
}

Rules:
1. Be thorough and accurate.
2. Only extract information that is actually in the document.
3. Return ONLY the JSON, no markdown code blocks, no extra text.
4. Include at least 3 key points and 2 important findings."""


EXTRACTION_SYSTEM_PROMPT = """You are an AI Document Intelligence Assistant. Extract structured
information from the provided document text. Return your response as valid JSON with this exact structure:

{
  "names": ["Name 1", "Name 2", ...],
  "dates": ["January 1, 2024", "2023-12-31", ...],
  "organizations": ["Company A", "University B", ...],
  "numbers": ["$1,000,000", "42%", "150 units", ...],
  "tasks": ["Task description 1", "Task description 2", ...],
  "deadlines": ["December 31, 2024", "Q3 2024", ...]
}

Rules:
1. Only extract information that actually appears in the document.
2. If a category has no items, use an empty array [].
3. Return ONLY the JSON, no markdown code blocks, no extra text.
4. Be specific — extract actual values, not generic descriptions."""


def build_chat_prompt(query: str, context_chunks: list[dict]) -> str:
    """Build the RAG prompt for chat."""
    context_text = "\n\n---\n\n".join(
        f"[Source chunk {i+1}]: {chunk['text']}"
        for i, chunk in enumerate(context_chunks)
    )

    return f"""Based on the following document excerpts, answer the user's question.
If the answer is not contained in the excerpts, say so clearly.

Document Context:
{context_text}

User Question: {query}

Answer:"""


def build_summary_prompt(text: str) -> str:
    """Build prompt for summary generation."""
    # Truncate if too long for the model
    max_chars = 8000
    truncated = text[:max_chars] if len(text) > max_chars else text
    return f"Analyze and summarize the following document:\n\n{truncated}"


def build_extraction_prompt(text: str) -> str:
    """Build prompt for information extraction."""
    max_chars = 8000
    truncated = text[:max_chars] if len(text) > max_chars else text
    return f"Extract structured information from the following document:\n\n{truncated}"
