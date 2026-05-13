import { useState } from 'react';
import { Send, X, Terminal } from 'lucide-react';
import ChatMessage from './ChatMessage';

interface Props {
  onClose: () => void;
}

export default function ChatbotWindow({ onClose }: Props) {
  const [input, setInput] = useState('');
  // Starting with a default AI greeting
  const [messages, setMessages] = useState([
    { role: 'ai' as const, content: 'Epidemia AI initialized. How can I assist your research today?' }
  ]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    setInput('');

    // Simulate AI thinking then responding
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        content: 'I am currently operating in UI prototype mode. The Python NLP backend connection is pending.' 
      }]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-24 right-6 w-[380px] h-[500px] bg-surface/95 backdrop-blur-xl border border-border rounded-2xl shadow-2xl shadow-black/80 flex flex-col z-50 overflow-hidden animate-in slide-in-from-bottom-5">
      {/* Header */}
      <div className="h-14 border-b border-border bg-background/50 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-primary" />
          <span className="font-bold text-white text-sm">Research Assistant</span>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-danger/20 hover:text-danger rounded transition text-textSecondary">
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Chat History */}
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {messages.map((msg, i) => (
          <ChatMessage key={i} role={msg.role} content={msg.content} />
        ))}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-background border-t border-border">
        <form onSubmit={handleSend} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Query the database..."
            className="w-full bg-surface border border-border rounded-xl py-3 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-primary transition"
          />
          <button 
            type="submit" 
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
