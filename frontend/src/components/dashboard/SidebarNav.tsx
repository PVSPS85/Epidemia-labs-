// frontend/src/components/dashboard/SidebarNav.tsx
'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  Activity,
  LayoutDashboard,
  Database,
  UploadCloud,
  Map,
  LogOut,
  User,
} from 'lucide-react';

const NAV_ITEMS = [
  {
    href: '/dashboard',
    icon: LayoutDashboard,
    label: 'Simulation Grid',
    exact: true,
  },
  {
    href: '/dashboard/diseases',
    icon: Database,
    label: 'Disease Database',
    exact: false,
  },
  {
    href: '/dashboard/publications',
    icon: UploadCloud,
    label: 'Research Hub',
    exact: false,
  },
  {
    href: '/dashboard/map',
    icon: Map,
    label: 'Global Heatmap',
    exact: false,
  },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const isActive = (href: string, exact: boolean) =>
    exact ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="w-64 border-r border-border bg-background flex flex-col shrink-0 relative z-20">
      {/* Logo */}
      <div className="h-16 px-5 flex items-center gap-3 border-b border-border">
        <div className="w-9 h-9 bg-gradient-to-br from-secondary to-primary rounded-xl flex items-center justify-center shadow-glow-cyan shrink-0">
          <Activity className="w-4.5 h-4.5 text-white" />
        </div>
        <div className="overflow-hidden">
          <h1 className="text-sm font-bold tracking-tight text-white leading-none">Epidemia</h1>
          <p className="text-[10px] text-primary font-mono tracking-widest uppercase mt-0.5">
            Research Labs
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        <p className="text-[9px] font-mono text-textMuted uppercase tracking-[0.15em] px-3 pb-2 pt-1">
          Navigation
        </p>
        {NAV_ITEMS.map(({ href, icon: Icon, label, exact }) => {
          const active = isActive(href, exact);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group ${
                active
                  ? 'bg-primary/10 text-primary border border-primary/20 shadow-sm'
                  : 'text-textSecondary hover:text-white hover:bg-surface'
              }`}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-colors ${
                  active ? 'text-primary' : 'text-textMuted group-hover:text-textSecondary'
                }`}
              />
              {label}
              {active && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary animate-pulse-glow" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div className="p-3 border-t border-border space-y-1">
        {/* User chip */}
        {user && (
          <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-surface">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-secondary/40 to-primary/40 flex items-center justify-center shrink-0">
              <User className="w-3.5 h-3.5 text-textSecondary" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs text-white font-medium truncate leading-none">
                {user.email}
              </p>
              <p className="text-[10px] text-textMuted mt-0.5 truncate">{user.role}</p>
            </div>
          </div>
        )}

        {/* Logout */}
        <button
          id="sidebar-logout"
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm text-textSecondary hover:text-danger hover:bg-danger/10 transition-all duration-150 group"
        >
          <LogOut className="w-4 h-4 shrink-0 group-hover:text-danger transition-colors" />
          Secure Logout
        </button>
      </div>
    </aside>
  );
}
