import { useState } from 'react'
import { Sparkles, CheckCircle, AlertTriangle, Loader2, Target, ListTodo, Lightbulb } from 'lucide-react'
import { generateSummary } from '../services/api'

export default function SummaryView({ documentId }) {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleGenerate = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await generateSummary(documentId)
      setSummary(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate summary.')
    } finally {
      setLoading(false)
    }
  }

  if (!summary && !loading) {
    return (
      <div className="text-center py-12">
        <Sparkles className="w-12 h-12 mx-auto mb-3 text-dark-500" />
        <p className="font-medium text-dark-300 mb-2">Generate AI Summary</p>
        <p className="text-sm text-dark-400 mb-4">
          Get an executive summary, key points, and action items.
        </p>
        <button onClick={handleGenerate} className="btn-primary" disabled={loading}>
          <Sparkles className="w-4 h-4" />
          Generate Summary
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 mx-auto mb-3 text-primary-400 animate-spin" />
        <p className="font-medium text-dark-300">Analyzing document...</p>
        <p className="text-sm text-dark-400">This may take a moment.</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-400" />
        <p className="font-medium text-red-400 mb-2">Error</p>
        <p className="text-sm text-dark-400 mb-4">{error}</p>
        <button onClick={handleGenerate} className="btn-secondary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Executive Summary */}
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-100 mb-3 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary-400" />
          Executive Summary
        </h3>
        <p className="text-sm text-dark-300 leading-relaxed whitespace-pre-wrap">
          {summary.executive_summary}
        </p>
      </div>

      {/* Key Points */}
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-100 mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-emerald-400" />
          Key Points
        </h3>
        <ul className="space-y-2">
          {summary.key_points?.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
              <CheckCircle className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              {point}
            </li>
          ))}
        </ul>
      </div>

      {/* Action Items */}
      <div className="card">
        <h3 className="text-lg font-semibold text-dark-100 mb-3 flex items-center gap-2">
          <ListTodo className="w-5 h-5 text-amber-400" />
          Action Items
        </h3>
        <ul className="space-y-2">
          {summary.action_items?.map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
              <div className="w-4 h-4 rounded border border-amber-400/50 mt-0.5 shrink-0" />
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Important Findings */}
      {summary.important_findings?.length > 0 && (
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-100 mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-400" />
            Important Findings
          </h3>
          <ul className="space-y-2">
            {summary.important_findings.map((finding, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-dark-300">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 shrink-0" />
                {finding}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Conclusions */}
      {summary.conclusions && (
        <div className="card">
          <h3 className="text-lg font-semibold text-dark-100 mb-3">Conclusions</h3>
          <p className="text-sm text-dark-300 leading-relaxed whitespace-pre-wrap">
            {summary.conclusions}
          </p>
        </div>
      )}
    </div>
  )
}
