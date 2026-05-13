import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import ChatbotButton from '@/components/chatbot/ChatbotButton';

export const metadata: Metadata = {
  title: 'Epidemia-Labs | Global Disease Simulator',
  description: 'High-fidelity epidemiological simulation and research platform.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-textPrimary min-h-screen flex flex-col antialiased">
        <Navbar />
        {/* pt-16 pushes the content down so the fixed navbar doesn't cover it */}
        <main className="flex-grow pt-16 pb-12">
          {children}
        </main>
        <Footer />
        <ChatbotButton />
      </body>
    </html>
  );
}