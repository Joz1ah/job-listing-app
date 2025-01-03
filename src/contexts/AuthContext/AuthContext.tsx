import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getUserInfo } from './authHelpers';
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
    Cookies.set('authToken', newToken, { expires: 7, path: '' });  // Set the token in a cookie (7 days expiration)
    refreshUser();
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
    Cookies.remove('authToken');  // Remove the token from cookies
  };

  const refreshUser = async () => {
    if (!token) return;
    const userData = await getUserInfo();
    if (userData) {
      setUser(userData);
      setIsAuthenticated(true);
    } else {
      logout();
    }
  };

  useEffect(() => {
    const storedToken = Cookies.get('authToken');  // Get the token from cookies
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