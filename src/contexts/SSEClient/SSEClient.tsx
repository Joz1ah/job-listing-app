import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { NotificationItem } from 'types/notification';

// Type definition for the received message
interface Notification extends NotificationItem {
  metadata: Record<string, string>;
  //createdAt: string;
}

interface SSEContextValue {
  messages: Notification[];
  client: AdvancedSSEClient | null;
  clearMessages: () => void;
}

// Context for providing SSE data
const SSEContext = createContext<SSEContextValue | undefined>(undefined);

// Base SSE Client Class
class BaseSSEClient {
  protected eventSource: EventSource;

  constructor(url: string) {
    const eventSourceOptions = {
      withCredentials: true, // Ensure credentials are sent if needed (cookies/tokens)
    };
    this.eventSource = new EventSource(url, eventSourceOptions);

    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    this.eventSource.onopen = () => {
      console.log('SSE connection established');
    };
  }

  // Method to handle incoming messages
  onMessage(callback: (data: Notification[]) => void): () => void {
    const handler = (event: MessageEvent) => {
      try {
        //console.log(event.data);
        const parsedData = JSON.parse(event.data);
        callback(parsedData.notifications);
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    this.eventSource.addEventListener('message', handler);

    // Return a cleanup function to remove the listener
    return () => this.eventSource.removeEventListener('message', handler);
  }

  // Close the connection when done
  close(): void {
    this.eventSource.close();
    console.log('SSE connection closed');
  }
}

// Advanced SSE Client Class that keeps track of message history
class AdvancedSSEClient extends BaseSSEClient {
  private messageHistory: Notification[] = [];

  override onMessage(callback: (data: Notification[]) => void): () => void {
    return super.onMessage((notifications) => {
      this.messageHistory = [...this.messageHistory, ...notifications];
      callback(notifications);
    });
  }

  getMessageHistory(): Notification[] {
    return this.messageHistory;
  }
}

// SSEProvider Component for context management
interface SSEProviderProps {
  url: string;
  children: ReactNode;
}

export const SSEProvider: React.FC<SSEProviderProps> = ({ url, children }) => {
  const [messages, setMessages] = useState<Notification[]>([]);
  const [client, setClient] = useState<AdvancedSSEClient | null>(null);

  useEffect(() => {
    const sseClient = new AdvancedSSEClient(url);
    setClient(sseClient);

    const unsubscribe = sseClient.onMessage((data) => {
      setMessages((prev) => {
        const combined = [...prev, ...data.map((msg) => ({
          ...msg,
          createdAt: new Date(msg.createdAt), // Convert timestamp to Date object
          unread: true
        }))];
        const seen = new Set();
        
        // Remove duplicates using (title + message) as a key
        const uniqueMessages = combined.filter((msg) => {
          const key = `${msg.title}-${msg.message}`;
          if (seen.has(key)) return false;
          seen.add(key);
          return true;
        });

        // Limit stored messages to prevent infinite growth
        const MAX_MESSAGES = 50;
        return uniqueMessages.slice(-MAX_MESSAGES);
      });
    });

    return () => {
      unsubscribe(); // Remove SSE listener
      sseClient.close(); // Close SSE connection
    };
  }, [url]);

  // Function to manually clear messages
  const clearMessages = () => setMessages([]);

  return (
    <SSEContext.Provider value={{ messages, client, clearMessages }}>
      {children}
    </SSEContext.Provider>
  );
};

// Custom hook for accessing SSE data
export const useSSE = (): SSEContextValue => {
  const context = useContext(SSEContext);
  if (!context) {
    throw new Error('useSSE must be used within an SSEProvider');
  }
  return context;
};
