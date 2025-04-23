'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { UserIcon, EnvelopeIcon, KeyIcon, ServerIcon } from '@heroicons/react/24/outline';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mongodbUri, setMongodbUri] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          mongodbUri,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Registration successful!');
        router.push('/login');
      } else {
        throw new Error(data.error || 'Registration failed');
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-lg sm:rounded-lg sm:px-10 border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="h-4 w-4 text-indigo-500" />
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>

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
                <KeyIcon className="h-4 w-4 text-indigo-500" />
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
              />
            </div>

            <div>
              <label htmlFor="mongodbUri" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <ServerIcon className="h-4 w-4 text-indigo-500" />
                MongoDB Connection URI
              </label>
              <input
                id="mongodbUri"
                name="mongodbUri"
                type="text"
                required
                value={mongodbUri}
                onChange={(e) => setMongodbUri(e.target.value)}
                className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-black"
                // placeholder="mongodb://username:password@host:port/database"
              />
              <div className="mt-2 text-sm text-gray-500">
                <p className="mb-2">Your MongoDB URI should have the following permissions:</p>
                <ul className="list-disc pl-4 space-y-1">
                  <li>Read and write access to the database</li>
                  <li>Access to create and modify collections</li>
                  <li>No admin privileges required</li>
                </ul>
                <p className="mt-2 text-xs text-gray-400">
                  Example: mongodb+srv://username:password@cluster.mongodb.net/your-database
                </p>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
              >
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <a
              href="/login"
              className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors"
            >
              Already have an account? Sign in
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 