import { useState } from 'react'
import {
  User,
  Calendar,
  Building2,
  Hash,
  ListChecks,
  Clock,
  Loader2,
  AlertTriangle,
  Search,
  CheckCircle2,
} from 'lucide-react'
import { extractInformation } from '../services/api'

const extractionCategories = [
  { key: 'names', label: 'Signatories & Names', icon: User },
  { key: 'dates', label: 'Effective & Renewal Dates', icon: Calendar },
  { key: 'organizations', label: 'Contracting Entities', icon: Building2 },
  { key: 'numbers', label: 'Financial Figures & Caps', icon: Hash },
  { key: 'tasks', label: 'Obligations & Deliverables', icon: ListChecks },
  { key: 'deadlines', label: 'Statutory Deadlines', icon: Clock },
]

export default function ExtractionView({ documentId, onDataGenerated }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleExtract = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await extractInformation(documentId)
      setData(res.data)
      onDataGenerated?.()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract structured information.')
    } finally {
      setLoading(false)
    }
  }

  if (!data && !loading) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="w-10 h-10 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#111827]">
          <Search className="w-5 h-5 text-[#2563EB]" />
        </div>
        <p className="font-semibold text-xs text-[#111827] uppercase tracking-wider font-mono">
          Structured Entity Extraction
        </p>
        <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
          Parses the full text into clean, structured tables of parties, financial caps, governing entities, statutory deadlines, and obligations.
        </p>
        <button onClick={handleExtract} className="btn-primary inline-flex text-xs" disabled={loading}>
          <Search className="w-3.5 h-3.5" />
          Run Structured Extraction
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-20 space-y-3">
        <Loader2 className="w-6 h-6 text-[#111827] animate-spin mx-auto" />
        <p className="font-mono text-xs text-[#111827] font-semibold">Extracting Structured Entities...</p>
        <p className="text-[11px] font-mono text-[#6B7280]">Identifying names, organizations, dates, and liability caps</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-3">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="font-semibold text-xs text-rose-600 font-mono">Extraction Failed</p>
        <p className="text-xs text-[#6B7280] max-w-md mx-auto">{error}</p>
        <button onClick={handleExtract} className="btn-secondary text-xs">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
        <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono">
          Entity Extraction Matrix
        </span>
        <span className="badge-ready">JSON SYNCHRONIZED</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {extractionCategories.map(({ key, label, icon: Icon }) => {
          const items = data?.[key] || []
          return (
            <div key={key} className="p-3.5 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span className="text-xs font-semibold text-[#111827]">{label}</span>
                </div>
                <span className="text-[10px] font-mono text-[#6B7280] bg-white border border-[#E5E7EB] px-1.5 py-0.5 rounded">
                  {items.length}
                </span>
              </div>

              {items.length === 0 ? (
                <p className="text-[11px] text-[#9CA3AF] italic py-1">No items detected</p>
              ) : (
                <div className="space-y-1">
                  {items.map((item, idx) => (
                    <div
                      key={idx}
                      className="text-xs font-mono text-[#374151] bg-white border border-[#E5E7EB] rounded px-2.5 py-1.5 flex items-center justify-between"
                    >
                      <span className="truncate">{item}</span>
                      <CheckCircle2 className="w-3 h-3 text-[#059669] shrink-0 ml-2" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
