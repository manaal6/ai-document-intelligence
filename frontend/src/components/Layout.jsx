import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard,
  Upload,
  Settings,
  FileText,
  Menu,
  X,
  ShieldCheck,
  Search,
} from 'lucide-react'
import { useState } from 'react'

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/upload', icon: Upload, label: 'Upload Document' },
  { to: '/settings', icon: Settings, label: 'LLM & Ingestion Settings' },
]

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="min-h-screen flex bg-[#F9FAFB] text-[#111827] font-sans">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-60 bg-white border-r border-[#E5E7EB] flex flex-col transform transition-transform duration-150 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand header */}
        <div className="h-14 px-5 border-b border-[#E5E7EB] flex items-center gap-2.5">
          <div className="w-6 h-6 bg-[#111827] rounded flex items-center justify-center text-white font-mono text-xs font-bold">
            DP
          </div>
          <NavLink to="/dashboard" className="flex items-center gap-2">
            <span className="font-semibold text-sm tracking-tight text-[#111827]">DocIntel Pro</span>
            <span className="text-[10px] font-mono px-1.5 py-0.2 bg-[#F3F4F6] text-[#4B5563] rounded border border-[#E5E7EB]">v2.4</span>
          </NavLink>
        </div>

        {/* Navigation list */}
        <div className="p-3">
          <p className="px-2 pb-2 text-[10px] font-mono uppercase tracking-wider text-[#9CA3AF] font-semibold">Workspace</p>
          <nav className="space-y-1">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all duration-150 ${
                    isActive
                      ? 'bg-[#F3F4F6] text-[#111827] font-semibold'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-[#F9FAFB]'
                  }`
                }
              >
                <Icon className="w-4 h-4 text-[#6B7280]" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Audit status card in sidebar footer */}
        <div className="mt-auto p-3 border-t border-[#E5E7EB]">
          <div className="p-2.5 rounded-md bg-[#F9FAFB] border border-[#E5E7EB] space-y-1">
            <div className="flex items-center justify-between text-[10px] font-mono">
              <span className="text-[#6B7280]">GROUNDING ENGINE</span>
              <span className="text-[#059669] font-semibold">ACTIVE</span>
            </div>
            <p className="text-[11px] text-[#4B5563] leading-snug">ChromaDB + Sentence Transformers</p>
          </div>
        </div>
      </aside>

      {/* Main content viewport */}
      <main className="flex-1 min-h-screen flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E7EB] h-14">
          <div className="flex items-center justify-between px-4 sm:px-6 h-full">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 text-[#4B5563] hover:text-[#111827] rounded-md hover:bg-[#F3F4F6]"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-[#6B7280] hidden sm:inline">Workspace /</span>
                <span className="text-xs font-semibold text-[#111827] capitalize">
                  {location.pathname.split('/').filter(Boolean).pop() || 'Dashboard'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#F3F4F6] border border-[#E5E7EB] text-[11px] text-[#4B5563] font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                <span>Zero Hallucination Filter</span>
              </div>
              <div className="w-7 h-7 bg-[#111827] text-white rounded-full flex items-center justify-center text-xs font-semibold">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Viewport content */}
        <div className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
