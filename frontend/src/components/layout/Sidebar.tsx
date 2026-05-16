'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Home, Stethoscope, Map as MapIcon, BarChart2, 
  Bell, Bookmark, Settings, LogOut, Activity
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuthStore();

  const discoverNav = [
    { name: 'Dashboard', path: '/dashboard', icon: Home },
    { name: 'Diseases', path: '/dashboard/diseases', icon: Stethoscope },
    { name: 'Live Map', path: '/dashboard/map', icon: MapIcon },
    { name: 'Simulations', path: '/dashboard/simulations', icon: BarChart2 },
  ];

  const toolsNav = [
    { name: 'Alerts', path: '/dashboard/alerts', icon: Bell },
    { name: 'Saved', path: '/dashboard/saved', icon: Bookmark },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  const NavItem = ({ item }: { item: any }) => {
    const isActive = pathname === item.path || pathname.startsWith(item.path + '/');
    const Icon = item.icon;
    
    return (
      <Link 
        href={item.path}
        className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 group relative ${
          isActive 
            ? 'bg-action-primary/10 text-action-primary' 
            : 'text-textSecondary hover:text-textPrimary hover:bg-surface-2'
        }`}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-action-primary rounded-r-full" />
        )}
        <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.5} />
        <span className="text-sm font-medium">{item.name}</span>
      </Link>
    );
  };

  return (
    <aside className="fixed left-0 top-0 w-[240px] h-screen bg-bg-base border-r border-bg-border flex flex-col z-50">
      {/* Header */}
      <div className="h-16 flex items-center gap-3 px-6 flex-shrink-0">
        <div className="w-8 h-8 rounded-lg bg-action-primary/20 border border-action-primary/30 flex items-center justify-center text-action-primary shadow-glow-blue">
          <Activity className="w-4 h-4" />
        </div>
        <div className="font-semibold text-textPrimary text-base tracking-tight">
          Epidemia-Labs
        </div>
      </div>

      {/* Nav Content */}
      <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
        <div className="px-6 mb-2 text-[11px] font-semibold text-textMuted tracking-[0.1em] uppercase">
          Discover
        </div>
        <div className="space-y-1 mb-8">
          {discoverNav.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>

        <div className="px-6 mb-2 text-[11px] font-semibold text-textMuted tracking-[0.1em] uppercase">
          Tools
        </div>
        <div className="space-y-1">
          {toolsNav.map((item) => (
            <NavItem key={item.path} item={item} />
          ))}
        </div>
        
        {user?.role === 'publisher' && (
          <>
            <div className="px-6 mt-8 mb-2 text-[11px] font-semibold text-textMuted tracking-[0.1em] uppercase">
              Publisher
            </div>
            <div className="space-y-1">
              <NavItem item={{ name: 'Dashboard', path: '/publisher', icon: BarChart2 }} />
              <NavItem item={{ name: 'Publish New', path: '/publish/new', icon: Bookmark }} />
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-bg-border flex-shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-xl bg-bg-surface border border-bg-border">
          <div className="w-9 h-9 rounded-full bg-surface-2 flex items-center justify-center overflow-hidden">
            {user?.avatar ? (
              <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <div className="text-textSecondary text-sm font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-textPrimary truncate">
              {user?.name || 'User'}
            </div>
            <div className="text-xs text-textMuted capitalize truncate">
              {user?.role || 'Viewer'}
            </div>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 text-textMuted hover:text-action-danger transition-colors rounded-md hover:bg-bg-raised"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}
