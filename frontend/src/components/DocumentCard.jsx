import { FileText, File, Trash2, MessageSquare } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const typeIcons = {
  pdf: '📄',
  txt: '📝',
  docx: '📋',
}

const statusConfig = {
  ready: { label: 'Ready', className: 'badge-ready' },
  processing: { label: 'Processing', className: 'badge-processing' },
  error: { label: 'Error', className: 'badge-error' },
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
      className="card-hover group"
      onClick={() => document.status === 'ready' && navigate(`/document/${document.id}`)}
    >
      <div className="flex items-start gap-3 sm:gap-4">
        {/* File type icon */}
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-dark-700 rounded-xl flex items-center justify-center text-lg sm:text-xl shrink-0">
          {typeIcons[document.file_type] || '📄'}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-dark-100 truncate group-hover:text-primary-400 transition-colors text-sm sm:text-base">
            {document.original_filename}
          </h3>
          <div className="flex items-center gap-2 sm:gap-3 mt-1 text-xs sm:text-sm text-dark-400">
            <span>{formatSize(document.file_size)}</span>
            <span>•</span>
            <span>{formatDate(document.created_at)}</span>
          </div>
        </div>

        {/* Status + Actions */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0">
          <span className={`${status.className} hidden sm:inline-flex`}>{status.label}</span>
          {document.status === 'ready' && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                navigate(`/document/${document.id}`)
              }}
              className="p-2 text-dark-400 hover:text-primary-400 hover:bg-dark-700 rounded-lg transition-colors"
              title="Chat with document"
            >
              <MessageSquare className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDelete?.(document.id)
            }}
            className="p-2 text-dark-400 hover:text-red-400 hover:bg-dark-700 rounded-lg transition-colors"
            title="Delete document"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
