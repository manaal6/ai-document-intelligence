import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, CheckCircle2, ShieldCheck, FileText, ArrowLeft } from 'lucide-react'
import FileUpload from '../components/FileUpload'

export default function UploadPage() {
  const [uploaded, setUploaded] = useState(false)
  const navigate = useNavigate()

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#111827] tracking-tight">Ingest Document</h1>
        <p className="text-xs text-[#6B7280] font-mono mt-0.5">
          Multi-modal chunking & vector indexing pipeline
        </p>
      </div>

      {/* Upload Zone */}
      <FileUpload onUploadComplete={() => setUploaded(true)} />

      {/* Success State */}
      {uploaded && (
        <div className="p-4 rounded-lg bg-[#ECFDF5] border border-[#A7F3D0] space-y-3">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <p className="font-semibold text-xs text-[#065F46] font-mono">Document Processed & Ingested Successfully</p>
          </div>
          <p className="text-xs text-[#065F46] leading-relaxed">
            Text extraction, sentence tokenization, and vector embeddings in ChromaDB are complete. You can now perform citation-grounded Q&A and generate executive briefs.
          </p>
          <div className="flex gap-2 pt-1">
            <button onClick={() => setUploaded(false)} className="btn-secondary text-xs">
              Upload Another File
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-primary text-xs">
              Go to Workspace
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Supported Specs Table */}
      <div className="p-4 rounded-lg bg-white border border-[#E5E7EB] shadow-subtle space-y-3">
        <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono">
          Supported Ingestion Formats
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { ext: 'PDF', desc: 'PyMuPDF native extraction', badge: 'Fast OCR' },
            { ext: 'TXT', desc: 'Raw UTF-8 text parsing', badge: 'Direct' },
            { ext: 'DOCX', desc: 'Word XML tree extraction', badge: 'Office' },
          ].map(({ ext, desc, badge }) => (
            <div key={ext} className="p-3 bg-[#F9FAFB] border border-[#E5E7EB] rounded-md space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-xs text-[#111827]">{ext}</span>
                <span className="text-[10px] font-mono text-[#059669] bg-white border border-[#E5E7EB] px-1.5 rounded">
                  {badge}
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280]">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
