'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Bug, FileText, Settings, Database, ActivitySquare } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Command Center', icon: LayoutDashboard },
  { href: '/disease', label: 'Pathogen DB', icon: Bug },
  { href: '/publish', label: 'Research Terminal', icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();

  if (pathname === '/') {
    return null;
  }

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-surface/95 backdrop-blur-md border-r border-border flex flex-col justify-between py-6 z-40 hidden md:flex transition-all">
      <div className="flex flex-col gap-2 px-4">
        <h2 className="text-xs font-bold text-textSecondary uppercase tracking-[0.2em] mb-4 pl-3">
          Grid Modules
        </h2>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]'
                  : 'text-textSecondary hover:text-white hover:bg-background'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium text-sm">{item.label}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_rgba(16,185,129,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="px-4">
        <div className="p-4 bg-background border border-border rounded-xl">
          <div className="flex items-center gap-2 text-primary mb-2">
            <ActivitySquare className="w-4 h-4 animate-pulse" />
            <span className="text-xs font-bold uppercase">System Status</span>
          </div>
          <div className="flex justify-between items-center text-xs text-textSecondary mb-1">
            <span>API Link</span>
            <span className="text-primary">Secured</span>
          </div>
          <div className="flex justify-between items-center text-xs text-textSecondary">
            <span>Server Load</span>
            <span>23%</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
