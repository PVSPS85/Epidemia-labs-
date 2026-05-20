'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import {
  Home, Stethoscope, Map as MapIcon, BarChart2,
  Bell, Bookmark, Settings, LogOut, Activity,
  PenSquare,
} from 'lucide-react';

const discoverNav = [
  { name: 'Dashboard',   path: '/dashboard',             icon: Home },
  { name: 'Diseases',    path: '/dashboard/diseases',    icon: Stethoscope },
  { name: 'Live Map',    path: '/dashboard/map',         icon: MapIcon },
  { name: 'Simulations', path: '/dashboard/simulations', icon: BarChart2 },
];

const toolsNav = [
  { name: 'Alerts',   path: '/dashboard/alerts',   icon: Bell },
  { name: 'Saved',    path: '/dashboard/saved',    icon: Bookmark },
  { name: 'Settings', path: '/dashboard/settings', icon: Settings },
];

function NavItem({ item }: { item: { name: string; path: string; icon: any } }) {
  const pathname = usePathname();
  const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
  const Icon = item.icon;

  return (
    <Link
      href={item.path}
      className={`relative flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 group ${
        isActive
          ? 'bg-action-primary/10 text-action-primary'
          : 'text-textSecondary hover:text-textPrimary hover:bg-raised'
      }`}
    >
      {/* Active left bar */}
      {isActive && (
        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 bg-action-primary rounded-r-full" />
      )}
      <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.5} />
      <span className="text-body-md font-medium">{item.name}</span>
    </Link>
  );
}

function NavSection({ label, items }: { label: string; items: any[] }) {
  return (
    <div className="mb-6">
      <p className="px-6 mb-1.5 text-[10px] font-semibold text-textMuted tracking-[0.12em] uppercase">
        {label}
      </p>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavItem key={item.path} item={item} />
        ))}
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  return (
    <aside className="fixed left-0 top-0 w-[240px] h-screen bg-base border-r border-border flex flex-col z-50">
      {/* Logo Header */}
      <div className="h-16 flex items-center gap-3 px-6 flex-shrink-0 border-b border-border">
        <div className="w-8 h-8 rounded-lg bg-action-primary/20 border border-action-primary/30 flex items-center justify-center text-action-primary shadow-glow-blue flex-shrink-0">
          <Activity className="w-4 h-4" />
        </div>
        <span className="font-bold text-base text-textPrimary tracking-tight">
          Epidemia<span className="text-action-primary">-Labs</span>
        </span>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-5 scrollbar-hide">
        <NavSection label="Discover" items={discoverNav} />
        <NavSection label="Tools"    items={toolsNav} />

        {user?.role === 'publisher' && (
          <NavSection
            label="Publisher"
            items={[
              { name: 'My Dashboard', path: '/publisher',   icon: BarChart2 },
              { name: 'Publish New',  path: '/publish/new', icon: PenSquare },
            ]}
          />
        )}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-border flex-shrink-0">
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-surface border border-border">
          {/* Avatar */}
          <div className="w-9 h-9 rounded-full bg-raised flex items-center justify-center overflow-hidden flex-shrink-0">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <span className="text-textSecondary text-sm font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>

          {/* Name + role */}
          <div className="flex-1 min-w-0">
            <p className="text-body-sm font-semibold text-textPrimary truncate">
              {user?.name || 'Researcher'}
            </p>
            <p className="text-[11px] text-textMuted capitalize">
              {user?.role || 'viewer'}
            </p>
          </div>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-1.5 text-textMuted hover:text-action-danger transition-colors rounded-md hover:bg-raised"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
