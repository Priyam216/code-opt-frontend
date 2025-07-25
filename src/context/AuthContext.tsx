// File: src/context/AuthContext.tsx
// Updated with Google OAuth functionality

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import {
  User,
  fetchCurrentUser,
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
  initiateGoogleAuth,
  checkAuthStatus
} from '../api/auth';

// Define the shape of the context
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: () => void;
  isAuthenticated: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed property for authentication status
  const isAuthenticated = user !== null;

  // Refresh the current user from the API
  const refreshUser = async () => {
    try {
      const response = await fetchCurrentUser();
      if (response.data.status === 'success') {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
      setUser(null);
    }
  };

  // Login method for local authentication
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginApi(username, password);
      
      if (response.data.status === 'success') {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup method for local authentication
  const signup = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await signupApi(username, email, password);
      
      if (response.data.status === 'success') {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login method
  const loginWithGoogle = () => {
    // This will redirect the user to the backend OAuth endpoint
    // The backend will handle the OAuth flow and redirect back to the frontend
    initiateGoogleAuth();
  };

  // Logout method
  const logout = async () => {
    try {
      setLoading(true);
      await logoutApi();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, clear local user state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on mount and periodically
  const checkAuth = async () => {
    try {
      const response = await checkAuthStatus();
      if (response.data.authenticated) {
        await refreshUser();
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
    }
  };

  // On mount, try to fetch the user
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);
        await refreshUser();
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Handle focus events to refresh user data when tab becomes active
  useEffect(() => {
    const handleFocus = () => {
      if (!loading && user) {
        refreshUser();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loading, user]);

  // Periodic auth check (optional - every 5 minutes)
  useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      checkAuth();
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user]);

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    loginWithGoogle,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easy access
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Additional hook for checking authentication status
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

// Hook for getting user data
export const useUser = (): User | null => {
  const { user } = useAuth();
  return user;
};