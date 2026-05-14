// frontend/src/components/dashboard/ChatbotWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { api } from '@/lib/api';
import { MessageSquare, X, Send, Bot, User, Loader2, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I am the Epidemia AI Assistant. How can I help you analyze disease data or SIR simulations today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await api.chatWithAI(userMessage.content);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.data.answer || "I'm sorry, I couldn't process that request.",
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString(), role: 'assistant', content: '⚠️ Error connecting to AI. Please ensure your Gemini API key is configured.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-secondary to-primary rounded-full flex items-center justify-center shadow-glow-cyan hover:scale-110 transition-transform duration-300 z-50 group"
        >
          <Sparkles className="w-6 h-6 text-white group-hover:animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-surface-2 border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-surface border-b border-border p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30">
                <Bot className="w-4 h-4 text-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">Epidemia AI</h3>
                <p className="text-[10px] text-primary font-mono tracking-widest uppercase mt-0.5">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-textMuted hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user' ? 'bg-secondary/20 text-secondary' : 'bg-primary/20 text-primary'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>
                
                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user' 
                    ? 'bg-secondary text-white rounded-tr-none shadow-glow-purple border-none' 
                    : 'bg-surface border border-border text-textSecondary rounded-tl-none leading-relaxed whitespace-pre-wrap'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 flex-row">
                <div className="w-7 h-7 rounded-full bg-primary/20 text-primary flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-surface border border-border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-surface border-t border-border shrink-0">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Ask about epidemiological models..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                className="w-full bg-background border border-border rounded-xl pl-4 pr-12 py-3 text-sm text-white placeholder-textMuted focus:outline-none focus:border-primary transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 w-8 h-8 bg-primary text-background rounded-lg flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </div>
            <p className="text-[10px] text-center text-textMuted mt-2 font-mono">
              AI can make mistakes. Verify critical research data.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
