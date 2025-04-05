'use client';

import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiClient, User } from '@/lib/api-client';
import { useRouter } from 'next/navigation';

// Define the context shape
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, fullName?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

// Create a default context value
const defaultContextValue: AuthContextType = {
  user: null,
  isLoading: true,
  login: async () => false,
  register: async () => false,
  logout: () => {},
  isAuthenticated: false
};

// Create the context
const AuthContext = createContext<AuthContextType>(defaultContextValue);

// Custom hook for using the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Function to fetch the current user
  const fetchCurrentUser = async () => {
    try {
      setIsLoading(true);
      const user = await apiClient.getCurrentUser();
      setUser(user);
      return user;
    } catch (error) {
      console.error('Error fetching user:', error);
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Check authentication status when the provider loads
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await fetchCurrentUser();
      } catch (error) {
        console.error('Auth check failed:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.login(email, password);
      if ('error' in response) {
        setIsLoading(false);
        return false;
      }
      
      const userData = await fetchCurrentUser();
      return !!userData;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Register function
  const register = async (email: string, password: string, fullName?: string) => {
    setIsLoading(true);
    try {
      const response = await apiClient.register({
        email,
        password,
        full_name: fullName
      });
      
      if ('error' in response) {
        setIsLoading(false);
        return false;
      }
      
      // Auto-login after registration
      return await login(email, password);
    } catch (error) {
      console.error('Registration error:', error);
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = () => {
    try {
      apiClient.logout();
      setUser(null);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Combine all context values
  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated,
  };

  // Provide the context to children
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
