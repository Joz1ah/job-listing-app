import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { SubscriptionPlan, BaseContextType } from './types';

const EmployerContext = createContext<BaseContextType | undefined>(undefined);

interface EmployerProviderProps {
  children: ReactNode;
  initialTier?: SubscriptionPlan;
}

const EmployerProvider: React.FC<EmployerProviderProps> = ({ 
  children, 
  initialTier = 'freeTrial'
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [subscriptionPlan, setSubscriptionPlan] = useState<SubscriptionPlan>(initialTier);

  const updateSubscriptionPlan = async (newPlan: SubscriptionPlan) => {
    setIsLoading(true);
    setError(null);
    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubscriptionPlan(newPlan);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update subscription'));
    } finally {
      setIsLoading(false);
    }
  };

  const value = useMemo(() => ({
    subscriptionPlan,
    setSubscriptionPlan: updateSubscriptionPlan,
    isLoading,
    error
  }), [subscriptionPlan, isLoading, error]);

  return (
    <EmployerContext.Provider value={value}>
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