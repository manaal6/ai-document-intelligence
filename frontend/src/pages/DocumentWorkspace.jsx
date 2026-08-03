import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Search,
  FileText,
  Loader2,
  AlertTriangle,
  Info,
  Clock,
  Download,
} from 'lucide-react'
import { getDocument } from '../services/api'
import ChatInterface from '../components/ChatInterface'
import SummaryView from '../components/SummaryView'
import ExtractionView from '../components/ExtractionView'
import ExportButton from '../components/ExportButton'

const tabs = [
  { id: 'chat', label: 'AI Chat', icon: MessageSquare },
  { id: 'summary', label: 'Summary', icon: Sparkles },
  { id: 'extraction', label: 'Extraction', icon: Search },
]

export default function DocumentWorkspace() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [activeTab, setActiveTab] = useState('chat')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDocument()
  }, [id])

  const fetchDocument = async () => {
    setLoading(true)
    try {
      const res = await getDocument(id)
      setDoc(res.data)
    } catch (err) {
      setError('Document not found.')
    } finally {
      setLoading(false)
    }
  }

  const formatSize = (bytes) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-primary-400 animate-spin" />
      </div>
    )
  }

  if (error || !doc) {
    return (
      <div className="text-center py-20">
        <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
        <p className="text-red-400 mb-4">{error}</p>
        <Link to="/dashboard" className="btn-secondary">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <Link to="/dashboard" className="p-2 text-dark-400 hover:text-white hover:bg-dark-800 rounded-lg shrink-0">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-lg font-bold text-white truncate">
              {doc.original_filename}
            </h1>
            <div className="flex flex-wrap items-center gap-2 text-sm text-dark-400 mt-0.5">
              <span>{formatSize(doc.file_size)}</span>
              <span>•</span>
              <span className="uppercase">{doc.file_type}</span>
              <span>•</span>
              <Clock className="w-3.5 h-3.5" />
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="shrink-0">
          <ExportButton
            documentId={doc.id}
            hasSummary={!!doc.summary}
            hasExtraction={!!doc.extracted_info}
          />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left: Document Info */}
        <div className="lg:w-80 shrink-0">
          <div className="card sticky top-24 space-y-4">
            <h3 className="font-semibold text-dark-100 flex items-center gap-2">
              <Info className="w-4 h-4 text-primary-400" />
              Document Info
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-dark-400">Status</span>
                <span className={doc.status === 'ready' ? 'badge-ready' : 'badge-processing'}>
                  {doc.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Type</span>
                <span className="text-dark-200 uppercase">{doc.file_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-dark-400">Size</span>
                <span className="text-dark-200">{formatSize(doc.file_size)}</span>
              </div>
            </div>

            {/* Text Preview */}
            {doc.extracted_text && (
              <div>
                <h4 className="text-xs font-medium text-dark-400 uppercase tracking-wide mb-2">
                  Text Preview
                </h4>
                <div className="bg-dark-900 rounded-lg p-3 max-h-48 overflow-y-auto">
                  <p className="text-xs text-dark-300 leading-relaxed whitespace-pre-wrap">
                    {doc.extracted_text.substring(0, 500)}
                    {doc.extracted_text.length > 500 && '...'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: AI Workspace */}
        <div className="flex-1 min-w-0">
          {/* Tabs */}
          <div className="flex gap-1 bg-dark-800 p-1 rounded-xl mb-6">
            {tabs.map(({ id: tabId, label, icon: Icon }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeTab === tabId
                    ? 'bg-primary-600 text-white'
                    : 'text-dark-400 hover:text-dark-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="card min-h-[500px]">
            {activeTab === 'chat' && <ChatInterface documentId={doc.id} />}
            {activeTab === 'summary' && <SummaryView documentId={doc.id} onDataGenerated={fetchDocument} />}
            {activeTab === 'extraction' && <ExtractionView documentId={doc.id} onDataGenerated={fetchDocument} />}
          </div>
        </div>
      </div>
    </div>
  )
}
