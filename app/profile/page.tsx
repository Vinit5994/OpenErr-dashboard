'use client';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, ArrowLeftOnRectangleIcon, ChevronDownIcon, ClipboardDocumentIcon, CheckIcon, PlusIcon, ServerIcon, InformationCircleIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

export default function Profile() {
  const { user, logout } = useAuth();  const [showUserMenu, setShowUserMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showAddProject, setShowAddProject] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    mongodbUri: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Project added successfully');
        setShowAddProject(false);
        setNewProject({ name: '', mongodbUri: '' });
        // Refresh user data to show new project
        window.location.reload();
      } else {
        toast.error(data.error || 'Failed to add project');
      }
    } catch (error) {
      console.error('Error adding project:', error);
      toast.error('An error occurred while adding the project');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">Error Monitoring Dashboard</h1>
          
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
          
          {/* Projects Section */}
          <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-black">Your Projects</h3>
              <button
                onClick={() => setShowAddProject(!showAddProject)}
                className="flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
              >
                <PlusIcon className="h-4 w-4" />
                Add Project
              </button>
            </div>

            {/* Add Project Form */}
            {showAddProject && (
              <form onSubmit={handleAddProject} className="mb-6 p-6 border border-gray-200 rounded-lg bg-gray-50">
                <div className="space-y-6">
                  <div>
                    <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                      Project Name
                    </label>
                    <input
                      type="text"
                      id="projectName"
                      value={newProject.name}
                      onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="Enter your project name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="mongodbUri" className="block text-sm font-medium text-gray-700 mb-1">
                      MongoDB Connection URI
                    </label>
                    <input
                      type="text"
                      id="mongodbUri"
                      value={newProject.mongodbUri}
                      onChange={(e) => setNewProject({ ...newProject, mongodbUri: e.target.value })}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      placeholder="mongodb+srv://username:password@cluster.mongodb.net/database"
                      required
                    />
                    <div className="mt-2 p-4 bg-indigo-50 rounded-md">
                      <div className="flex items-start gap-2">
                        <InformationCircleIcon className="h-5 w-5 text-indigo-500 mt-0.5" />
                        <div className="text-sm text-gray-600">
                          <p className="font-medium text-gray-700 mb-2">MongoDB URI Requirements:</p>
                          <ul className="list-disc pl-4 space-y-1">
                            <li>Must be a valid MongoDB connection string</li>
                            <li>Should include database name</li>
                            <li>User must have read/write permissions</li>
                            <li>Format: mongodb+srv://username:password@cluster.mongodb.net/database</li>
                          </ul>
                          <p className="mt-2 text-xs text-gray-500">
                            Note: We recommend using a dedicated database user with limited permissions for security.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProject(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50 transition-colors"
                    >
                      {isLoading ? 'Adding...' : 'Add Project'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Projects List */}
            <div className="space-y-4">
              {user?.projects?.map((project, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-lg hover:border-indigo-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-lg font-medium text-black">{project.name}</h4>
                      <p className="text-sm text-gray-500 mt-1">API Key: {project.apiKey}</p>
                    </div>
                    <button
                      onClick={() => copyToClipboard(project.apiKey)}
                      className="inline-flex items-center gap-1 px-3 py-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition-colors"
                      title="Copy API key"
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
                  <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
                    <ServerIcon className="h-4 w-4" />
                    <span className="truncate">{project.mongodbUri}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}