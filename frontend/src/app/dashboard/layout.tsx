// frontend/src/app/dashboard/layout.tsx
import { ReactNode } from 'react';
import ChatbotWidget from '@/components/dashboard/ChatbotWidget';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-screen">
      {/* Ambient background glow — cosmetic only */}
      <div className="pointer-events-none fixed top-0 right-0 w-[600px] h-[600px] bg-action-primary/3 rounded-full blur-[160px]" />
      <div className="pointer-events-none fixed bottom-0 left-[240px] w-[400px] h-[400px] bg-sir-infected/3 rounded-full blur-[120px]" />

      <div className="relative z-10">
        {children}
      </div>

      {/* AI Chatbot Widget */}
      <ChatbotWidget />
    </div>
  );
}
