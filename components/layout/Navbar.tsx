// components/layout/Navbar.tsx
'use client';

import Link from 'next/link';
import { useAuthStore } from '@/store/authStore';
import { Activity, LogOut, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  return (
    <nav className="fixed top-0 w-full h-16 bg-surface/80 backdrop-blur-md border-b border-border z-50 px-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2 text-primary hover:opacity-80 transition">
        <Activity className="w-6 h-6" />
        <span className="font-bold text-xl tracking-tight text-white">Epidemia<span className="text-primary">-Labs</span></span>
      </Link>

      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <div className="flex items-center gap-2 text-sm text-textSecondary bg-background px-3 py-1.5 rounded-full border border-border">
              <UserIcon className="w-4 h-4" />
              <span>{user?.email}</span>
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">{user?.role}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="p-2 text-textSecondary hover:text-danger hover:bg-danger/10 rounded-md transition"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </>
        ) : (
          <span className="text-sm text-textSecondary">System Locked</span>
        )}
      </div>
    </nav>
  );
}
