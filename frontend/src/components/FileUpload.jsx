import { useState, useRef } from 'react'
import { Upload, FileText, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { uploadDocument } from '../services/api'

export default function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)

  const allowedTypes = ['.pdf', '.txt', '.docx']
  const maxSize = 10 * 1024 * 1024 // 10MB

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const validateFile = (f) => {
    const ext = '.' + f.name.split('.').pop().toLowerCase()
    if (!allowedTypes.includes(ext)) {
      setError(`Invalid file type. Allowed: ${allowedTypes.join(', ')}`)
      return false
    }
    if (f.size > maxSize) {
      setError('File size exceeds 10MB limit.')
      return false
    }
    setError(null)
    return true
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0]
      if (validateFile(droppedFile)) {
        setFile(droppedFile)
      }
    }
  }

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      if (validateFile(selectedFile)) {
        setFile(selectedFile)
      }
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      await uploadDocument(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        setProgress(percent)
      })
      setFile(null)
      onUploadComplete?.()
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please check backend connection.')
    } finally {
      setUploading(false)
    }
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      {/* Drop Zone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border border-dashed rounded-lg p-8 sm:p-12 text-center cursor-pointer transition-all ${
          dragActive
            ? 'border-[#111827] bg-[#F3F4F6]'
            : 'border-[#D1D5DB] hover:border-[#9CA3AF] bg-white'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.txt,.docx"
          onChange={handleChange}
          className="hidden"
        />

        <div className="w-10 h-10 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] flex items-center justify-center mx-auto mb-3 text-[#111827]">
          <Upload className="w-5 h-5 text-[#6B7280]" />
        </div>

        <p className="font-semibold text-xs text-[#111827] uppercase tracking-wider font-mono">
          Drag & Drop Document Here
        </p>
        <p className="text-xs text-[#6B7280] mt-1">
          or click to browse local filesystem
        </p>
        <p className="text-[11px] font-mono text-[#9CA3AF] mt-2">
          PDF, TXT, DOCX up to 10MB
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-rose-50 border border-rose-200 rounded-md flex items-center gap-2 text-rose-700 text-xs">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500" />
          <span>{error}</span>
        </div>
      )}

      {/* Selected File */}
      {file && (
        <div className="p-4 bg-white border border-[#E5E7EB] rounded-lg shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#F3F4F6] border border-[#E5E7EB] flex items-center justify-center font-mono text-xs font-bold text-[#111827]">
              DOC
            </div>
            <div>
              <p className="font-medium text-xs text-[#111827]">{file.name}</p>
              <p className="text-[11px] font-mono text-[#6B7280]">{formatSize(file.size)}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFile(null)}
              className="btn-secondary text-xs"
              disabled={uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              className="btn-primary text-xs"
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Processing {progress}%</span>
                </>
              ) : (
                <>
                  <Upload className="w-3.5 h-3.5" />
                  <span>Ingest Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
