import { Link } from 'react-router-dom'
import {
  FileText,
  Search,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Table,
  Layers,
  ArrowUpRight,
  Command,
} from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] flex flex-col font-sans">
      {/* Top Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#111827] rounded-md flex items-center justify-center text-white font-mono text-xs font-bold">
              DP
            </div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm tracking-tight text-[#111827]">DocIntel Pro</span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono text-[#059669] bg-[#ECFDF5] border border-[#A7F3D0] rounded">v2.4 Production</span>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-6 text-xs text-[#4B5563] font-medium">
            <a href="#features" className="hover:text-[#111827] transition">Features</a>
            <a href="#verification" className="hover:text-[#111827] transition">Grounding Architecture</a>
            <a href="#compliance" className="hover:text-[#111827] transition">Enterprise Security</a>
          </div>

          <div className="flex items-center gap-3">
            <Link to="/dashboard" className="btn-secondary">
              Open App
            </Link>
            <Link to="/upload" className="btn-primary">
              Upload Document
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-16 pb-12 sm:pt-24 sm:pb-16 border-b border-[#E5E7EB] bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-[#F3F4F6] border border-[#E5E7EB] px-3 py-1 rounded-full text-xs text-[#374151]">
            <span className="w-2 h-2 rounded-full bg-[#059669]"></span>
            <span>Audit-Grade Document Parsing & Tabular Reconciliation</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#111827] max-w-4xl mx-auto leading-[1.12]">
            Read, verify, and reconcile complex contracts in seconds.
          </h1>

          <p className="text-base sm:text-lg text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Eliminate hours of manual document review. DocIntel Pro ingests multi-page PDFs, DOCX, and disclosures to extract verified covenants, numbers, and deadlines with citation-grounded accuracy.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link to="/dashboard" className="btn-primary text-sm px-5 py-2.5">
              Launch Workspace
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a href="#demo" className="btn-secondary text-sm px-5 py-2.5">
              View Document Sample
            </a>
          </div>

          <div className="pt-4 flex items-center justify-center gap-6 text-xs text-[#6B7280]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              Zero Hallucinations (Strict Grounding)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              Footnote Citations with Page Mapping
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              SOC2 Ready & Local Pipeline
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Mockup Demonstration (Linear / Notion Swiss Style) */}
      <section id="demo" className="py-12 bg-[#F9FAFB] border-b border-[#E5E7EB]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span className="font-mono uppercase tracking-wider font-medium text-[#374151]">Live Verification Console</span>
            <span className="font-mono">Processing: Syndicated_Facility_Agreement_2026.pdf (142 Pages)</span>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-xl shadow-card overflow-hidden">
            {/* Window title bar */}
            <div className="bg-[#F9FAFB] px-4 py-2.5 border-b border-[#E5E7EB] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#E5E7EB]"></span>
                <span className="text-xs font-mono text-[#4B5563] ml-2">DOCUMENT_INSPECTION_MODE</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="badge-ready">99.8% Grounded</span>
                <span className="kbd">⌘K Command Palette</span>
              </div>
            </div>

            {/* Split Screen Workspace Preview */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-[#E5E7EB]">
              {/* Left Column: Parsed Document Source */}
              <div className="md:col-span-7 p-6 space-y-4 font-mono text-xs bg-[#FCFCFD]">
                <div className="flex justify-between items-center text-[11px] text-[#6B7280] pb-2 border-b border-[#E5E7EB]">
                  <span>PAGE 48 • SECTION 14.2 (FINANCIAL COVENANTS)</span>
                  <span className="text-[#059669] font-medium">VERIFIED CITATION</span>
                </div>
                <div className="p-4 bg-white border border-[#E5E7EB] rounded-md text-[#374151] leading-relaxed space-y-2">
                  <p className="text-[#6B7280] text-[10px]">RAW PARSED SEGMENT #48102:</p>
                  <p>
                    "14.2 Debt Service Coverage Ratio: The Borrower covenants that for any trailing twelve-month calculation window, the ratio of Consolidated EBITDA to Debt Service Charges shall not fall below <span className="bg-[#FEF3C7] text-[#92400E] px-1.5 py-0.5 rounded font-semibold border border-[#FDE68A]">1.25 : 1.00</span>."
                  </p>
                </div>
                <div className="p-3 bg-[#ECFDF5] border border-[#A7F3D0] rounded-md text-[#065F46] text-[11px] flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 shrink-0 text-[#059669] mt-0.5" />
                  <div>
                    <span className="font-semibold">Grounding Verification:</span> Matched against un-redacted clause 14.2. Vector distance: 0.04 (Identical match).
                  </div>
                </div>
              </div>

              {/* Right Column: Structured Extraction Matrix */}
              <div className="md:col-span-5 p-6 space-y-4 bg-white">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-[#E5E7EB]">
                  <span className="font-semibold text-[#111827]">Extracted Entity Matrix</span>
                  <span className="text-[11px] text-[#6B7280]">3 Found</span>
                </div>

                <div className="space-y-2.5 text-xs">
                  <div className="p-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
                    <div>
                      <p className="font-medium text-[#111827]">Debt Service Cap (DSCR)</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">Page 48 §14.2</p>
                    </div>
                    <span className="font-mono font-semibold text-[#059669] bg-[#ECFDF5] px-2 py-0.5 rounded border border-[#A7F3D0]">≥ 1.25x</span>
                  </div>

                  <div className="p-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
                    <div>
                      <p className="font-medium text-[#111827]">Permitted Indebtedness</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">Page 112 Sched. 4</p>
                    </div>
                    <span className="font-mono font-semibold text-[#111827]">$25,000,000</span>
                  </div>

                  <div className="p-3 rounded-md border border-[#E5E7EB] bg-[#F9FAFB] flex justify-between items-center">
                    <div>
                      <p className="font-medium text-[#111827]">Governing Jurisdiction</p>
                      <p className="text-[10px] text-[#6B7280] font-mono">Page 138 §24.1</p>
                    </div>
                    <span className="font-mono text-[#374151]">Delaware, USA</span>
                  </div>
                </div>

                <Link to="/upload" className="w-full btn-primary justify-center text-xs py-2 mt-2">
                  Test With Your Own File
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-16 bg-white border-b border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-wider text-[#059669] font-semibold">Core Capabilities</span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111827] mt-1">
              Built for speed, accuracy, and enterprise diligence.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] space-y-3">
              <div className="w-8 h-8 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <Table className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-[#111827]">Tabular Entity Extraction</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Pulls names, covenants, monetary caps, organizations, and legal deadlines into structured JSON or downloadable summaries.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] space-y-3">
              <div className="w-8 h-8 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-[#111827]">RAG Vector Grounding</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Embeds document chunks with ChromaDB and Sentence Transformers. Every claim links back to its verified paragraph source.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-[#E5E7EB] bg-[#F9FAFB] space-y-3">
              <div className="w-8 h-8 rounded-md bg-white border border-[#E5E7EB] flex items-center justify-center text-[#111827]">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="font-semibold text-sm text-[#111827]">Audit Summarization</h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Generates executive summaries, key risk points, and action items tailored for board meetings, CFOs, and diligence teams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto bg-white py-8 border-t border-[#E5E7EB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#6B7280]">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-[#111827]">DocIntel Pro</span>
            <span>• High-Density Document Intelligence</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="hover:text-[#111827]">Dashboard</Link>
            <Link to="/upload" className="hover:text-[#111827]">Upload</Link>
            <Link to="/settings" className="hover:text-[#111827]">Settings</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
