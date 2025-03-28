export interface User {
    id: string;
    name: string;
    email: string;
    [key: string]: any;
  }
  
  export interface AuthContextProps {
    user: User | null;
    userSettings: any | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
  }