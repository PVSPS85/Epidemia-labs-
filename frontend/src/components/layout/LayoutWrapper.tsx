'use client';

import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import TopNavbar from './TopNavbar';
import { Toaster } from 'sonner';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Define routes that shouldn't have sidebar/navbar
  const isAuthRoute = pathname === '/' || pathname === '/login' || pathname === '/signup';

  return (
    <>
      {!isAuthRoute && <Sidebar />}
      {!isAuthRoute && <TopNavbar />}
      
      <main className={`${!isAuthRoute ? 'pl-[240px] pt-[64px]' : ''} min-h-screen bg-bg-base text-textPrimary`}>
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
      
      <Toaster theme="dark" position="bottom-right" />
    </>
  );
}
