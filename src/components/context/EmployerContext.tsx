import { createContext, useContext, useState, ReactNode } from 'react';
type SubscriptionTier = 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';

interface EmployerContextType {
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
}

const EmployerContext = createContext<EmployerContextType | undefined>(undefined);

interface EmployerProviderProps {
  children: ReactNode;
  initialTier?: SubscriptionTier;
}

const EmployerProvider: React.FC<EmployerProviderProps> = ({ 
  children, 
  initialTier = 'freeTrial'
}) => {
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(initialTier);

  return (
    <EmployerContext.Provider value={{ subscriptionTier, setSubscriptionTier }}>
      {children}
    </EmployerContext.Provider>
  );
};

const useEmployerContext = () => {
  const context = useContext(EmployerContext);
  if (context === undefined) {
    throw new Error('useEmployerContext must be used within an EmployerProvider');
  }
  return context;
};


export { EmployerProvider, EmployerContext, useEmployerContext };