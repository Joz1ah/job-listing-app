import { createContext, useContext } from 'react';

interface LandingContextType {
  isFreeTrial: boolean;
}

const LandingContext = createContext<LandingContextType | undefined>(undefined);

const useLandingContext = () => {
  const context = useContext(LandingContext);
  if (context === undefined) {
    throw new Error('useLandingContext must be used within a LandingProvider');
  }
  return context;
};

export { LandingContext, useLandingContext }