import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import Intercom from "@intercom/messenger-js-sdk";
//import styles from './intercom.module.scss';

interface IntercomContextType {
  userStatus: string;
  setUserStatus: (newStatus: string) => void;
  visible: boolean;
  setVisible: (isVisible: boolean) => void;
}

const IntercomContext = createContext<IntercomContextType | undefined>(undefined);

export const useIntercomContext = (): IntercomContextType => {
  const context = useContext(IntercomContext);
  if (!context) {
    throw new Error('useIntercomContext must be used within an IntercomProvider');
  }
  return context;
};

interface IntercomProviderProps {
  children: ReactNode;
}

export const IntercomProvider: React.FC<IntercomProviderProps> = ({ children }) => {
  const [userStatus, setUserStatus] = useState<string>('active'); // Example of user status
  const [visible, setVisible] = useState<boolean>(false);
  

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
    });

    return () => {
      // Cleanup Intercom when the component unmounts
      if (window.Intercom) {
        window.Intercom('shutdown');
      }
    };
  }, [current_user_name, current_user_email, current_user_id, APP_ID]);

  // Toggle visibility of the Intercom messenger without unmounting
  useEffect(() => {
    if (window.Intercom) {

      window.Intercom('update', {
        "hide_default_launcher": visible ? false : true
      });
    }

  }, [visible]);

  return (
    <IntercomContext.Provider value={{ userStatus, setUserStatus, visible, setVisible }}>
      {/* <div
        className={`${styles['intercom-launcher']} ${visible ? styles['intercom-visible'] : styles['intercom-hidden']}`}
      >
      </div> */}
        {children}
    </IntercomContext.Provider>
  );
};
