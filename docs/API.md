# API Documentation

Base URL: `http://localhost:8000`

## Endpoints

### Documents

#### `POST /api/documents/upload`
Upload and process a document.

**Request:** `multipart/form-data`
- `file` (required): PDF, TXT, or DOCX file (max 20MB)

**Response:** `200 OK`
```json
{
  "id": 1,
  "filename": "doc_20260801_report.pdf",
  "original_filename": "report.pdf",
  "file_size": 1024000,
  "file_type": "pdf",
  "status": "ready",
  "created_at": "2026-08-01T10:00:00",
  "updated_at": "2026-08-01T10:00:05"
}
```

#### `GET /api/documents`
List all documents.

**Query Parameters:**
- `search` (optional): Filter by filename

**Response:** `200 OK`
```json
{
  "documents": [...],
  "total": 5
}
```

#### `GET /api/documents/{id}`
Get document details.

#### `DELETE /api/documents/{id}`
Delete a document and its data.

---

### Chat

#### `POST /api/chat`
Ask a question about a document.

**Request Body:**
```json
{
  "document_id": 1,
  "message": "What are the main findings?",
  "conversation_history": [
    {"role": "user", "content": "previous question"},
    {"role": "assistant", "content": "previous answer"}
  ]
}
```

**Response:**
```json
{
  "answer": "The main findings are...",
  "sources": ["Source chunk 1 text...", "Source chunk 2 text..."]
}
```

---

### Summary

#### `POST /api/summary/{document_id}`
Generate an AI summary.

**Response:**
```json
{
  "executive_summary": "This document covers...",
  "key_points": ["Revenue increased 23%", "150 new clients"],
  "action_items": ["Launch mobile app by Sep 30", "Hire 15 engineers"],
  "important_findings": ["$4.2M revenue", "99.97% uptime"],
  "conclusions": "The company is well-positioned..."
}
```

---

### Extraction

#### `POST /api/extract/{document_id}`
Extract structured information.

**Response:**
```json
{
  "names": ["Sarah Mitchell", "James Rodriguez"],
  "dates": ["July 15, 2026", "September 30, 2026"],
  "organizations": ["TechNova Solutions Inc.", "GlobalTech Corp"],
  "numbers": ["$4.2 million", "23%", "150 new clients"],
  "tasks": ["Launch mobile application", "Hire 15 engineers"],
  "deadlines": ["September 30, 2026", "August 31, 2026"]
}
```

---

### Export

#### `GET /api/export/{document_id}/pdf`
Download summary as PDF file.

#### `GET /api/export/{document_id}/json`
Download extraction as JSON file.

---

### Stats

#### `GET /api/stats`
Dashboard statistics.

**Response:**
```json
{
  "total_documents": 5,
  "total_queries": 0,
  "summaries_generated": 3,
  "total_size_bytes": 5120000,
  "recent_documents": [...]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "detail": "Error message describing the problem"
}
```

Common status codes:
- `400` — Bad request (invalid file type, file too large)
- `404` — Document not found
- `500` — Server error
