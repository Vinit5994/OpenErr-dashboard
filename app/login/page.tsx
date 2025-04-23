'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { EnvelopeIcon, KeyIcon, LockClosedIcon } from '@heroicons/react/24/outline';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { sendOtp, login } = useAuth();
  const router = useRouter();

  const handleEmailPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/verify-credentials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      // Check if response is JSON
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned invalid response format');
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to verify credentials');
      }

      await sendOtp(email);
      setIsOtpSent(true);
      toast.success('OTP sent to your email');
    } catch (error) {
      console.error('Verification error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to verify credentials');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    setIsLoading(true);
    try {
      const success = await login(email, otp);
      if (success) {
        toast.success('Login successful');
        window.location.href = '/dashboard';
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          {!isOtpSent ? (
            <form className="space-y-6" onSubmit={handleEmailPasswordSubmit}>
              <div>
                <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <EnvelopeIcon className="h-4 w-4 text-indigo-500" />
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                />
              </div>

              <div>
                <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <LockClosedIcon className="h-4 w-4 text-indigo-500" />
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Continue'}
                </button>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleOtpSubmit}>
              <div>
                <label htmlFor="otp" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                  <KeyIcon className="h-4 w-4 text-indigo-500" />
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                  placeholder="Enter 6-digit OTP"
                />
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() => setIsOtpSent(false)}
                  className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  Back to login
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 text-center">
            <a
              href="/register"
              className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Don&apos;t have an account? Register
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}