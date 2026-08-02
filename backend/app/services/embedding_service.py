"""Embedding and vector storage service using ChromaDB + sentence-transformers."""

import chromadb
from sentence_transformers import SentenceTransformer

from ..config import settings

# Global singleton for the embedding model
_embedding_model = None
_chroma_client = None
_collection = None


def get_embedding_model() -> SentenceTransformer:
    """Get or initialize the sentence-transformers model."""
    global _embedding_model
    if _embedding_model is None:
        _embedding_model = SentenceTransformer(settings.EMBEDDING_MODEL)
    return _embedding_model


def get_chroma_collection():
    """Get or initialize the ChromaDB collection."""
    global _chroma_client, _collection
    if _collection is None:
        _chroma_client = chromadb.PersistentClient(
            path=settings.CHROMA_PERSIST_DIR,
        )
        _collection = _chroma_client.get_or_create_collection(
            name=settings.CHROMA_COLLECTION,
            metadata={"hnsw:space": "cosine"},
        )
    return _collection


def add_document_chunks(document_id: int, chunks: list[str]):
    """Add text chunks to the vector store with document ID prefix."""
    collection = get_chroma_collection()
    model = get_embedding_model()

    ids = [f"doc_{document_id}_chunk_{i}" for i in range(len(chunks))]
    embeddings = model.encode(chunks).tolist()

    collection.add(
        ids=ids,
        documents=chunks,
        embeddings=embeddings,
        metadatas=[{"document_id": document_id} for _ in chunks],
    )


def query_similar_chunks(document_id: int, query: str, top_k: int = None) -> list[dict]:
    """Query for similar chunks within a specific document."""
    collection = get_chroma_collection()
    model = get_embedding_model()

    if top_k is None:
        top_k = settings.TOP_K_RESULTS

    query_embedding = model.encode([query]).tolist()

    results = collection.query(
        query_embeddings=query_embedding,
        n_results=top_k,
        where={"document_id": document_id},
    )

    output = []
    if results and results["documents"]:
        for i, doc in enumerate(results["documents"][0]):
            output.append({
                "text": doc,
                "score": results["distances"][0][i] if results["distances"] else 0,
            })
    return output


def delete_document_chunks(document_id: int):
    """Delete all chunks for a specific document."""
    collection = get_chroma_collection()

    # Get all chunk IDs for this document
    results = collection.get(where={"document_id": document_id})
    if results and results["ids"]:
        collection.delete(ids=results["ids"])
