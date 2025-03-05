import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContextProps } from './types';
import { useDispatch } from 'react-redux';
import { useGetUserInfoQuery,akazaApiAccount } from 'api/akaza/akazaAPI';

// Create the AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from cookie on mount
    return Cookies.get('authToken') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(true); // Add this line
  
  const { data: user, error, refetch } = useGetUserInfoQuery(null, {
    skip: !token
  });
  const dispatch = useDispatch();

  const deleteCookie = (name: string, domain: string) => {
    document.cookie = `${name}=; path=/; domain=${domain}; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Strict`;
  };
  
  const login = (newToken: string) => {
    setToken(newToken);
    //Cookies.set('authToken', newToken, { expires: 7, path: '' });
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    const hostname = window.location.hostname;
    const rootDomain = '.' + hostname.split('.').slice(-2).join('.');
   
      [hostname, rootDomain].forEach(domain => {
        deleteCookie('authToken', domain);
      });
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
    if (user && token) {
      setIsAuthenticated(true);
      setIsLoading(false);
    } else if (error) {
      logout();
      setIsLoading(false);
    }
  }, [user, error, token]);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = Cookies.get('authToken');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      setToken(storedToken);
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      isAuthenticated, 
      isLoading,
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