import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import Intercom from "@intercom/messenger-js-sdk";

// Define the context type with Intercom-related names
interface IntercomContextType {
  userStatus: string;
  setUserStatus: (newStatus: string) => void;
}

// Create the context with a default value (optional)
const IntercomContext = createContext<IntercomContextType | undefined>(undefined);

// Custom hook to access the Intercom context
export const useIntercomContext = (): IntercomContextType => {
  const context = useContext(IntercomContext);
  if (!context) {
    throw new Error('useIntercomContext must be used within an IntercomProvider');
  }
  return context;
};

// Define the provider props
interface IntercomProviderProps {
  children: ReactNode;
}

// Intercom provider component to manage the context value
export const IntercomProvider: React.FC<IntercomProviderProps> = ({ children }) => {
  const [userStatus, setUserStatus] = useState<string>('active'); // Example of user status

  // Set your APP_ID and correct user data
  const APP_ID = "acqnbntk";
  const current_user_email = "sartre@existentialist.com";
  const current_user_name = "Jean Paul Sartre";
  const current_user_id = "1940";

  // Initialize Intercom with user data on context update or component mount
  useEffect(() => {
        Intercom({
            app_id: APP_ID,
            //name: current_user_name, // Full name
            //email: current_user_email, // Email address
            //user_id: current_user_id // current_user_id
        })

    return () => {
      // Cleanup Intercom when the component unmounts
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [current_user_name, current_user_email, current_user_id, APP_ID]); // Dependencies for useEffect

  return (
    <IntercomContext.Provider value={{ userStatus, setUserStatus }}>
      {children}
    </IntercomContext.Provider>
  );
};
