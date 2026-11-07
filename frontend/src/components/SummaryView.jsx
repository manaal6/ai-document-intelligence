import { useState } from 'react'
import { Sparkles, AlertTriangle, Loader2, Target, ListTodo, ShieldCheck } from 'lucide-react'
import { generateSummary } from '../services/api'

export default function SummaryView({ documentId, onDataGenerated }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await generateSummary(documentId)
      setSummary(res.data)
      onDataGenerated?.()
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate summary.')
    } finally {
      setLoading(false)
    }
  }

  if (!summary && !loading) {
    return (
      <div className="text-center py-16 space-y-3">
        <div className="w-10 h-10 rounded-md bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center mx-auto text-[#111827]">
          <Sparkles className="w-5 h-5 text-[#059669]" />
        </div>
        <p className="font-semibold text-xs text-[#111827] uppercase tracking-wider font-mono">
          Executive Audit Dossier
        </p>
        <p className="text-xs text-[#6B7280] max-w-md mx-auto leading-relaxed">
          Synthesizes an executive overview, critical risk covenants, key points, and actionable next steps formatted for leadership reviews.
        </p>
        <button onClick={handleGenerate} className="btn-primary inline-flex text-xs" disabled={loading}>
          <Sparkles className="w-3.5 h-3.5" />
          Generate Executive Brief
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-20 space-y-3">
        <Loader2 className="w-6 h-6 text-[#111827] animate-spin mx-auto" />
        <p className="font-mono text-xs text-[#111827] font-semibold">Synthesizing Executive Brief...</p>
        <p className="text-[11px] font-mono text-[#6B7280]">Extracting key covenants & risk points across all indexed chunks</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12 space-y-3">
        <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
        <p className="font-semibold text-xs text-rose-600 font-mono">Synthesis Interrupted</p>
        <p className="text-xs text-[#6B7280] max-w-md mx-auto">{error}</p>
        <button onClick={handleGenerate} className="btn-secondary text-xs">
          Retry Analysis
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {/* Executive Summary Card */}
      <div className="p-4 rounded-lg bg-[#F9FAFB] border border-[#E5E7EB] space-y-2">
        <div className="flex items-center justify-between pb-2 border-b border-[#E5E7EB]">
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            Executive Summary
          </span>
          <span className="badge-ready">VALIDATED</span>
        </div>
        <p className="text-xs text-[#374151] leading-relaxed whitespace-pre-wrap">
          {summary.executive_summary}
        </p>
      </div>

      {/* Key Points Column */}
      {summary.key_points && summary.key_points.length > 0 && (
        <div className="p-4 rounded-lg bg-white border border-[#E5E7EB] space-y-2.5">
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Target className="w-3.5 h-3.5 text-[#2563EB]" />
            Core Findings & Provisions ({summary.key_points.length})
          </span>
          <div className="space-y-1.5">
            {summary.key_points.map((pt, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#374151] p-2 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="font-mono text-[#6B7280] text-[10px] shrink-0">{String(idx + 1).padStart(2, '0')}.</span>
                <span className="leading-relaxed">{pt}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Items */}
      {summary.action_items && summary.action_items.length > 0 && (
        <div className="p-4 rounded-lg bg-white border border-[#E5E7EB] space-y-2.5">
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <ListTodo className="w-3.5 h-3.5 text-[#059669]" />
            Required Next Steps & Deadlines ({summary.action_items.length})
          </span>
          <div className="space-y-1.5">
            {summary.action_items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 text-xs text-[#374151] p-2 rounded bg-[#F9FAFB] border border-[#E5E7EB]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] shrink-0 mt-1.5"></span>
                <span className="leading-relaxed">{item}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
