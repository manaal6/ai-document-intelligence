import { useState, useEffect, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  ArrowLeft,
  MessageSquare,
  Sparkles,
  Search,
  Loader2,
  AlertTriangle,
  Info,
  Clock,
  ShieldCheck,
  FileText,
} from 'lucide-react'
import { getDocument } from '../services/api'
import ChatInterface from '../components/ChatInterface'
import SummaryView from '../components/SummaryView'
import ExtractionView from '../components/ExtractionView'
import ExportButton from '../components/ExportButton'

const tabs = [
  { id: 'chat', label: 'Grounding Chat & Citations', icon: MessageSquare },
  { id: 'summary', label: 'Executive Audit Summary', icon: Sparkles },
  { id: 'extraction', label: 'Entity Extraction Matrix', icon: Search },
]

export default function DocumentWorkspace() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)
  const [activeTab, setActiveTab] = useState('chat')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDocument = useCallback(async () => {
    try {
      const res = await getDocument(id)
      setDoc(res.data)
    } catch (err) {
      setError('Document not found in repository.')
    }
  }, [id])

  useEffect(() => {
    setLoading(true)
    fetchDocument().finally(() => setLoading(false))
  }, [id, fetchDocument])

  const refreshDocument = useCallback(async () => {
    await fetchDocument()
  }, [fetchDocument])

  const formatSize = (bytes) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-3">
        <Loader2 className="w-7 h-7 text-[#111827] animate-spin" />
        <p className="text-xs font-mono text-[#6B7280]">Loading document context & vector store...</p>
      </div>
    )
  }

  if (error || !doc) {
    return (
      <div className="text-center py-20 bg-white border border-[#E5E7EB] rounded-lg p-8">
        <AlertTriangle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
        <p className="text-sm font-semibold text-[#111827] mb-1">Failed to Load Document</p>
        <p className="text-xs text-[#6B7280] mb-4">{error}</p>
        <Link to="/dashboard" className="btn-secondary">
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Dashboard
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Workspace Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E7EB]">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            to="/dashboard"
            className="p-1.5 text-[#6B7280] hover:text-[#111827] hover:bg-[#F3F4F6] rounded-md transition-colors"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-base font-bold text-[#111827] truncate font-sans">
                {doc.original_filename}
              </h1>
              <span className="badge-ready">INDEXED</span>
            </div>
            <div className="flex items-center gap-2 text-[11px] font-mono text-[#6B7280] mt-0.5">
              <span>{formatSize(doc.file_size)}</span>
              <span>•</span>
              <span className="uppercase">{doc.file_type}</span>
              <span>•</span>
              <Clock className="w-3 h-3" />
              <span>{new Date(doc.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <ExportButton
            documentId={doc.id}
            hasSummary={!!doc.summary}
            hasExtraction={!!doc.extracted_info}
          />
        </div>
      </div>

      {/* Main Split Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left: Document Raw Text & Metadata Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-4 rounded-lg bg-white border border-[#E5E7EB] shadow-subtle space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
              <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono">
                Document Telemetry
              </span>
              <span className="text-[10px] font-mono text-[#059669] flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3 h-3" />
                VERIFIED
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">Pipeline:</span>
                <span className="text-[#111827] font-semibold">ChromaDB + PyMuPDF</span>
              </div>
              <div className="flex justify-between py-1 border-b border-[#F3F4F6]">
                <span className="text-[#6B7280]">File Type:</span>
                <span className="text-[#111827] uppercase">{doc.file_type}</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-[#6B7280]">Size:</span>
                <span className="text-[#111827]">{formatSize(doc.file_size)}</span>
              </div>
            </div>

            {/* Extracted text preview block */}
            {doc.extracted_text && (
              <div className="pt-2 border-t border-[#E5E7EB]">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono uppercase text-[#6B7280] font-semibold">
                    Raw Ingested Text
                  </span>
                  <span className="text-[10px] font-mono text-[#9CA3AF]">
                    {doc.extracted_text.length} chars
                  </span>
                </div>
                <div className="bg-[#F9FAFB] border border-[#E5E7EB] rounded p-2.5 max-h-64 overflow-y-auto font-mono text-[11px] leading-relaxed text-[#374151] whitespace-pre-wrap">
                  {doc.extracted_text.substring(0, 1000)}
                  {doc.extracted_text.length > 1000 && '\n\n[... Remaining text indexed ...]'}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Tabbed Analysis Console */}
        <div className="lg:col-span-8 space-y-4">
          {/* Linear / Swiss Segmented Tab Control */}
          <div className="flex items-center gap-1 bg-[#F3F4F6] p-1 rounded-md border border-[#E5E7EB]">
            {tabs.map(({ id: tabId, label, icon: Icon }) => (
              <button
                key={tabId}
                onClick={() => setActiveTab(tabId)}
                className={`flex-1 flex items-center justify-center gap-2 py-1.5 px-3 rounded text-xs font-medium transition-all ${
                  activeTab === tabId
                    ? 'bg-white text-[#111827] font-semibold shadow-subtle border border-[#E5E7EB]'
                    : 'text-[#6B7280] hover:text-[#111827]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            ))}
          </div>

          {/* Active Tab View Surface */}
          <div className="bg-white border border-[#E5E7EB] rounded-lg shadow-subtle min-h-[540px] p-5">
            {activeTab === 'chat' && <ChatInterface documentId={doc.id} />}
            {activeTab === 'summary' && <SummaryView documentId={doc.id} onDataGenerated={refreshDocument} />}
            {activeTab === 'extraction' && <ExtractionView documentId={doc.id} onDataGenerated={refreshDocument} />}
          </div>
        </div>
      </div>
    </div>
  )
}
