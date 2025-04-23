'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  _id?: string;
  name: string;
  apiKey: string;
  mongodbUri: string;
  createdAt?: Date;
}

interface User {
  id: string;
  name: string;
  email: string;
  projects: Project[];
  apikey: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  sendOtp: (email: string) => Promise<void>;
  login: (email: string, otp: string) => Promise<boolean>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Only check auth if we're not on a public path
    const path = window.location.pathname;
    const isPublicPath = ['/login', '/register', '/'].includes(path);
    
    if (!isPublicPath) {
      checkAuth();
    } else {
      setLoading(false);
    }
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
        // Only redirect to login if we're not already there
        if (window.location.pathname !== '/login') {
          router.push('/login');
        }
      }
    } catch (error) {
      console.error('Auth check error:', error);
      setUser(null);
      if (window.location.pathname !== '/login') {
        router.push('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const sendOtp = async (email: string) => {
    try {
      console.log('Sending OTP to:', email);
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('OTP sending error:', error);
      throw error;
    }
  };

  const login = async (email: string, otp: string): Promise<boolean> => {
    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, otp }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        setUser(data.user);
        return true;
      } else {
        const error = await response.json();
        console.error('Login failed:', error);
        throw new Error(error.error || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      await fetch('/api/logout', {
        method: 'GET',
        credentials: 'include',
      });
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, sendOtp, login, logout, checkAuth }}>
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