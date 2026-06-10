import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MessageRole } from './types';

type ChatMessageProps = {
  role: MessageRole;
  content: string;
};

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={cn(
        'flex w-full gap-3',
        isUser ? 'flex-row-reverse' : 'flex-row',
      )}
    >
      <div
        className={cn(
          'flex size-8 shrink-0 items-center justify-center rounded-lg',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-muted-foreground',
        )}
      >
        {isUser ? <User className="size-4" /> : <Bot className="size-4" />}
      </div>
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-2.5 text-sm leading-relaxed md:max-w-[75%]',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'border border-border bg-card text-card-foreground',
        )}
      >
        <p className="wrap-break-word whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
}
