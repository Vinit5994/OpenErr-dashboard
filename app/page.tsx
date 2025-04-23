'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRightIcon, ChartBarIcon, ShieldCheckIcon, ServerIcon } from '@heroicons/react/24/outline';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-indigo-600">OpenErr</h1>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/login')}
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Log In
              </button>
              <button
                onClick={() => router.push('/register')}
                className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700"
              >
                Register
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            <span className="block">Monitor Your Application</span>
            <span className="block text-indigo-600">Errors in Real-Time</span>
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            OpenErr helps you track, analyze, and fix errors in your applications with a simple and powerful dashboard.
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            <div className="rounded-md shadow">
              <button
                onClick={() => router.push('/register')}
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
              >
                Get Started
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <ChartBarIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Real-Time Monitoring</h3>
            <p className="mt-2 text-base text-gray-500">
              Track errors as they happen with instant notifications and detailed error reports.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <ShieldCheckIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Secure & Private</h3>
            <p className="mt-2 text-base text-gray-500">
              Your data is encrypted and stored securely in your own MongoDB database.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <ServerIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Easy Integration</h3>
            <p className="mt-2 text-base text-gray-500">
              Simple API integration with support for multiple programming languages and frameworks.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}