"""Information extraction service — regex-based fallback + LLM-based extraction."""

import json
import re

from .llm_service import (
    EXTRACTION_SYSTEM_PROMPT,
    build_extraction_prompt,
    query_groq,
)


def regex_extract_info(text: str) -> dict:
    """Extract information using regex patterns (fast fallback)."""
    # Dates
    date_patterns = [
        r"\b\d{1,2}[/-]\d{1,2}[/-]\d{2,4}\b",
        r"\b(?:January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{1,2},?\s+\d{4}\b",
        r"\b\d{4}[/-]\d{1,2}[/-]\d{1,2}\b",
        r"\b(?:Q[1-4]\s+\d{4}|(?:FY|H[12])\s*\d{4})\b",
    ]
    dates = []
    for pattern in date_patterns:
        dates.extend(re.findall(pattern, text, re.IGNORECASE))

    # Numbers / financial
    number_patterns = [
        r"\$[\d,]+(?:\.\d{2})?(?:\s*(?:million|billion|M|B|K))?",
        r"\b\d+(?:,\d{3})*(?:\.\d+)?\s*(?:%|percent)\b",
        r"\b\d+\s*(?:units|items|people|employees|users|customers)\b",
    ]
    numbers = []
    for pattern in number_patterns:
        numbers.extend(re.findall(pattern, text, re.IGNORECASE))

    # Organizations (capitalized words followed by common suffixes)
    org_patterns = [
        r"\b[A-Z][a-zA-Z]*(?:\s+[A-Z][a-zA-Z]*)*\s+(?:Inc|Corp|Ltd|LLC|Co|Company|University|Institute|Organization|Foundation|Association|Group|Team|Department)\.?\b",
    ]
    organizations = []
    for pattern in org_patterns:
        organizations.extend(re.findall(pattern, text))

    # Tasks (sentences with action verbs)
    task_patterns = [
        r"(?:TODO|Task|Action Item|Must|Should|Need to|Required to|Deadline)[:\s]+(.{10,100})",
    ]
    tasks = []
    for pattern in task_patterns:
        tasks.extend(re.findall(pattern, text, re.IGNORECASE))

    return {
        "names": [],  # Names are hard with regex — let LLM handle
        "dates": list(set(dates)),
        "organizations": list(set(organizations)),
        "numbers": list(set(numbers)),
        "tasks": list(set(tasks)),
        "deadlines": list(set(d for d in dates if any(kw in text.lower() for kw in ["deadline", "due by", "due date"]))),
    }


async def extract_information(text: str) -> dict:
    """Extract information from document text using LLM with regex fallback."""
    try:
        prompt = build_extraction_prompt(text)
        response = query_groq(prompt, EXTRACTION_SYSTEM_PROMPT)

        # Try to parse JSON from response
        # Strip markdown code blocks if present
        cleaned = response.strip()
        if cleaned.startswith("```"):
            cleaned = re.sub(r"^```(?:json)?\s*", "", cleaned)
            cleaned = re.sub(r"\s*```$", "", cleaned)

        result = json.loads(cleaned)
        return result
    except (json.JSONDecodeError, Exception):
        # Fall back to regex extraction
        return regex_extract_info(text)
