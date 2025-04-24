'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  projects?: Array<{
    id: string;
    name: string;
    apiKey: string;
    mongodbUri: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, otp: string) => Promise<boolean>;
  logout: () => void;
  sendOtp: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          setUser(null);
          return;
        }

        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Auth check failed:', error);
        setUser(null);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, otp: string) => {
    try {
      const response = await fetch('/api/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Invalid response from server' }));
        throw new Error(errorData.error || 'Login failed');
      }

      const data = await response.json();

      if (data.success && data.user) {
        // Set user data
        setUser(data.user);
        
        // Set email in cookie
        document.cookie = `email=${email}; path=/; max-age=86400; SameSite=Lax`;
        
        // Redirect based on projects
        if (data.user.projects && data.user.projects.length > 0) {
          router.push('/dashboard');
        } else {
          router.push('/profile');
        }
        
        return true;
      }
      
      throw new Error('Invalid response format');
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      // Clear cookies and user state
      document.cookie = 'email=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      setUser(null);
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const sendOtp = async (email: string) => {
    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to send OTP' }));
        throw new Error(errorData.error || 'Failed to send OTP');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('OTP sending failed:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, sendOtp }}>
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