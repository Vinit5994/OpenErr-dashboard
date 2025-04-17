'use client';

import React, { useState } from 'react';
import { EnvelopeIcon, LockClosedIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Login successful!');
        router.push('/dashboard');
      } else {
        toast.error(data.error || 'Login failed');
      }
    } catch (error) {
      console.error(error);
      toast.error('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <>
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">OpenErr</h1>
        <p className="text-gray-600 mt-2">Log in to access your dashboard</p>
      </div>
      
      <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100">
        <h2 className="text-2xl font-bold text-indigo-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <EnvelopeIcon className="h-4 w-4 text-indigo-500" />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-black"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
              <LockClosedIcon className="h-4 w-4 text-indigo-500" />
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              value={formData.password}
              onChange={handleChange}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-black"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
          >
            {isLoading ? 'Logging in...' : (
              <>
                Login
                <ArrowRightIcon className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button 
              onClick={() => router.push('/')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
    </>
  );
}