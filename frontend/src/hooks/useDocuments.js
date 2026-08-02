import { useState, useEffect, useCallback } from 'react'
import { getDocuments, deleteDocument } from '../services/api'

export default function useDocuments(search = '') {
  const [documents, setDocuments] = useState([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDocuments = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getDocuments(search)
      setDocuments(res.data.documents)
      setTotal(res.data.total)
    } catch (err) {
      setError(err.message || 'Failed to fetch documents')
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    fetchDocuments()
  }, [fetchDocuments])

  const removeDocument = async (id) => {
    try {
      await deleteDocument(id)
      fetchDocuments()
    } catch (err) {
      setError(err.message || 'Failed to delete document')
    }
  }

  return { documents, total, loading, error, refresh: fetchDocuments, removeDocument }
}
