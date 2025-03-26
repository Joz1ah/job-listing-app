import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { AuthContextProps } from './types';
import { useDispatch } from 'react-redux';
import { useGetUserInfoQuery, akazaApiAccount } from 'api/akaza/akazaAPI';

// Create the AuthContext
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// AuthProvider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    // Initialize from cookie on mount
    return Cookies.get('authToken') || null;
  });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!Cookies.get('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  
  const { data: user, error, refetch, isLoading: isUserDataLoading } = useGetUserInfoQuery(null, {
    skip: !token
  });
  const dispatch = useDispatch();

  const login = (newToken: string) => {
    // Always set both the state and cookie when logging in
    setToken(newToken);
    Cookies.set('authToken', newToken, { 
      expires: 1, 
      path: '/',
      secure: true,
      sameSite: 'strict'
    });
    setIsAuthenticated(true);
  };

  const logout = () => {
    setToken(null);
    setIsAuthenticated(false);
    const hostname = window.location.hostname;
    const rootDomain = '.' + hostname.split('.').slice(-2).join('.');
      
    [hostname, rootDomain].forEach(domain => {
      Cookies.remove('authToken', { path: '/', domain });
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
    // Only update authentication state when user data loading is complete
    if (token && !isUserDataLoading) {
      if (user) {
        setIsAuthenticated(true);
      } else if (error) {
        // If there's an error loading user data, log out
        console.error('Error loading user data:', error);
        logout();
      }
      // Set isLoading to false only after we've determined authentication status
      setIsLoading(false);
    } else if (!token) {
      // No token, so we're definitely not authenticated
      setIsAuthenticated(false);
      setIsLoading(false);
    }
  }, [user, error, token, isUserDataLoading]);

  // Initial auth check
  useEffect(() => {
    const checkAuth = async () => {
      const storedToken = Cookies.get('authToken');
      if (!storedToken) {
        setIsLoading(false);
        return;
      }
      setToken(storedToken);
      // Note: We don't set isLoading=false here, we'll wait for the user data to load
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
      refreshUser
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