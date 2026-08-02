"""Application configuration using pydantic-settings."""

import os
from pathlib import Path
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application settings loaded from environment variables."""

    # App
    APP_NAME: str = "AI Document Intelligence Assistant"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True

    # CORS
    CORS_ORIGINS: list[str] = ["*"]

    # Database
    DATABASE_URL: str = "sqlite:///./documents.db"

    # File Upload
    UPLOAD_DIR: Path = Path("uploads")
    MAX_FILE_SIZE_MB: int = 20
    ALLOWED_EXTENSIONS: set[str] = {"pdf", "txt", "docx"}

    # Groq (Free Cloud LLM)
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "llama-3.1-8b-instant"

    # Embeddings
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"

    # ChromaDB
    CHROMA_PERSIST_DIR: str = "./chroma_db"
    CHROMA_COLLECTION: str = "document_chunks"

    # RAG
    CHUNK_SIZE: int = 500
    CHUNK_OVERLAP: int = 50
    TOP_K_RESULTS: int = 5

    # LLM
    MAX_TOKENS: int = 2048
    TEMPERATURE: float = 0.3

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"


settings = Settings()

# Ensure upload directory exists
settings.UPLOAD_DIR.mkdir(parents=True, exist_ok=True)
