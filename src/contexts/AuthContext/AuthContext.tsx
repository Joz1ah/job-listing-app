import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContextProps } from './types';
import { useDispatch } from 'react-redux';
import { useGetUserInfoQuery,akazaApiAccount } from 'api/akaza/akazaAPI';

// Create the AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  const { data: user, error, refetch } = useGetUserInfoQuery(null, {
    skip: !token
  });
  const dispatch = useDispatch();

  const login = (newToken: string) => {
    setToken(newToken);
    Cookies.set('authToken', newToken, { expires: 7, path: '' });
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    Cookies.remove('authToken');
    dispatch(akazaApiAccount.util.resetApiState());
  };

  // Add the refreshUser function to match AuthContextProps interface
  const refreshUser = async () => {
    if (!token) return;
    try {
      await refetch().unwrap();
    } catch (error) {
      console.error('Error refreshing user:', error);
      logout();
    }
  };

  // Update authenticated state when user data changes
  useEffect(() => {
    if (user) {
      setIsAuthenticated(true);
    } else if (error) {
      logout();
    }
  }, [user, error]);

  // Check for stored token on mount
  useEffect(() => {
    const storedToken = Cookies.get('authToken');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      login, 
      logout,
      refreshUser // Add refreshUser to the context value
    }}>
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