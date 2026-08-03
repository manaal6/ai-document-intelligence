import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle, FileText } from 'lucide-react'
import FileUpload from '../components/FileUpload'

export default function UploadPage() {
  const [uploaded, setUploaded] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Upload Document</h1>
        <p className="text-dark-400 text-sm mt-1">
          Upload a PDF, TXT, or DOCX file for AI analysis.
        </p>
      </div>

      {/* Upload Zone */}
      <FileUpload onUploadComplete={() => setUploaded(true)} />

      {/* Success State */}
      {uploaded && (
        <div className="card bg-emerald-500/5 border-emerald-500/20">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            <p className="font-medium text-emerald-400">Document processed successfully!</p>
          </div>
          <p className="text-sm text-dark-300 mb-4">
            Your document has been uploaded, text extracted, and indexed for AI search.
            You can now chat with it, generate summaries, or extract information.
          </p>
          <div className="flex gap-3">
            <button onClick={() => setUploaded(false)} className="btn-secondary">
              Upload Another
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary">
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Supported Formats */}
      <div className="card">
        <h3 className="font-medium text-dark-200 mb-3">Supported Formats</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { ext: 'PDF', desc: 'Portable Document Format', icon: '📄' },
            { ext: 'TXT', desc: 'Plain Text Files', icon: '📝' },
            { ext: 'DOCX', desc: 'Microsoft Word', icon: '📋' },
          ].map(({ ext, desc, icon }) => (
            <div key={ext} className="text-center p-4 bg-dark-900 rounded-xl">
              <div className="text-2xl mb-2">{icon}</div>
              <p className="font-medium text-dark-100 text-sm">{ext}</p>
              <p className="text-xs text-dark-400">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
