import { useState } from 'react'
import { Settings, Save, Info } from 'lucide-react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    ollamaModel: 'llama3.1',
    chunkSize: 500,
    chunkOverlap: 50,
    topKResults: 5,
    temperature: 0.3,
    maxTokens: 2048,
  })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    // In a real app, this would send to the backend
    localStorage.setItem('docAssistantSettings', JSON.stringify(settings))
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-dark-400 text-sm mt-1">
          Configure the AI document intelligence assistant.
        </p>
      </div>

      {/* LLM Settings */}
      <div className="card space-y-6">
        <h3 className="font-semibold text-dark-100 flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary-400" />
          LLM Configuration
        </h3>

        <div>
          <label className="block text-sm font-medium text-dark-300 mb-1.5">
            Ollama Model
          </label>
          <select
            value={settings.ollamaModel}
            onChange={(e) => setSettings({ ...settings, ollamaModel: e.target.value })}
            className="input-field"
          >
            <option value="llama3.1">Llama 3.1</option>
            <option value="qwen2.5">Qwen 2.5</option>
            <option value="mistral">Mistral</option>
          </select>
          <p className="text-xs text-dark-500 mt-1">Select the model pulled in Ollama.</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Temperature: {settings.temperature}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={settings.temperature}
              onChange={(e) => setSettings({ ...settings, temperature: parseFloat(e.target.value) })}
              className="w-full accent-primary-500"
            />
            <div className="flex justify-between text-xs text-dark-500">
              <span>Precise</span>
              <span>Creative</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Max Tokens
            </label>
            <input
              type="number"
              value={settings.maxTokens}
              onChange={(e) => setSettings({ ...settings, maxTokens: parseInt(e.target.value) })}
              className="input-field"
              min="256"
              max="8192"
            />
          </div>
        </div>
      </div>

      {/* RAG Settings */}
      <div className="card space-y-6">
        <h3 className="font-semibold text-dark-100 flex items-center gap-2">
          <Info className="w-5 h-5 text-primary-400" />
          RAG Configuration
        </h3>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Chunk Size
            </label>
            <input
              type="number"
              value={settings.chunkSize}
              onChange={(e) => setSettings({ ...settings, chunkSize: parseInt(e.target.value) })}
              className="input-field"
              min="100"
              max="2000"
            />
            <p className="text-xs text-dark-500 mt-1">Characters per chunk.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Chunk Overlap
            </label>
            <input
              type="number"
              value={settings.chunkOverlap}
              onChange={(e) => setSettings({ ...settings, chunkOverlap: parseInt(e.target.value) })}
              className="input-field"
              min="0"
              max="500"
            />
            <p className="text-xs text-dark-500 mt-1">Overlap between chunks.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-1.5">
              Top K Results
            </label>
            <input
              type="number"
              value={settings.topKResults}
              onChange={(e) => setSettings({ ...settings, topKResults: parseInt(e.target.value) })}
              className="input-field"
              min="1"
              max="20"
            />
            <p className="text-xs text-dark-500 mt-1">Chunks retrieved per query.</p>
          </div>
        </div>
      </div>

      {/* Save */}
      <div className="flex items-center gap-4">
        <button onClick={handleSave} className="btn-primary">
          <Save className="w-4 h-4" />
          Save Settings
        </button>
        {saved && (
          <span className="text-sm text-emerald-400">Settings saved!</span>
        )}
      </div>

      {/* Info */}
      <div className="card bg-primary-500/5 border-primary-500/20">
        <h3 className="font-medium text-primary-400 mb-2">About Settings</h3>
        <p className="text-sm text-dark-300 leading-relaxed">
          Settings are saved to your browser's local storage. Backend settings
          require editing the <code className="bg-dark-800 px-1.5 py-0.5 rounded text-primary-300">.env</code> file
          and restarting the server. Make sure the Ollama model you select is
          pulled via <code className="bg-dark-800 px-1.5 py-0.5 rounded text-primary-300">ollama pull {'<model>'}</code>.
        </p>
      </div>
    </div>
  )
}
