import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

interface CookieContextType {
  consentGiven: boolean;
  setConsent: (consent: boolean) => void;
  getConsent: () => boolean;
  clearConsent: () => void;
}

interface CookieProviderProps {
  children: React.ReactNode;
}

const CookieContext = createContext<CookieContextType | undefined>(undefined);

export const CookieProvider: React.FC<CookieProviderProps> = ({ children }) => {
  const [consentGiven, setConsentGiven] = useState<boolean>(false);

  useEffect(() => {
    const storedConsent = Cookies.get("cookie-consent");
    if (storedConsent === "true") {
      setConsentGiven(true);
    } else {
      setConsentGiven(false);
    }
  }, []);

  const setConsent = (consent: boolean) => {
    setConsentGiven(consent);
    Cookies.set("cookie-consent", consent.toString(), { expires: 365 });
  };

  const clearConsent = () => {
    setConsentGiven(false);
    //Cookies.remove("cookie-consent");
  };

  return (
    <CookieContext.Provider value={{ consentGiven, setConsent, getConsent: () => consentGiven, clearConsent }}>
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