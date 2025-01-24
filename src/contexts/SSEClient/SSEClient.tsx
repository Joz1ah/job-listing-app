import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface SSEProviderProps {
  url: string;
  children: ReactNode;
}

// Base SSE Client
class BaseSSEClient {
  protected eventSource: EventSource;

  constructor(url: string) {
    this.eventSource = new EventSource(url);
  }

  onMessage(callback: (data: string) => void): void {
    this.eventSource.addEventListener('message', (event: MessageEvent) => {
      callback(event.data);
    });
  }

  close(): void {
    this.eventSource.close();
  }
}

// Advanced SSE Client
class AdvancedSSEClient extends BaseSSEClient {
  private messageHistory: string[] = [];

  override onMessage(callback: (data: string) => void): void {
    super.onMessage((data) => {
      this.messageHistory.push(data);
      callback(data);
    });
  }

  getMessageHistory(): string[] {
    return this.messageHistory;
  }
}

// Context and Provider
interface SSEContextValue {
  client: AdvancedSSEClient | null;
  messages: string[];
}

const SSEContext = createContext<SSEContextValue | undefined>(undefined);

export const SSEProvider: React.FC<SSEProviderProps> = ({ url, children }) => {
  const [client, setClient] = useState<AdvancedSSEClient | null>(null);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    const sseClient = new AdvancedSSEClient(url);
    setClient(sseClient);

    sseClient.onMessage((data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => sseClient.close();
  }, [url]);

  return (
    <SSEContext.Provider value={{ client, messages }}>
      {children}
    </SSEContext.Provider>
  );
};

// Hook for easier usage
export const useSSE = (): SSEContextValue => {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error('useSSE must be used within an SSEProvider');
  }
  return context;
};