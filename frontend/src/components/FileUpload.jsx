import { useState, useRef } from 'react'
import { Upload, File, CheckCircle, AlertCircle, X } from 'lucide-react'
import { uploadDocument } from '../services/api'

const ALLOWED_TYPES = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
const ALLOWED_EXTENSIONS = ['pdf', 'txt', 'docx']
const MAX_SIZE_MB = 20

export default function FileUpload({ onUploadComplete }) {
  const [file, setFile] = useState(null)
  const [dragActive, setDragActive] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState(null) // 'success' | 'error'
  const [errorMsg, setErrorMsg] = useState('')
  const fileInputRef = useRef(null)

  const validateFile = (f) => {
    const ext = f.name.split('.').pop().toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) {
      return `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(', ')}`
    }
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      return `File too large. Maximum size: ${MAX_SIZE_MB}MB`
    }
    return null
  }

  const handleFile = async (f) => {
    const error = validateFile(f)
    if (error) {
      setErrorMsg(error)
      setStatus('error')
      return
    }

    setFile(f)
    setStatus(null)
    setUploading(true)
    setProgress(0)

    try {
      await uploadDocument(f, setProgress)
      setStatus('success')
      onUploadComplete?.()
    } catch (err) {
      setStatus('error')
      setErrorMsg(err.response?.data?.detail || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0])
    }
  }

  const reset = () => {
    setFile(null)
    setStatus(null)
    setErrorMsg('')
    setProgress(0)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const formatSize = (bytes) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="w-full">
      {!file ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-200 ${
            dragActive
              ? 'border-primary-500 bg-primary-500/5'
              : 'border-dark-600 hover:border-primary-500/50 hover:bg-dark-800/50'
          }`}
        >
          <Upload className="w-12 h-12 mx-auto mb-4 text-dark-400" />
          <p className="text-lg font-medium text-dark-200 mb-2">
            Drop your document here
          </p>
          <p className="text-sm text-dark-400 mb-4">
            or click to browse
          </p>
          <p className="text-xs text-dark-500">
            Supports PDF, TXT, DOCX — Max {MAX_SIZE_MB}MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.txt,.docx"
            onChange={handleChange}
            className="hidden"
          />
        </div>
      ) : (
        <div className="card">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              status === 'success' ? 'bg-emerald-500/10' :
              status === 'error' ? 'bg-red-500/10' : 'bg-primary-500/10'
            }`}>
              {status === 'success' ? (
                <CheckCircle className="w-6 h-6 text-emerald-400" />
              ) : status === 'error' ? (
                <AlertCircle className="w-6 h-6 text-red-400" />
              ) : (
                <File className="w-6 h-6 text-primary-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-dark-100 truncate">{file.name}</p>
              <p className="text-sm text-dark-400">{formatSize(file.size)}</p>
            </div>
            {!uploading && (
              <button onClick={reset} className="p-2 text-dark-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Progress bar */}
          {uploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-dark-400">Uploading...</span>
                <span className="text-primary-400">{progress}%</span>
              </div>
              <div className="w-full bg-dark-700 rounded-full h-2">
                <div
                  className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* Status messages */}
          {status === 'success' && (
            <p className="mt-3 text-sm text-emerald-400">
              Document uploaded and processed successfully!
            </p>
          )}
          {status === 'error' && (
            <p className="mt-3 text-sm text-red-400">{errorMsg}</p>
          )}
        </div>
      )}
    </div>
  )
}
