import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  MessageSquare,
  Sparkles,
  HardDrive,
  Upload,
  Search,
  Loader2,
  Filter,
} from 'lucide-react'
import { getStats, deleteDocument } from '../services/api'
import DocumentCard from '../components/DocumentCard'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [allDocuments, setAllDocuments] = useState([])

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    setLoading(true)
    try {
      const res = await getStats()
      setStats(res.data)
      setAllDocuments(res.data.recent_documents || [])
    } catch (err) {
      console.error('Failed to fetch stats:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('Delete this document? This cannot be undone.')) return
    try {
      await deleteDocument(id)
      fetchStats()
    } catch (err) {
      console.error('Delete failed:', err)
    }
  }

  const formatBytes = (bytes) => {
    if (!bytes) return '0 B'
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const statCards = [
    { label: 'Active Documents', value: stats?.total_documents || 0, icon: FileText },
    { label: 'Queries Answered', value: stats?.total_queries || 0, icon: MessageSquare },
    { label: 'Executive Summaries', value: stats?.summaries_generated || 0, icon: Sparkles },
    { label: 'Ingested Storage', value: formatBytes(stats?.total_size_bytes || 0), icon: HardDrive },
  ]

  const filteredDocs = allDocuments.filter((doc) =>
    doc.original_filename?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E7EB]">
        <div>
          <h1 className="text-xl font-bold text-[#111827] tracking-tight">Document Repository & Telemetry</h1>
          <p className="text-xs text-[#6B7280] mt-0.5 font-mono">
            Audit-grade document workspace • Multi-modal RAG search
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/upload" className="btn-primary">
            <Upload className="w-3.5 h-3.5" />
            Upload Document
          </Link>
        </div>
      </div>

      {/* Metrics Row (High Density Swiss Style) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="p-4 rounded-lg bg-white border border-[#E5E7EB] shadow-subtle space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[#6B7280]">{label}</span>
              <Icon className="w-4 h-4 text-[#9CA3AF]" />
            </div>
            <p className="text-2xl font-bold font-mono text-[#111827] tracking-tight">{value}</p>
          </div>
        ))}
      </div>

      {/* Search & Document Ledger */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-[#111827] uppercase tracking-wider font-mono">
              Indexed Documents
            </h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#F3F4F6] text-[#4B5563] border border-[#E5E7EB]">
              {filteredDocs.length} Total
            </span>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]" />
            <input
              type="text"
              placeholder="Filter by filename or extension..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-8 text-xs font-mono"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-16 bg-white border border-[#E5E7EB] rounded-lg">
            <Loader2 className="w-6 h-6 text-[#111827] animate-spin mx-auto" />
            <p className="text-xs text-[#6B7280] font-mono mt-2">Loading document index...</p>
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="card text-center py-16 space-y-3">
            <FileText className="w-10 h-10 text-[#9CA3AF] mx-auto" />
            <div>
              <p className="text-sm font-semibold text-[#111827]">No documents found</p>
              <p className="text-xs text-[#6B7280] mt-1">Upload a PDF, DOCX, or TXT file to begin analysis.</p>
            </div>
            <Link to="/upload" className="btn-primary inline-flex">
              <Upload className="w-3.5 h-3.5" />
              Upload Document
            </Link>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
