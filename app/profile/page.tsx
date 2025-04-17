'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, ArrowLeftOnRectangleIcon, ChevronDownIcon, ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const copyToClipboard = () => {
    if (user?.apikey) {
      navigator.clipboard.writeText(user.apikey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">OpenErr Dashboard</h1>
          
          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={toggleUserMenu}
              className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 bg-gray-100 hover:bg-gray-200 rounded-md py-2 px-3 transition-colors"
            >
              <UserIcon className="h-5 w-5" />
              <span className="max-w-32 truncate">{user?.name || user?.email}</span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>
            
            {showUserMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
                <button
                  onClick={logout}
                  className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                >
                  <ArrowLeftOnRectangleIcon className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-black">Welcome, {user?.name || 'User'}!</h2>
          <p className="text-gray-600">This is your error logging dashboard. You can monitor and manage all errors from your applications here.</p>
          
          {/* Dashboard content would go here */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2 text-black">Your API Key</h3>
            <div className="flex items-center gap-2 p-4 border border-gray-200 rounded-md bg-gray-50">
              <code className="text-sm text-gray-700 flex-grow font-mono">{user?.apikey || 'No API key available'}</code>
              <button 
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
                title="Copy to clipboard"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-4 w-4" />
                    <span className="text-sm">Copied!</span>
                  </>
                ) : (
                  <>
                    <ClipboardDocumentIcon className="h-4 w-4" />
                    <span className="text-sm">Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
          </div>
          </main>
    </div>
  );
}