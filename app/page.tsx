'use client';

import React, { useState } from 'react';
import { KeyIcon, ServerIcon, ArrowRightIcon, UserIcon, EnvelopeIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface FormData {
  name: string;
  email: string;
  mongodbUri: string;
}

export default function Home() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    mongodbUri: ''
  });
  const [apiKey, setApiKey] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setApiKey(data.apiKey);
        setShowModal(true);
        toast.success('Registration successful!');
      } else {
        toast.error(data.error || 'Registration failed');
      }
    } catch (error) {
      console.log(error)
      toast.error('An error occurred during registration');
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

  const navigateToDashboard = () => {
    router.push('/dashboard');
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey);
    toast.success('Your API key has been copied to clipboard!', {
      duration: 3000,
      icon: '🔑',
      style: {
        borderRadius: '10px',
        background: '#4338ca',
        color: '#fff',
      },
    });
  };

  const closeModalAndNavigate = () => {
    setShowModal(false);
    navigateToDashboard();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-indigo-700">OpenErr</h1>
        <button
          onClick={navigateToDashboard}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-md transition-colors"
        >
          Dashboard
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white shadow-lg rounded-xl p-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6">Register Your Application</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                <UserIcon className="h-4 w-4 text-indigo-500" />
                Application Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-black"
                placeholder="My Awesome App"
              />
            </div>

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
              <label htmlFor="mongodbUri" className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-1">
                {/* <DatabaseIcon className="h-4 w-4 text-indigo-500" /> */}
                MongoDB Connection URI
              </label>
              <input
                type="text"
                name="mongodbUri"
                id="mongodbUri"
                required
                value={formData.mongodbUri}
                onChange={handleChange}
                placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2 px-3 text-black"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors"
            >
              {isLoading ? 'Registering...' : 'Register Application'}
            </button>
          </form>
        </div>

        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg rounded-xl p-6 border border-indigo-100">
          <h2 className="text-2xl font-bold text-indigo-800 mb-6">Getting Started</h2>
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                <ServerIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-700">1. Register Your App</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Complete the form with your details and MongoDB connection string.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                <KeyIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-700">2. Implement Logging</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Integrate your API key with our logging SDK in your application.
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 bg-indigo-100 p-2 rounded-full">
                <ArrowRightIcon className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-indigo-700">3. Monitor Your Logs</h3>
                <p className="mt-1 text-sm text-gray-600">
                  Access your dashboard to view and analyze error logs in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for API Key */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 relative">
            <button 
              onClick={closeModalAndNavigate}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            
            <div className="text-center mb-4">
              <div className="mx-auto bg-indigo-100 p-3 rounded-full inline-flex mb-2">
                <KeyIcon className="h-8 w-8 text-indigo-600" />
              </div>
              <h2 className="text-2xl font-bold text-indigo-800">Your API Key</h2>
              <p className="text-gray-600 mt-1">Store this key securely. You&apos;ll need it to send logs.</p>
            </div>
            
            <div className="bg-indigo-50 p-4 rounded-md border border-indigo-100 flex items-center space-x-2 mb-6">
              <code className="text-sm font-mono flex-1 break-all text-black">{apiKey}</code>
              <button 
                onClick={copyApiKey}
                className="bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 transition-colors flex-shrink-0"
              >
                Copy
              </button>
            </div>
            
            <button
              onClick={closeModalAndNavigate}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-4 rounded-md transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}