'use client';

import { useState } from 'react';

import { AlertCircle,  RefreshCw, AlertTriangle } from 'lucide-react';
import {ErrorLog, ErrorInsights} from './utils/types'
import { calculateInsights } from "./utils/helpers"
import NavTabs from './componenets/NavTabs';
import Overview from './componenets/tabs/Overview';
import Timeline from './componenets/tabs/Timeline';
import ErrorLogs from './componenets/tabs/ErrorLogs';
import ErrorDetail from './componenets/tabs/ErrorDetail';
import RecentErrorsList from './componenets/tabs/RecentErrorsList';
export default function Dashboard() {
  const [email, setEmail] = useState('');
  // const [mongodbUri, setMongodbUri] = useState('');
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [insights, setInsights] = useState<ErrorInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

  const fetchUserMongoDBUri = async () => {
    try {
      const response = await fetch('/api/get-mongodb-uri', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      if (data.mongodbUri) {
        // setMongodbUri(data.mongodbUri);
        return data.mongodbUri;
      }
    } catch (error) {
      console.error('Error fetching MongoDB URI:', error);
    }
    return null;
  };

  const fetchErrorLogs = async (uri: string) => {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        uri: uri,
      }),
    });

    const data = await res.json();
    return data;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const uri = await fetchUserMongoDBUri();
      if (uri) {
        const logs = await fetchErrorLogs(uri);
        setErrorLogs(logs);
        setInsights(calculateInsights(logs));
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <AlertCircle className="h-8 w-8 mr-2" />
              <h1 className="text-xl font-bold">OpenErr Dashboard</h1>
            </div>
            <div>
              {insights && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded text-black">
                    {insights.totalErrors} Errors Tracked
                  </span>
                  <RefreshCw onClick={() => handleSubmit} className="h-5 w-5 cursor-pointer hover:text-blue-200" />
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Form */}
        <div className="mb-8 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email to access your error logs"
                className="flex-1 p-3 text-black border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-3 rounded-md font-medium shadow-sm"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Fetch Error Data'}
              </button>
            </div>
          </form>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
              <p className="text-lg text-gray-600">Loading your error data...</p>
            </div>
          </div>
        )}

        {!loading && !insights && (
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
            <AlertTriangle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">Welcome to ErrorGuard</h2>
            <p className="text-gray-600 max-w-lg mx-auto">
              Enter your email address to fetch your application&apos;s error monitoring data. 
              Track, analyze, and fix errors to improve your user experience.
            </p>
          </div>
        )}

        {insights && (
          <div className='w-full'>
            {/* Tab Navigation */}
            <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

            {/* Overview Tab */}
            {activeTab === 'overview' && (
            <Overview insights={insights}/>
            )}

            {/* Timeline Tab */}
            {activeTab === 'timeline' && (
              <Timeline timeSeries={insights.timeSeries}/>
            )}

            {/* Error Logs Tab */}
            {activeTab === 'logs' && (
              <ErrorLogs errorLogs={errorLogs} onViewDetails={setSelectedError}/>
            )}

            {/* Detailed Analysis Tab */}
            {activeTab === 'details' && (
              <div className="space-y-6">
                {selectedError ? (
                  <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <ErrorDetail error={selectedError} onBack={() => setSelectedError(null)}/>
                      </div>
                ) : (
                  <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                    <RecentErrorsList errorLogs={errorLogs} onSelectError={setSelectedError}/>  
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Error Frequencies</h2>
                        <div className="space-y-3">
                          {Object.entries(insights.errorTypes)
                            .sort((a, b) => b[1] - a[1])
                            .slice(0, 5)
                            .map(([errorType, count]) => (
                              <div key={errorType} className="flex items-center">
                                <div className="w-1/2 font-medium text-gray-700 truncate pr-2">{errorType}</div>
                                <div className="flex-1">
                                  <div className="bg-gray-200 rounded-full h-2.5">
                                    <div 
                                      className="bg-blue-600 h-2.5 rounded-full" 
                                      style={{ width: `${(count / insights.totalErrors) * 100}%` }}
                                    ></div>
                                  </div>
                                </div>
                                <div className="pl-2 text-gray-600 text-sm w-16 text-right">
                                  {count} ({((count / insights.totalErrors) * 100).toFixed(1)}%)
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                      
                      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h2>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-blue-600">
                              {insights.performanceMetrics.avgLoadTime?.toFixed(2) || "0"}
                            </div>
                            <div className="text-gray-600 text-sm mt-1">Avg Load Time (ms)</div>
                          </div>
                          <div className="bg-gray-50 p-4 rounded-lg text-center">
                            <div className="text-3xl font-bold text-green-600">
                              {insights.performanceMetrics.avgResponseTime?.toFixed(2) || "0"}
                            </div>
                            <div className="text-gray-600 text-sm mt-1">Avg Response Time (ms)</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Footer */}
      <footer className="w-full bg-white mt-12 border-t border-gray-200">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="flex justify-between items-center">
        <div className="text-gray-500 text-sm">
        OpenErr Dashboard • Real-time Error Monitoring
        </div>
        <div className="text-gray-500 text-sm">
          &copy; {new Date().getFullYear()} ErrorGuard, Inc.
        </div>
      </div>
    </div>
  </footer>
    </div>
  );
}