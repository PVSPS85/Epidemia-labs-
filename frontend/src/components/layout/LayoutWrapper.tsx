'use client';

import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { Toaster } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, hydrateFromStorage } = useAuthStore();
  const [hydrated, setHydrated] = useState(false);

  // Rehydrate auth state from localStorage on mount
  useEffect(() => {
    hydrateFromStorage();
    setHydrated(true);
  }, [hydrateFromStorage]);

  // Route protection: redirect to login if not authenticated on protected routes
  useEffect(() => {
    if (!hydrated) return; // Wait for hydration before checking
    const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';
    if (!isAuthRoute && !isAuthenticated) {
      router.replace('/');
    }
  }, [hydrated, isAuthenticated, pathname, router]);

  // Routes that are public (no shell)
  const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';

  // Show nothing until hydration completes (prevents flash of wrong layout)
  if (!hydrated) {
    return null;
  }

  return (
    <>
      {/* Single global sidebar — only on authenticated routes */}
      {!isAuthRoute && <Sidebar />}
      {!isAuthRoute && <TopNavbar />}

      <main
        className={`${
          !isAuthRoute ? 'pl-[240px] pt-[64px]' : ''
        } min-h-screen bg-void text-textPrimary`}
      >
        {/*
          FIXED: Removed AnimatePresence mode="wait" which was blocking
          Next.js client-side navigation. Pages now mount instantly on
          Link clicks without requiring a manual refresh.
          Using a simple fade-in animation per page instead.
        */}
        <motion.div
          key={pathname}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className={!isAuthRoute ? 'p-8' : ''}
        >
          {children}
        </motion.div>
      </main>

      <Toaster
        theme="dark"
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'var(--bg-surface)',
            border: '1px solid var(--bg-border)',
            color: 'var(--text-primary)',
          },
        }}
      />
    </>
  );
}
