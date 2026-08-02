import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api',
  timeout: 120000, // 2 minutes for LLM operations
})

// ── Documents ────────────────────────────────────────────────

export const uploadDocument = (file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  return api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (e) => {
      if (onProgress && e.total) {
        onProgress(Math.round((e.loaded * 100) / e.total))
      }
    },
  })
}

export const getDocuments = (search = '') =>
  api.get('/documents', { params: { search } })

export const getDocument = (id) =>
  api.get(`/documents/${id}`)

export const deleteDocument = (id) =>
  api.delete(`/documents/${id}`)

// ── Chat ─────────────────────────────────────────────────────

export const chatWithDocument = (documentId, message, history = []) =>
  api.post('/chat', {
    document_id: documentId,
    message,
    conversation_history: history,
  })

// ── Summary ──────────────────────────────────────────────────

export const generateSummary = (documentId) =>
  api.post(`/summary/${documentId}`)

// ── Extraction ───────────────────────────────────────────────

export const extractInformation = (documentId) =>
  api.post(`/extract/${documentId}`)

// ── Export ───────────────────────────────────────────────────

export const exportPDF = (documentId) =>
  api.get(`/export/${documentId}/pdf`, { responseType: 'blob' })

export const exportJSON = (documentId) =>
  api.get(`/export/${documentId}/json`, { responseType: 'blob' })

// ── Stats ────────────────────────────────────────────────────

export const getStats = () =>
  api.get('/stats')

export default api
