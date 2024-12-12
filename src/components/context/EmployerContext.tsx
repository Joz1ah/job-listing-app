import { createContext, useContext } from 'react';

interface EmployerContextType {
  isFreeTrial: boolean;
}

const EmployerContext = createContext<EmployerContextType | undefined>(undefined);

const useEmployerContext = () => {
  const context = useContext(EmployerContext);
  if (context === undefined) {
    throw new Error('useEmployerContext must be used within an EmployerProvider');
  }
  return context;
};

export { EmployerContext, useEmployerContext }