'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api, { endpoints } from './api';
import { checkAuth } from './auth';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        const response = await api.get(endpoints.auth.me);
        setUser(response.data);
      } else {
        setUser(null);
        if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      if (window.location.pathname !== '/login' && window.location.pathname !== '/') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const login = () => {
    // Store the current path to redirect back after login
    const returnTo = window.location.pathname;
    sessionStorage.setItem('returnTo', returnTo);
    window.location.href = api.defaults.baseURL + endpoints.auth.google;
  };

  const logout = async () => {
    try {
      await api.post(endpoints.auth.logout);
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Add event listener for storage events to handle session changes
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth' && !e.newValue) {
        setUser(null);
        router.push('/login');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 