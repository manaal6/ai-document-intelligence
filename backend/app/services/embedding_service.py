"""Embedding and vector storage service using TF-IDF (lightweight, no PyTorch)."""

import json
import math
import re
from collections import defaultdict
from pathlib import Path

import numpy as np

from ..config import settings

# In-memory store: document_id -> list of {"text": str, "vector": list[float]}
_chunk_store: dict[int, list[dict]] = {}
_persist_path = Path(settings.CHROMA_PERSIST_DIR) / "chunks.json"


def _load_store():
    """Load persisted chunks from disk."""
    global _chunk_store
    if _persist_path.exists():
        try:
            raw = json.loads(_persist_path.read_text(encoding="utf-8"))
            _chunk_store = {int(k): v for k, v in raw.items()}
        except Exception:
            _chunk_store = {}


def _save_store():
    """Persist chunks to disk."""
    _persist_path.parent.mkdir(parents=True, exist_ok=True)
    _persist_path.write_text(
        json.dumps({str(k): v for k, v in _chunk_store.items()}, ensure_ascii=False),
        encoding="utf-8",
    )


# Load on module import (fast — just reading JSON)
_load_store()


# ── TF-IDF helpers ──────────────────────────────────────────────────────────

def _tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def _tfidf_vector(tokens: list[str], idf: dict[str, float]) -> dict[str, float]:
    tf: dict[str, int] = defaultdict(int)
    for t in tokens:
        tf[t] += 1
    n = len(tokens) or 1
    return {t: (c / n) * idf.get(t, 1.0) for t, c in tf.items()}


def _cosine(a: dict[str, float], b: dict[str, float]) -> float:
    dot = sum(a.get(k, 0.0) * v for k, v in b.items())
    mag_a = math.sqrt(sum(v * v for v in a.values())) or 1e-9
    mag_b = math.sqrt(sum(v * v for v in b.values())) or 1e-9
    return dot / (mag_a * mag_b)


def _build_idf(corpus: list[list[str]]) -> dict[str, float]:
    n = len(corpus)
    df: dict[str, int] = defaultdict(int)
    for tokens in corpus:
        for t in set(tokens):
            df[t] += 1
    return {t: math.log((n + 1) / (c + 1)) + 1 for t, c in df.items()}


# ── Public API ──────────────────────────────────────────────────────────────

def add_document_chunks(document_id: int, chunks: list[str]):
    """Index text chunks for a document using TF-IDF vectors."""
    tokenized = [_tokenize(c) for c in chunks]
    idf = _build_idf(tokenized)
    vectors = [_tfidf_vector(tok, idf) for tok in tokenized]
    _chunk_store[document_id] = [
        {"text": chunk, "vector": vec} for chunk, vec in zip(chunks, vectors)
    ]
    _save_store()


def query_similar_chunks(document_id: int, query: str, top_k: int = None) -> list[dict]:
    """Return top-k most similar chunks for a document using cosine similarity."""
    if top_k is None:
        top_k = settings.TOP_K_RESULTS

    chunks = _chunk_store.get(document_id, [])
    if not chunks:
        return []

    q_tokens = _tokenize(query)
    # Build IDF from stored corpus + query
    corpus = [[t for t in re.findall(r"[a-z0-9]+", c["text"].lower())] for c in chunks]
    idf = _build_idf(corpus + [q_tokens])
    q_vec = _tfidf_vector(q_tokens, idf)

    scored = []
    for chunk in chunks:
        c_vec = _tfidf_vector(_tokenize(chunk["text"]), idf)
        score = _cosine(q_vec, c_vec)
        scored.append({"text": chunk["text"], "score": score})

    scored.sort(key=lambda x: x["score"], reverse=True)
    return scored[:top_k]


def delete_document_chunks(document_id: int):
    """Remove all chunks for a document."""
    _chunk_store.pop(document_id, None)
    _save_store()
