'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

const CHAT_NAMESPACE = '/chat';

function getSocketBaseUrl(): string {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL! || 'http://localhost:8000';
  return wsUrl.replace(/\/$/, '');
}

function getOrCreateSessionId(): string {
  const STORAGE_KEY = 'chat-session-id';

  const stored = sessionStorage.getItem(STORAGE_KEY);
  if (stored) return stored;

  const id = crypto.randomUUID();
  sessionStorage.setItem(STORAGE_KEY, id);
  return id;
}

type PendingRequest = {
  resolve: (value: string) => void;
  reject: (error: Error) => void;
};

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const pendingRef = useRef<PendingRequest | null>(null);

  useEffect(() => {
    const baseUrl = getSocketBaseUrl();
    const socket = io(`${baseUrl}${CHAT_NAMESPACE}`, {
      withCredentials: true,
      transports: ['websocket'],
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      setIsConnected(false);

      if (reason !== 'io client disconnect')
        toast.error('Disconnected from chat server');

      pendingRef.current?.reject(new Error('Socket disconnected'));
      pendingRef.current = null;
    });

    socket.on('connect_error', (error) => {
      toast.error(`Failed to connect to chat server: ${error.message}`);
    });

    socket.on('response', (text: string) => {
      pendingRef.current?.resolve(text);
      pendingRef.current = null;
    });

    socket.on('error', ({ message }: { message: string }) => {
      toast.error(message);
      pendingRef.current?.reject(new Error(message));
      pendingRef.current = null;
    });

    return () => {
      pendingRef.current?.reject(new Error('Socket connection closed'));
      pendingRef.current = null;
      socket.removeAllListeners();
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  const sendMessage = useCallback((message: string): Promise<string> => {
    const socket = socketRef.current;

    if (!socket?.connected) {
      const error = new Error('Not connected to chat server');
      toast.error(error.message);
      return Promise.reject(error);
    }

    if (pendingRef.current) {
      const error = new Error('A message is already being processed');
      toast.error(error.message);
      return Promise.reject(error);
    }

    return new Promise((resolve, reject) => {
      pendingRef.current = { resolve, reject };
      socket.emit('message', {
        message,
        sessionId: getOrCreateSessionId(),
      });
    });
  }, []);

  return { isConnected, sendMessage };
}
