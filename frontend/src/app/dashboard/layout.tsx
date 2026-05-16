// frontend/src/app/dashboard/layout.tsx
import { ReactNode } from 'react';
import SidebarNav from '@/components/dashboard/SidebarNav';
import ChatbotWidget from '@/components/dashboard/ChatbotWidget';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {/* Ambient background glow */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-primary/4 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10">
        {children}
      </div>
      
      {/* Global AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
