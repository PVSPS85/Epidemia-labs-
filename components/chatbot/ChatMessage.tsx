import { Bot, User } from 'lucide-react';

interface Props {
  role: 'user' | 'ai';
  content: string;
}

export default function ChatMessage({ role, content }: Props) {
  const isAI = role === 'ai';

  return (
    <div className={`flex w-full gap-3 mb-4 ${isAI ? 'justify-start' : 'justify-end'}`}>
      {isAI && (
        <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary flex items-center justify-center flex-shrink-0">
          <Bot className="w-4 h-4 text-primary" />
        </div>
      )}
      
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
        isAI 
          ? 'bg-surface border border-border text-textPrimary rounded-tl-none' 
          : 'bg-primary text-background font-medium rounded-tr-none'
      }`}>
        {content}
      </div>

      {!isAI && (
        <div className="w-8 h-8 rounded-full bg-textSecondary flex items-center justify-center flex-shrink-0">
          <User className="w-4 h-4 text-background" />
        </div>
      )}
    </div>
  );
}
