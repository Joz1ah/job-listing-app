// contexts/TrialContexts.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

// Types for both contexts
interface TrialContextType {
  isFreeTrial: boolean;
  setIsFreeTrial: (value: boolean) => void;
}

// Create separate contexts
const EmployerTrialContext = createContext<TrialContextType | undefined>(undefined);
const JobHunterTrialContext = createContext<TrialContextType | undefined>(undefined);

// Props interface for providers
interface TrialProviderProps {
  children: ReactNode;
  initialTrialStatus?: boolean;
}

// Employer Trial Provider
const EmployerTrialProvider: React.FC<TrialProviderProps> = ({ 
  children, 
  initialTrialStatus = false 
}) => {
  const [isFreeTrial, setIsFreeTrial] = useState(initialTrialStatus);

  return (
    <EmployerTrialContext.Provider value={{ isFreeTrial, setIsFreeTrial }}>
      {children}
    </EmployerTrialContext.Provider>
  );
};

// Job Hunter Trial Provider
const JobHunterTrialProvider: React.FC<TrialProviderProps> = ({ 
  children, 
  initialTrialStatus = false 
}) => {
  const [isFreeTrial, setIsFreeTrial] = useState(initialTrialStatus);

  return (
    <JobHunterTrialContext.Provider value={{ isFreeTrial, setIsFreeTrial }}>
      {children}
    </JobHunterTrialContext.Provider>
  );
};

// Custom hooks for each context
const useEmployerTrialStatus = () => {
  const context = useContext(EmployerTrialContext);
  if (context === undefined) {
    throw new Error('useEmployerTrialStatus must be used within an EmployerTrialProvider');
  }
  return context;
};

const useJobHunterTrialStatus = () => {
  const context = useContext(JobHunterTrialContext);
  if (context === undefined) {
    throw new Error('useJobHunterTrialStatus must be used within a JobHunterTrialProvider');
  }
  return context;
};

// Combined provider for cases where you need both
interface TrialProvidersProps extends TrialProviderProps {
  employerInitialStatus?: boolean;
  jobHunterInitialStatus?: boolean;
}

const TrialProviders: React.FC<TrialProvidersProps> = ({ 
  children,
  employerInitialStatus = false,
  jobHunterInitialStatus = false
}) => {
  return (
    <EmployerTrialProvider initialTrialStatus={employerInitialStatus}>
      <JobHunterTrialProvider initialTrialStatus={jobHunterInitialStatus}>
        {children}
      </JobHunterTrialProvider>
    </EmployerTrialProvider>
  );
};

export {TrialProviders, useEmployerTrialStatus, useJobHunterTrialStatus }