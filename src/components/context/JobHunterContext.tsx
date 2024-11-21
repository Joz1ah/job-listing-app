// First create a JobHunterContext.tsx file
import { createContext, useContext } from 'react';

interface JobHunterContextType {
  isFreeTrial: boolean;
}

const JobHunterContext = createContext<JobHunterContextType | undefined>(undefined);

const useJobHunterContext = () => {
  const context = useContext(JobHunterContext);
  if (context === undefined) {
    throw new Error('useJobHunterContext must be used within a JobHunterProvider');
  }
  return context;
};

export { JobHunterContext, useJobHunterContext }