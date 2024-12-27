import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { SubscriptionPlan, BaseContextType } from './types';

const JobHunterContext = createContext<BaseContextType | undefined>(undefined);

interface JobHunterProviderProps {
  children: ReactNode;
  initialTier?: SubscriptionPlan;
}

const JobHunterProvider: React.FC<JobHunterProviderProps> = ({ 
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
    <JobHunterContext.Provider value={value}>
      {children}
    </JobHunterContext.Provider>
  );
};

const useJobHunterContext = () => {
  const context = useContext(JobHunterContext);
  if (context === undefined) {
    throw new Error('useJobHunterContext must be used within a JobHunterProvider');
  }
  return context;
};
export { JobHunterProvider, JobHunterContext, useJobHunterContext };