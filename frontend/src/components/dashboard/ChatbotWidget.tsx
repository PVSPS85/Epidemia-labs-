// frontend/src/components/dashboard/ChatbotWidget.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { useSimulationStore } from '@/store/simulationStore';
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
      content: 'Hello! I am the Epidemia AI Assistant powered by Gemini. Ask me anything about epidemiology, disease spread, or try commands like "Change R0 to 4.5" or "Set population to 5M".',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fix: destructure flat fields from simulationStore (not nested params)
  const { beta, gamma, N, setParams, runSimulation } = useSimulationStore();

  // Auto-scroll to bottom of chat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const currentInput = input.trim().toLowerCase();
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    // --- LOCAL SIMULATION CONTROL ---
    let handledLocally = false;
    let replyText = '';

    const r0Match = currentInput.match(/r0[^\d]*(\d+\.?\d*)/);
    if (r0Match && r0Match[1]) {
      const newR0 = parseFloat(r0Match[1]);
      // Fix: set beta directly on flat store fields
      setParams({ beta: newR0 * gamma });
      replyText = `I have updated the Basic Reproduction Number (R₀) to ${newR0}. The simulation has been refreshed.`;
      handledLocally = true;
    }

    const popMatch = currentInput.match(/population[^\d]*(\d+\.?\d*[km]?)/);
    if (popMatch && popMatch[1]) {
      let popStr = popMatch[1];
      let multiplier = 1;
      if (popStr.includes('k')) multiplier = 1000;
      if (popStr.includes('m')) multiplier = 1000000;
      const newPop = parseFloat(popStr.replace(/[km]/, '')) * multiplier;
      if (!isNaN(newPop)) {
        setParams({ N: newPop });
        replyText = `I have updated the population size (N) to ${newPop.toLocaleString()}. The simulation has been refreshed.`;
        handledLocally = true;
      }
    }

    if (handledLocally) {
      runSimulation();
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: replyText,
      }]);
      setLoading(false);
      return;
    }
    // -----------------------------------

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage.content, context: '' }),
      });
      const data = await res.json();

      const answerText = data.answer || "I couldn't generate a response. Please try rephrasing.";
      setMessages((prev) => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: answerText,
      }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: 'assistant',
          content: '⚠️ Could not connect to AI service. Please ensure the Gemini API key is configured.',
        },
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
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-br from-action-primary to-blue-700 rounded-full flex items-center justify-center shadow-glow-blue hover:scale-110 transition-transform duration-300 z-50 group"
        >
          <Sparkles className="w-6 h-6 text-white group-hover:animate-pulse" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] bg-surface border border-border rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden animate-slide-up">
          {/* Header */}
          <div className="bg-base border-b border-border p-4 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-action-primary/20 flex items-center justify-center border border-action-primary/30">
                <Bot className="w-4 h-4 text-action-primary" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-textPrimary leading-tight">Epidemia AI</h3>
                <p className="text-[10px] text-action-primary font-mono tracking-widest uppercase mt-0.5">Powered by Gemini</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-lg hover:bg-raised flex items-center justify-center text-textMuted hover:text-textPrimary transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-void/50">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                  msg.role === 'user'
                    ? 'bg-action-primary/20 text-action-primary'
                    : 'bg-sir-recovered/20 text-sir-recovered'
                }`}>
                  {msg.role === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
                </div>

                {/* Bubble */}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                  msg.role === 'user'
                    ? 'bg-action-primary text-white rounded-tr-none shadow-glow-blue'
                    : 'bg-surface border border-border text-textSecondary rounded-tl-none leading-relaxed whitespace-pre-wrap'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-3 flex-row">
                <div className="w-7 h-7 rounded-full bg-sir-recovered/20 text-sir-recovered flex items-center justify-center shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <div className="bg-surface border border-border rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-action-primary/60 rounded-full animate-bounce" />
                  <div className="w-1.5 h-1.5 bg-action-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-action-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
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
                className="w-full bg-base border border-border rounded-xl pl-4 pr-12 py-3 text-textPrimary placeholder:text-textMuted focus:outline-none focus:border-action-primary transition-colors"
                disabled={loading}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                className="absolute right-2 w-8 h-8 bg-action-primary text-white rounded-lg flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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
