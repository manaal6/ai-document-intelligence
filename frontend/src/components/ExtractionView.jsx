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
} from 'lucide-react'
import { extractInformation } from '../services/api'

const extractionCategories = [
  { key: 'names', label: 'Names', icon: User, color: 'text-blue-400', bg: 'bg-blue-500/10' },
  { key: 'dates', label: 'Dates', icon: Calendar, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { key: 'organizations', label: 'Organizations', icon: Building2, color: 'text-purple-400', bg: 'bg-purple-500/10' },
  { key: 'numbers', label: 'Important Numbers', icon: Hash, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { key: 'tasks', label: 'Tasks', icon: ListChecks, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
  { key: 'deadlines', label: 'Deadlines', icon: Clock, color: 'text-red-400', bg: 'bg-red-500/10' },
]

export default function ExtractionView({ documentId }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleExtract = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await extractInformation(documentId)
      setData(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to extract information.')
    } finally {
      setLoading(false)
    }
  }

  if (!data && !loading) {
    return (
      <div className="text-center py-12">
        <Search className="w-12 h-12 mx-auto mb-3 text-dark-500" />
        <p className="font-medium text-dark-300 mb-2">Extract Information</p>
        <p className="text-sm text-dark-400 mb-4">
          Pull out names, dates, organizations, and more.
        </p>
        <button onClick={handleExtract} className="btn-primary" disabled={loading}>
          <Search className="w-4 h-4" />
          Extract Information
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="text-center py-12">
        <Loader2 className="w-12 h-12 mx-auto mb-3 text-primary-400 animate-spin" />
        <p className="font-medium text-dark-300">Extracting information...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-red-400" />
        <p className="font-medium text-red-400 mb-2">Error</p>
        <p className="text-sm text-dark-400 mb-4">{error}</p>
        <button onClick={handleExtract} className="btn-secondary">
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {extractionCategories.map(({ key, label, icon: Icon, color, bg }) => {
        const items = data[key] || []
        return (
          <div key={key} className="card">
            <h3 className={`font-semibold text-dark-100 mb-3 flex items-center gap-2`}>
              <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              {label}
              <span className="ml-auto text-xs text-dark-400 bg-dark-700 px-2 py-0.5 rounded-full">
                {items.length}
              </span>
            </h3>
            {items.length === 0 ? (
              <p className="text-sm text-dark-500 italic">None found</p>
            ) : (
              <ul className="space-y-1.5">
                {items.map((item, i) => (
                  <li key={i} className="text-sm text-dark-300 flex items-start gap-2">
                    <div className={`w-1.5 h-1.5 ${color.replace('text-', 'bg-')} rounded-full mt-1.5 shrink-0`} />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
