import { useState } from 'react'
import { Settings, Save, CheckCircle2, ShieldCheck, Database } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    ollamaModel: 'llama3.1',
    chunkSize: 500,
    chunkOverlap: 50,
    topKResults: 5,
    temperature: 0.2,
    maxTokens: 2048,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    localStorage.setItem('docAssistantSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="pb-3 border-b border-[#E5E7EB]">
        <h1 className="text-xl font-bold text-[#111827] tracking-tight">System & Pipeline Configuration</h1>
        <p className="text-xs text-[#6B7280] font-mono mt-0.5">
          Tune RAG chunk parameters, retrieval depth, and inference settings
        </p>
      </div>

      {/* LLM Settings */}
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-lg shadow-subtle space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Settings className="w-3.5 h-3.5 text-[#6B7280]" />
            Inference Model
          </span>
          <span className="text-[10px] font-mono text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] px-2 py-0.5 rounded font-semibold">
            GROQ ACCELERATED
          </span>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#374151] mb-1">
            Active LLM Model
          </label>
          <select
            value={settings.ollamaModel}
            onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
            className="input-field text-xs font-mono"
          >
            <option value="llama3.1">Llama 3.1 70B (Groq Production)</option>
            <option value="qwen2.5">Qwen 2.5 72B (Multilingual)</option>
            <option value="mistral">Mistral Large (High Grounding)</option>
          </select>
          <p className="text-[11px] text-[#6B7280] mt-1">High-speed inference via Groq cloud API.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <div className="flex justify-between text-xs font-medium text-[#374151] mb-1">
              <span>Temperature</span>
              <span className="font-mono text-[#111827]">{settings.temperature}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-[#111827]"
            />
            <div className="flex justify-between text-[10px] text-[#9CA3AF] font-mono mt-1">
              <span>0.0 (Strict Audit)</span>
              <span>1.0 (Creative)</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Max Response Tokens
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) || 2048 })}
              className="input-field text-xs font-mono"
            />
          </div>
        </div>
      </div>

      {/* RAG Settings */}
      <div className="p-5 bg-white border border-[#E5E7EB] rounded-lg shadow-subtle space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-[#E5E7EB]">
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wider font-mono flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-[#6B7280]" />
            Vector & Chunk Partitioning
          </span>
          <span className="text-[10px] font-mono text-[#4B5563] bg-[#F3F4F6] border border-[#E5E7EB] px-2 py-0.5 rounded">
            ChromaDB Native
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Chunk Size
            </label>
            <input
              type="number"
              value={settings.chunkSize}
              onChange={(e) => setSettings({ ...settings, chunkSize: parseInt(e.target.value) || 500 })}
              className="input-field text-xs font-mono"
            />
            <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono">Tokens / segment</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Chunk Overlap
            </label>
            <input
              type="number"
              value={settings.chunkOverlap}
              onChange={(e) => setSettings({ ...settings, chunkOverlap: parseInt(e.target.value) || 50 })}
              className="input-field text-xs font-mono"
            />
            <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono">Boundary tokens</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#374151] mb-1">
              Top-K Retrieval
            </label>
            <input
              type="number"
              value={settings.topKResults}
              onChange={(e) => setSettings({ ...settings, topKResults: parseInt(e.target.value) || 5 })}
              className="input-field text-xs font-mono"
            />
            <p className="text-[10px] text-[#9CA3AF] mt-1 font-mono">Retrieved context docs</p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-between pt-2">
        {saved ? (
          <span className="text-xs font-mono text-[#059669] flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Configuration saved locally
          </span>
        ) : (
          <span className="text-xs text-[#9CA3AF] font-mono">Changes apply to subsequent sessions</span>
        )}

        <button onClick={handleSave} className="btn-primary text-xs">
          <Save className="w-3.5 h-3.5" />
          <span>Save Pipeline Configuration</span>
        </button>
      </div>
    </div>
  )
}
