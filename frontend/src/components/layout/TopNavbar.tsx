'use client';

import { usePathname } from 'next/navigation';
import { Search, Bell, ChevronDown } from 'lucide-react';

export default function TopNavbar() {
  const pathname = usePathname();

  // Simple logic to derive title from pathname
  const getPageTitle = () => {
    if (pathname === '/dashboard') return 'Dashboard';
    if (pathname.startsWith('/dashboard/')) {
      const parts = pathname.split('/');
      return parts[2].charAt(0).toUpperCase() + parts[2].slice(1);
    }
    if (pathname.startsWith('/disease/')) return 'Disease Details';
    if (pathname.startsWith('/publisher')) return 'Publisher Dashboard';
    if (pathname.startsWith('/publish/new')) return 'Publish Research';
    return 'Epidemia-Labs';
  };

  return (
    <header className="fixed top-0 left-[240px] right-0 h-[64px] bg-bg-base/80 backdrop-blur-md border-b border-bg-border z-40 flex items-center justify-between px-8">
      {/* Left: Page Title */}
      <h1 className="text-xl font-semibold text-textPrimary">
        {getPageTitle()}
      </h1>

      {/* Center: Search */}
      <div className="hidden md:flex flex-1 max-w-[400px] mx-8">
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textMuted" />
          <input 
            type="text" 
            placeholder="Search diseases, regions, or simulations..." 
            className="w-full bg-bg-surface border border-bg-border rounded-full py-2 pl-10 pr-4 text-sm text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-action-primary focus:ring-1 focus:ring-action-primary transition-all"
          />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-4">
        <button className="relative p-2 text-textSecondary hover:text-textPrimary transition-colors rounded-full hover:bg-bg-surface">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-action-danger rounded-full ring-2 ring-bg-base"></span>
        </button>
        <div className="flex items-center gap-2 cursor-pointer hover:bg-bg-surface p-1 pr-2 rounded-full transition-colors">
          <div className="w-8 h-8 rounded-full bg-surface-2 overflow-hidden border border-bg-border">
            {/* Placeholder avatar */}
          </div>
          <ChevronDown className="w-4 h-4 text-textMuted" />
        </div>
      </div>
    </header>
  );
}
