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
    { label: 'Documents', value: stats?.total_documents || 0, icon: FileText, color: 'text-blue-400', bg: 'bg-blue-500/10' },
    { label: 'Queries', value: stats?.total_queries || 0, icon: MessageSquare, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
    { label: 'Summaries', value: stats?.summaries_generated || 0, icon: Sparkles, color: 'text-amber-400', bg: 'bg-amber-500/10' },
    { label: 'Storage', value: formatBytes(stats?.total_size_bytes || 0), icon: HardDrive, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  ]

  const filteredDocs = allDocuments.filter((doc) =>
    doc.original_filename?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-dark-400 text-sm mt-1">Overview of your document intelligence platform.</p>
        </div>
        <Link to="/upload" className="btn-primary">
          <Upload className="w-4 h-4" />
          Upload Document
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-xl flex items-center justify-center`}>
                <Icon className={`w-5 h-5 ${color}`} />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-xs text-dark-400">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">Documents</h2>
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
            <input
              type="text"
              placeholder="Search documents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 w-64 text-sm"
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="card text-center py-12">
            <FileText className="w-12 h-12 text-dark-500 mx-auto mb-3" />
            <p className="text-dark-400 mb-4">No documents yet.</p>
            <Link to="/upload" className="btn-primary">
              <Upload className="w-4 h-4" />
              Upload Your First Document
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDocs.map((doc) => (
              <DocumentCard key={doc.id} document={doc} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
