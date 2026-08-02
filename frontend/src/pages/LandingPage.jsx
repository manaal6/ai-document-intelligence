import { Link } from 'react-router-dom'
import {
  Brain,
  Upload,
  MessageSquare,
  FileText,
  Search,
  Download,
  ArrowRight,
  Zap,
  Shield,
  Globe,
  Sparkles,
  Check,
} from 'lucide-react'

const features = [
  {
    icon: Upload,
    title: 'Smart Upload',
    description: 'Drag & drop PDF, TXT, or DOCX files with automatic validation and processing.',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat',
    description: 'Ask questions about your documents and get accurate, source-backed answers.',
  },
  {
    icon: FileText,
    title: 'Auto Summary',
    description: 'Generate executive summaries, key points, and action items instantly.',
  },
  {
    icon: Search,
    title: 'Info Extraction',
    description: 'Extract names, dates, organizations, numbers, tasks, and deadlines.',
  },
  {
    icon: Download,
    title: 'Export',
    description: 'Download summaries as PDF or extracted data as JSON.',
  },
  {
    icon: Brain,
    title: 'RAG Pipeline',
    description: 'Retrieval-Augmented Generation ensures accurate, context-aware responses.',
  },
]

const techStack = [
  'React + Vite',
  'Tailwind CSS',
  'FastAPI',
  'PyMuPDF',
  'LangChain',
  'ChromaDB',
  'Sentence Transformers',
  'Ollama / Llama 3.1',
  'SQLAlchemy',
  'SQLite',
]

const steps = [
  { num: '01', title: 'Upload', desc: 'Drag & drop your document' },
  { num: '02', title: 'Process', desc: 'AI extracts and indexes content' },
  { num: '03', title: 'Interact', desc: 'Chat, summarize, or extract' },
  { num: '04', title: 'Export', desc: 'Download your results' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-dark-950/80 backdrop-blur-md border-b border-dark-700">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-white">Doc Intelligence</span>
          </div>
          <Link to="/dashboard" className="btn-primary">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-500/5 to-transparent" />
        <div className="max-w-7xl mx-auto px-6 py-24 md:py-32 text-center relative">
          <div className="inline-flex items-center gap-2 bg-primary-500/10 text-primary-400 text-sm font-medium px-4 py-1.5 rounded-full border border-primary-500/20 mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Document Analysis
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Intelligence Assistant
            <br />
            <span className="bg-gradient-to-r from-primary-400 to-primary-600 bg-clip-text text-transparent">
              for Your Documents
            </span>
          </h1>
          <p className="text-lg md:text-xl text-dark-300 max-w-2xl mx-auto mb-8">
            Upload any document and let AI help you understand it. Ask questions,
            generate summaries, extract key information — all running locally and for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/upload" className="btn-primary text-base px-8 py-3">
              <Upload className="w-5 h-5" />
              Upload Document
            </Link>
            <Link to="/dashboard" className="btn-secondary text-base px-8 py-3">
              View Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className="w-14 h-14 bg-primary-600/10 border border-primary-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold text-primary-400">{step.num}</span>
              </div>
              <h3 className="font-semibold text-white mb-1">{step.title}</h3>
              <p className="text-sm text-dark-400">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Features</h2>
        <p className="text-dark-400 text-center mb-12 max-w-xl mx-auto">
          Everything you need to analyze and interact with your documents using AI.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }, i) => (
            <div key={i} className="card-hover">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <Icon className="w-6 h-6 text-primary-400" />
              </div>
              <h3 className="font-semibold text-white mb-2">{title}</h3>
              <p className="text-sm text-dark-400 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Technology Stack</h2>
        <p className="text-dark-400 text-center mb-12">Built with modern, free, open-source technologies.</p>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {techStack.map((tech, i) => (
            <span
              key={i}
              className="bg-dark-800 border border-dark-700 text-dark-200 px-4 py-2 rounded-lg text-sm font-medium"
            >
              {tech}
            </span>
          ))}
        </div>
      </section>

      {/* Why */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="card bg-gradient-to-br from-dark-800 to-dark-900">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Zap className="w-8 h-8 text-primary-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">100% Free</h3>
              <p className="text-sm text-dark-400">No API keys, no paid services. Runs entirely on your machine.</p>
            </div>
            <div>
              <Shield className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Private & Secure</h3>
              <p className="text-sm text-dark-400">Your documents never leave your computer. Local processing only.</p>
            </div>
            <div>
              <Globe className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <h3 className="font-semibold text-white mb-1">Open Source</h3>
              <p className="text-sm text-dark-400">Built with open-source tools. Extend and customize freely.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-dark-700 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm text-dark-400">
            Built for InventaCore AI Intern Build Challenge 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
