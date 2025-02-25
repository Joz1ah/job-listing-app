import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Type definition for the received message
interface Notification {
  id: number;
  title: string;
  message: string;
  metadata: Record<string, string>;
  createdAt: string;
}

interface SSEContextValue {
  messages: Notification[];
  client: AdvancedSSEClient | null;
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

    // Handle errors or connection issues
    this.eventSource.onerror = (error) => {
      console.error('SSE connection error:', error);
    };

    // Optionally log when the connection is opened
    this.eventSource.onopen = () => {
      console.log('SSE connection established');
    };
  }

  // Method to handle incoming messages
  onMessage(callback: (data: Notification[]) => void): void {
    this.eventSource.addEventListener('message', (event: MessageEvent) => {
      try {
        //console.log(event)
        const parsedData = JSON.parse(event.data); // Assuming the data is a JSON string
        callback(parsedData.notifications); // Pass the notifications array
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    });
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

  override onMessage(callback: (data: Notification[]) => void): void {
    super.onMessage((notifications) => {
      this.messageHistory = [...this.messageHistory, ...notifications]; // Append new notifications
      callback(notifications); // Pass the notifications to the callback
    });
  }

  getMessageHistory(): Notification[] {
    return this.messageHistory;
  }
}

// SSEProvider Component for context management
interface SSEProviderProps {
  url: string;
  children: ReactNode;  // Explicitly declare the children prop here
}

export const SSEProvider: React.FC<SSEProviderProps> = ({ url, children }) => {
  const [messages, setMessages] = useState<Notification[]>([]);
  const [client, setClient] = useState<AdvancedSSEClient | null>(null);

  useEffect(() => {
    // Initialize the SSE client
    const sseClient = new AdvancedSSEClient(url);
    setClient(sseClient);

    // Listen for messages and update the state
    sseClient.onMessage((data) => {
      setMessages((prev) => [...prev, ...data]); // Append new messages to state
    });

    // Clean up on unmount
    return () => sseClient.close();
  }, [url]);

  return (
    <SSEContext.Provider value={{ messages, client }}>
      {children} {/* Any component inside can access the context */}
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
