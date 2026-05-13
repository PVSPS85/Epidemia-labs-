import { ReactNode } from 'react';
import Link from 'next/link';
import { Activity, LayoutDashboard, Database, UploadCloud, Map, LogOut } from 'lucide-react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-[#0B0E14] text-white overflow-hidden font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-64 border-r border-[#1C212B] bg-[#0B0E14] flex flex-col relative z-20">
        <div className="p-6 flex items-center gap-3 border-b border-[#1C212B]">
          <div className="w-10 h-10 bg-gradient-to-br from-[#A855F7] to-[#00D1FF] rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(0,209,255,0.3)]">
            <Activity className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white">Epidemia</h1>
            <p className="text-[10px] text-[#00D1FF] font-mono tracking-widest uppercase">Research Labs</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-[#00D1FF]/10 text-[#00D1FF] font-medium border border-[#00D1FF]/20 transition-all">
            <LayoutDashboard className="w-5 h-5" />
            Simulation Grid
          </Link>
          <Link href="/dashboard/diseases" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1C212B] transition-all">
            <Database className="w-5 h-5" />
            Disease Database
          </Link>
          <Link href="/dashboard/publications" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1C212B] transition-all">
            <UploadCloud className="w-5 h-5" />
            Research Hub
          </Link>
          <Link href="/dashboard/map" className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:text-white hover:bg-[#1C212B] transition-all">
            <Map className="w-5 h-5" />
            Global Heatmap
          </Link>
        </nav>

        <div className="p-4 border-t border-[#1C212B]">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-all">
            <LogOut className="w-5 h-5" />
            Secure Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative overflow-y-auto">
        {/* Ambient Glow */}
        <div className="absolute top-0 left-1/4 w-full h-96 bg-[#A855F7]/5 rounded-full blur-[150px] pointer-events-none"></div>
        {children}
      </main>
    </div>
  );
}
