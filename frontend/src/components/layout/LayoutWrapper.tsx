'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { Toaster } from 'sonner';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Routes that are public (no shell)
  const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';

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
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className={!isAuthRoute ? 'p-8' : ''}
          >
            {children}
          </motion.div>
        </AnimatePresence>
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
