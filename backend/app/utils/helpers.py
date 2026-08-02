"""Utility helper functions."""

import json
from datetime import datetime


def format_file_size(size_bytes: int) -> str:
    """Convert bytes to human-readable file size."""
    for unit in ["B", "KB", "MB", "GB"]:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} TB"


def safe_json_loads(text: str, default=None):
    """Safely parse JSON, returning default on failure."""
    if not text:
        return default or {}
    try:
        return json.loads(text)
    except (json.JSONDecodeError, TypeError):
        return default or {}


def generate_filename(original_filename: str, prefix: str = "") -> str:
    """Generate a unique filename with timestamp."""
    timestamp = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    extension = original_filename.rsplit(".", 1)[-1] if "." in original_filename else "txt"
    name = original_filename.rsplit(".", 1)[0] if "." in original_filename else original_filename
    # Clean name
    name = "".join(c if c.isalnum() or c in "-_" else "_" for c in name)[:50]
    prefix_part = f"{prefix}_" if prefix else ""
    return f"{prefix_part}{timestamp}_{name}.{extension}"
