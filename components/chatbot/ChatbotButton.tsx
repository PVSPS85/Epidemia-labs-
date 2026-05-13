'use client';

import { useState } from 'react';
import { MessageSquareText } from 'lucide-react';
import ChatbotWindow from './ChatbotWindow';

export default function ChatbotButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 text-background rounded-full shadow-lg shadow-primary/20 flex items-center justify-center transition hover:scale-105 z-50"
      >
        <MessageSquareText className="w-6 h-6" />
      </button>

      {isOpen && <ChatbotWindow onClose={() => setIsOpen(false)} />}
    </>
  );
}
