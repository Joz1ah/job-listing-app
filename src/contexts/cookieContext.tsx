import React, { createContext, useContext, useState, useCallback } from "react";
import Cookies from "js-cookie";

interface CookieContextType {
    consentGiven: boolean;
    setConsent: (consent: boolean) => void;
    getConsent: () => boolean;
    clearConsent: () => void;
    isVisible: boolean;
    setIsVisible: (visible: boolean) => void; 
    isSnackBarVisible: boolean;
    setIsSnackBarVisible: (visible: boolean) => void; 
}

interface CookieProviderProps {
  children: React.ReactNode;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<CookieProviderProps> = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState<boolean>(() => Cookies.get("cookie-consent") === "true");
  const [isVisible, setIsVisible] = useState<boolean>(false)//useState(!consentGiven && !(Cookies.get("cookie-consent") === "false") ); 
  const [isSnackBarVisible, setIsSnackBarVisible] = useState(!consentGiven && !(Cookies.get("cookie-consent") === "false") ); 

  const setConsent = useCallback((consent: boolean) => {
    setConsentGiven(consent);
    Cookies.set("cookie-consent", consent.toString(), { expires: 365, secure: true, sameSite: "strict" });
  }, []);

  const clearConsent = useCallback(() => {
    setConsentGiven(false);
    Cookies.remove("cookie-consent");
  }, []);

  return (
    <CookieContext.Provider 
      value={{ consentGiven, setConsent, getConsent: () => consentGiven, clearConsent, isVisible, setIsVisible, isSnackBarVisible, setIsSnackBarVisible }}>
      {children}
    </CookieContext.Provider>
  );
};

export const useCookieContext = (): CookieContextType => {
  const context = useContext(CookieContext);
  if (!context) {
    throw new Error("useCookieContext must be used within a CookieProvider");
  }
  return context;
};
