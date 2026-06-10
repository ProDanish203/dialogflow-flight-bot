'use client';

import { useEffect, useRef } from 'react';
import { Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ChatMessage } from './chat-message';
import type { ChatMessage as ChatMessageType } from './types';

type ChatbotMessagesProps = {
  messages: ChatMessageType[];
  isLoading?: boolean;
};

export function ChatbotMessages({ messages, isLoading }: ChatbotMessagesProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isLoading]);

  return (
    <div
      ref={scrollContainerRef}
      className="min-h-0 flex-1 overflow-y-auto overscroll-contain"
    >
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-4 md:p-6">
        {messages.length === 0 && !isLoading ? (
          <div className="flex min-h-[calc(100svh-14rem)] items-center justify-center">
            <p className="text-sm text-muted-foreground">
              Send a message to start the conversation.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
              />
            ))}
            {isLoading && (
              <div className="flex w-full gap-3">
                <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                  <Bot className="size-4" />
                </div>
                <div
                  className={cn(
                    'flex items-center gap-1 rounded-lg border border-border bg-card px-4 py-3',
                  )}
                >
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground" />
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
