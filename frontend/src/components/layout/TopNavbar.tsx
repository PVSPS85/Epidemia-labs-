'use client';

import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { Search, Bell, ChevronDown, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard':             'Dashboard',
  '/dashboard/diseases':    'Diseases',
  '/dashboard/map':         'Live Map',
  '/dashboard/simulations': 'Simulations',
  '/dashboard/alerts':      'Alerts',
  '/dashboard/saved':       'Saved',
  '/dashboard/settings':    'Settings',
  '/publisher':             'Publisher Dashboard',
  '/publish/new':           'Publish Research',
};

function LiveClock() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    // Set initial time on mount (client only) to avoid hydration mismatch
    setNow(new Date());
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (!now) return null;

  const timeStr = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  });
  const dateStr = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface border border-border">
      <Clock className="w-3.5 h-3.5 text-action-primary flex-shrink-0" />
      <div className="flex flex-col leading-none">
        <span className="font-mono text-xs font-bold text-textPrimary tracking-wider">{timeStr}</span>
        <span className="text-[10px] text-textMuted mt-0.5">{dateStr}</span>
      </div>
    </div>
  );
}

export default function TopNavbar() {
  const pathname = usePathname();
  const { user } = useAuthStore();

  const getPageTitle = () => {
    if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
    if (pathname.startsWith('/disease/')) return 'Disease Details';
    if (pathname.startsWith('/publish/edit/')) return 'Edit Publication';
    return 'Epidemia-Labs';
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-[64px] bg-base/80 backdrop-blur-md border-b border-border z-40 flex items-center justify-between px-8">
      {/* Left: Page Title */}
      <h1 className="text-heading-md font-semibold text-textPrimary whitespace-nowrap">
        {getPageTitle()}
      </h1>

      {/* Center: Global Search */}
      <div className="hidden md:flex flex-1 max-w-[400px] mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input
            type="text"
            placeholder="Search diseases, regions, simulations…"
            className="w-full bg-surface border border-border rounded-full py-2 pl-10 pr-4 text-body-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
          />
        </div>
      </div>

      {/* Right: Live Clock + Actions */}
      <div className="flex items-center gap-3">
        {/* Real-time clock */}
        <LiveClock />

        {/* Notification bell */}
        <button className="relative p-2 text-textSecondary hover:text-textPrimary transition-colors rounded-full hover:bg-surface">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-action-danger rounded-full ring-2 ring-base" />
        </button>

        {/* Avatar dropdown */}
        <button className="flex items-center gap-2 cursor-pointer hover:bg-surface p-1 pr-2.5 rounded-full transition-colors border border-transparent hover:border-border">
          <div className="w-8 h-8 rounded-full overflow-hidden border border-border bg-raised flex items-center justify-center">
            {user?.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <span className="text-textSecondary text-sm font-semibold">
                {user?.name?.charAt(0) || 'U'}
              </span>
            )}
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-textMuted" />
        </button>
      </div>
    </header>
  );
}
