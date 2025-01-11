import React, { createContext, useState, useContext, useCallback, ReactNode } from 'react';

type ServerError = {
  id: number;
  message: string;
};

type ServerErrorContextType = {
  errors: ServerError[];
  showError: (message: string) => void;
  hideError: (id: number) => void;
};

const ServerErrorContext = createContext<ServerErrorContextType | undefined>(undefined);

let errorIdCounter = 0;

export const ErrorModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [errors, setErrors] = useState<ServerError[]>([]);
  
    const showError = useCallback((message: string) => {
      const id = ++errorIdCounter;
      setErrors((prevErrors) => [...prevErrors, { id, message }]);
    }, []);
  
    const hideError = useCallback((id: number) => {
      setErrors((prevErrors) => prevErrors.filter((error) => error.id !== id));
    }, []);
  
    return (
      <ServerErrorContext.Provider value={{ errors, showError, hideError }}>
        {children}
        {errors.slice(-3).map((error) => (
          <ServerErrorModal key={error.id} error={error} onClose={() => hideError(error.id)} />
        ))}
      </ServerErrorContext.Provider>
    );
};
  

export const useErrorModal = (): ServerErrorContextType => {
  const context = useContext(ServerErrorContext);
  if (!context) {
    throw new Error('useServerError must be used within a ErrorModalProvider');
  }
  return context;
};

const ServerErrorModal: React.FC<{ error: ServerError; onClose: () => void }> = ({ error, onClose }) => {
  return (
    <div style={modalStyles.overlay}>
      <div style={modalStyles.modal}>
        <h2>Server Error</h2>
        <p>{error.message}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

const modalStyles = {
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  modal: {
    background: 'white',
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center' as const,
    width: '400px',
    maxWidth: '90%',
    position: 'relative' as const,
    zIndex: 1000,
  },
};
