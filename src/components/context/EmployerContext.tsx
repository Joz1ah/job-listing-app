import { createContext, useContext, useState, ReactNode } from 'react';
type subscriptionPlan = 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';

interface EmployerContextType {
  subscriptionPlan: subscriptionPlan;
  setsubscriptionPlan: (tier: subscriptionPlan) => void;
}

const EmployerContext = createContext<EmployerContextType | undefined>(undefined);

interface EmployerProviderProps {
  children: ReactNode;
  initialTier?: subscriptionPlan;
}

const EmployerProvider: React.FC<EmployerProviderProps> = ({ 
  children, 
  initialTier = 'freeTrial'
}) => {
  const [subscriptionPlan, setsubscriptionPlan] = useState<subscriptionPlan>(initialTier);

  return (
    <EmployerContext.Provider value={{ subscriptionPlan, setsubscriptionPlan }}>
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