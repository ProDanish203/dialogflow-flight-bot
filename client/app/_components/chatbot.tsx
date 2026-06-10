'use client';

import { useCallback, useState } from 'react';
import { useSocket } from '@/hooks/use-socket';
import { ChatbotInputArea } from './chatbot-input-area';
import { ChatbotMessages } from './chatbot-messages';
import type { ChatMessage } from './types';

export function Chatbot() {
  const { isConnected, sendMessage } = useSocket();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = useCallback(
    async (content: string) => {
      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: 'user',
        content,
        createdAt: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsLoading(true);

      try {
        const response = await sendMessage(content);

        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: 'assistant',
            content: response,
            createdAt: Date.now(),
          },
        ]);
      } catch {
      } finally {
        setIsLoading(false);
      }
    },
    [sendMessage],
  );

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <ChatbotMessages messages={messages} isLoading={isLoading} />
      <ChatbotInputArea
        onSubmit={handleSubmit}
        isLoading={isLoading || !isConnected}
      />
    </div>
  );
}
