import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './use-auth';

type Message = {
  type: 'system' | 'message';
  content: string;
  sender?: string;
  timestamp: string;
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (content: string) => void;
  isConnected: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [hasError, setHasError] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout>();

  const connect = () => {
    if (!user || hasError) return;

    try {
      // Close existing connection if any
      if (wsRef.current) {
        wsRef.current.close();
      }

      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const wsUrl = API_URL.replace(/^http/, 'ws') + '/ws';
      
      console.log('Connecting to WebSocket:', wsUrl);
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setHasError(false);
        if (reconnectTimeout.current) {
          clearTimeout(reconnectTimeout.current);
        }
      };

      ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          setMessages(prev => [...prev, message]);
        } catch (e) {
          console.error('Failed to parse message:', e);
        }
      };

      ws.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        // Only attempt reconnection if we haven't encountered a fatal error
        if (!hasError && user) {
          reconnectTimeout.current = setTimeout(connect, 3000);
        }
      };

      ws.onerror = (error) => {
        console.error('WebSocket error:', error);
        setHasError(true);
        ws.close();
      };
    } catch (error) {
      console.error('Failed to establish WebSocket connection:', error);
      setHasError(true);
      // Attempt to reconnect after error
      reconnectTimeout.current = setTimeout(connect, 3000);
    }
  };

  useEffect(() => {
    connect();
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
      if (reconnectTimeout.current) {
        clearTimeout(reconnectTimeout.current);
      }
    };
  }, [user]);

  const sendMessage = (content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ content }));
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, isConnected }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
