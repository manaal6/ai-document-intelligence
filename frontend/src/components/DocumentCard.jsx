import { FileText, Trash2, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const statusConfig = {
  ready: { label: 'PARSED & INDEXED', className: 'badge-ready' },
  processing: { label: 'PROCESSING', className: 'badge-processing' },
  error: { label: 'INGESTION ERROR', className: 'badge-error' },
}

export default function DocumentCard({ document, onDelete }) {
  const navigate = useNavigate()
  const status = statusConfig[document.status] || statusConfig.processing

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div
      className="card-hover flex items-center justify-between p-4 bg-white border border-[#E5E7EB] rounded-lg transition-all"
      onClick={() => document.status === 'ready' && navigate(`/document/${document.id}`)}
    >
      <div className="flex items-center gap-3.5 min-w-0">
        {/* File extension badge */}
        <div className="w-9 h-9 rounded bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center font-mono text-[11px] font-bold text-[#374151] uppercase shrink-0">
          {document.file_type || 'DOC'}
        </div>

        {/* File details */}
        <div className="min-w-0">
          <h3 className="font-medium text-xs sm:text-sm text-[#111827] truncate hover:underline">
            {document.original_filename}
          </h3>
          <div className="flex items-center gap-2 mt-0.5 text-[11px] font-mono text-[#6B7280]">
            <span>{formatSize(document.file_size)}</span>
            <span>•</span>
            <span>Indexed on {formatDate(document.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Status and Action Buttons */}
      <div className="flex items-center gap-3 shrink-0">
        <span className={status.className}>{status.label}</span>

        {document.status === 'ready' && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              navigate(`/document/${document.id}`)
            }}
            className="btn-secondary py-1 px-2.5 text-[11px]"
          >
            <span>Open</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation()
            onDelete?.(document.id)
          }}
          className="p-1.5 text-[#9CA3AF] hover:text-rose-600 hover:bg-rose-50 rounded transition-colors"
          title="Delete document"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  )
}
