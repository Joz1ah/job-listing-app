import { createContext, useContext, useState, ReactNode } from 'react';

type SubscriptionTier = 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';

interface JobHunterContextType {
  subscriptionTier: SubscriptionTier;
  setSubscriptionTier: (tier: SubscriptionTier) => void;
}

const JobHunterContext = createContext<JobHunterContextType | undefined>(undefined);

interface JobHunterProviderProps {
  children: ReactNode;
  initialTier?: SubscriptionTier;
}

const JobHunterProvider: React.FC<JobHunterProviderProps> = ({ 
  children, 
  initialTier = 'freeTrial'
}) => {
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>(initialTier);

  return (
    <JobHunterContext.Provider value={{ subscriptionTier, setSubscriptionTier }}>
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