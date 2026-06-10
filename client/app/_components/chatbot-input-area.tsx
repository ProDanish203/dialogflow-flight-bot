'use client';

import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

type ChatbotInputAreaProps = {
  onSubmit: (message: string) => void | Promise<void>;
  isLoading?: boolean;
  className?: string;
};

export function ChatbotInputArea({
  onSubmit,
  isLoading = false,
  className,
}: ChatbotInputAreaProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = message.trim();
    if (!trimmed || isLoading) return;

    setMessage('');
    await onSubmit(trimmed);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      event.currentTarget.form?.requestSubmit();
    }
  };

  return (
    <div
      className={cn('shrink-0 border-t border-border bg-background', className)}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex w-full max-w-3xl items-end gap-2 p-4 md:gap-3 md:p-6"
      >
        <Textarea
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          className="max-h-32 min-h-10 resize-none"
        />
        <Button
          type="submit"
          size="icon"
          disabled={!message.trim() || isLoading}
          aria-label="Send message"
        >
          <Send />
        </Button>
      </form>
    </div>
  );
}
