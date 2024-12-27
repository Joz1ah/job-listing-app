import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUser } from './authHelpers';
import { AuthContextProps, User } from './types';

// Create the AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('authToken', newToken);
    refreshUser();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('authToken');
  };

  const refreshUser = async () => {
    if (!token) return;
    const userData = await fetchUser(token);
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      logout();
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
      refreshUser();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
