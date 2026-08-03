import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User, Loader2, Copy, Check } from 'lucide-react'
import { chatWithDocument } from '../services/api'

export default function ChatInterface({ documentId }) {
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = { role: 'user', content: input.trim() }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }))
      const res = await chatWithDocument(documentId, userMsg.content, history)
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.data.answer,
          sources: res.data.sources,
        },
      ])
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please check your API configuration and try again.',
          sources: [],
        },
      ])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const copyMessage = (text, idx) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  return (
    <div className="flex flex-col h-full">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.length === 0 && (
          <div className="text-center text-dark-400 py-12">
            <Bot className="w-12 h-12 mx-auto mb-3 text-dark-500" />
            <p className="font-medium">Ask anything about this document</p>
            <p className="text-sm mt-1">I'll find relevant information and provide answers with sources.</p>
          </div>
        )}

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
            )}

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                msg.role === 'user'
                  ? 'bg-primary-600 text-white'
                  : 'bg-dark-800 text-dark-100'
              }`}
            >
              <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>

              {/* Sources */}
              {msg.sources && msg.sources.length > 0 && (
                <div className="mt-3 pt-3 border-t border-dark-700">
                  <p className="text-xs text-dark-400 mb-2">Sources:</p>
                  {msg.sources.map((src, j) => (
                    <div key={j} className="text-xs text-dark-400 bg-dark-900 rounded-lg p-2 mb-1 last:mb-0">
                      "{src}..."
                    </div>
                  ))}
                </div>
              )}

              {/* Copy button */}
              {msg.role === 'assistant' && (
                <button
                  onClick={() => copyMessage(msg.content, i)}
                  className="mt-2 text-xs text-dark-400 hover:text-dark-200 flex items-center gap-1"
                >
                  {copiedIdx === i ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  {copiedIdx === i ? 'Copied' : 'Copy'}
                </button>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 bg-dark-600 rounded-full flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-dark-200" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center shrink-0">
              <Bot className="w-4 h-4 text-white" />
            </div>
            <div className="bg-dark-800 rounded-2xl px-4 py-3">
              <Loader2 className="w-5 h-5 text-primary-400 animate-spin" />
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 sm:p-4 border-t border-dark-700">
        <div className="flex gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask a question..."
            className="input-field flex-1 text-sm sm:text-base"
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || loading}
            className="btn-primary px-3 sm:px-4"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
