import { createContext, useContext, useState, ReactNode } from 'react';

type subscriptionPlan = 'freeTrial' | 'monthlyPlan' | 'yearlyPlan';

interface JobHunterContextType {
  subscriptionPlan: subscriptionPlan;
  setsubscriptionPlan: (tier: subscriptionPlan) => void;
}

const JobHunterContext = createContext<JobHunterContextType | undefined>(undefined);

interface JobHunterProviderProps {
  children: ReactNode;
  initialTier?: subscriptionPlan;
}

const JobHunterProvider: React.FC<JobHunterProviderProps> = ({ 
  children, 
  initialTier = 'freeTrial'
}) => {
  const [subscriptionPlan, setsubscriptionPlan] = useState<subscriptionPlan>(initialTier);

  return (
    <JobHunterContext.Provider value={{ subscriptionPlan, setsubscriptionPlan }}>
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