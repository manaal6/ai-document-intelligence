import { Download, FileJson, FileText } from 'lucide-react'
import { exportPDF, exportJSON } from '../services/api'
import { useState } from 'react'

export default function ExportButton({ documentId, hasSummary, hasExtraction }) {
  const [downloading, setDownloading] = useState(null)

  const handleExport = async (type) => {
    setDownloading(type)
    try {
      const res = type === 'pdf'
        ? await exportPDF(documentId)
        : await exportJSON(documentId)

      const blob = new Blob([res.data])
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = type === 'pdf' ? `summary.pdf` : `extraction.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export failed:', err)
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={() => handleExport('pdf')}
        disabled={!hasSummary || downloading === 'pdf'}
        className="btn-secondary text-sm"
        title={!hasSummary ? 'Generate a summary first' : 'Export summary as PDF'}
      >
        {downloading === 'pdf' ? (
          <span className="animate-pulse">Downloading...</span>
        ) : (
          <>
            <FileText className="w-4 h-4" />
            Export PDF
          </>
        )}
      </button>
      <button
        onClick={() => handleExport('json')}
        disabled={!hasExtraction || downloading === 'json'}
        className="btn-secondary text-sm"
        title={!hasExtraction ? 'Run extraction first' : 'Export extraction as JSON'}
      >
        {downloading === 'json' ? (
          <span className="animate-pulse">Downloading...</span>
        ) : (
          <>
            <FileJson className="w-4 h-4" />
            Export JSON
          </>
        )}
      </button>
    </div>
  )
}
