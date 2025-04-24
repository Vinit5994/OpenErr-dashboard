'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { AlertCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { ErrorLog, ErrorInsights } from './utils/types';
import { calculateInsights } from "./utils/helpers";
import NavTabs from './componenets/NavTabs';
import Overview from './componenets/tabs/Overview';
import Timeline from './componenets/tabs/Timeline';
import ErrorLogs from './componenets/tabs/ErrorLogs';
import ErrorDetail from './componenets/tabs/ErrorDetail';
import RecentErrorsList from './componenets/tabs/RecentErrorsList';
import { UserIcon, ArrowLeftOnRectangleIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

export default function Dashboard() {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [insights, setInsights] = useState<ErrorInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);
  const { user, logout } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  const getMongoDBUriForProject = (projectId: string) => {
    if (!user?.projects) return null;
    const project = user.projects.find(p => p.apiKey === projectId);
    return project?.mongodbUri || null;
  };

  const fetchErrorLogs = async (uri: string) => {
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uri: uri,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch error logs');
      }

      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid data format received');
      }

      return data;
    } catch (error) {
      console.error('Error fetching logs:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!selectedProject) {
      toast.error('Please select a project first');
      return;
    }

    setLoading(true);
    try {
      const uri = getMongoDBUriForProject(selectedProject);
      if (!uri) {
        throw new Error('MongoDB URI not found for selected project');
      }

      const logs = await fetchErrorLogs(uri);
      setErrorLogs(logs);
      setInsights(calculateInsights(logs));
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to fetch error logs');
    } finally {
      setLoading(false);
    }
  };

  // Set initial project if user has projects
  useEffect(() => {
    if (user?.projects && user.projects.length > 0 && !selectedProject) {
      setSelectedProject(user.projects[0].apiKey);
    }
  }, [user]);

  // Fetch logs when project changes
  useEffect(() => {
    if (selectedProject) {
      handleSubmit();
    }
  }, [selectedProject]);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
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
            <div className='flex items-center space-x-10'>
              <div>
                {insights && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded text-black">
                      {insights.totalErrors} Errors Tracked
                    </span>
                    <RefreshCw onClick={handleSubmit} className="h-5 w-5 cursor-pointer hover:text-blue-200" />
                  </div>
                )}
              </div>
              {/* Project Selector */}
              {user?.projects && user.projects.length > 0 && (
                <div className="relative">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-black"
                  >
                    {user.projects.map((project) => (
                      <option key={project.apiKey} value={project.apiKey}>
                        {project.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
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
                      onClick={() => router.push('/profile')}
                      className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
                    >
                      <UserIcon className="h-5 w-5" />
                      Profile
                    </button>
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
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
// 'use client';

// import { useEffect, useState, useCallback } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { AlertCircle,  RefreshCw, AlertTriangle } from 'lucide-react';
// import {ErrorLog, ErrorInsights} from './utils/types'
// import { calculateInsights } from "./utils/helpers"
// import NavTabs from './componenets/NavTabs';
// import Overview from './componenets/tabs/Overview';
// import Timeline from './componenets/tabs/Timeline';
// import ErrorLogs from './componenets/tabs/ErrorLogs';
// import ErrorDetail from './componenets/tabs/ErrorDetail';
// import RecentErrorsList from './componenets/tabs/RecentErrorsList';
// import { UserIcon, ArrowLeftOnRectangleIcon, ChevronDownIcon, } from '@heroicons/react/24/outline';
// import { useRouter } from 'next/navigation';
// import { toast } from 'react-hot-toast';

// export default function Dashboard() {
//   const { user, logout } = useAuth();
//   const router = useRouter();
//   const [showUserMenu, setShowUserMenu] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [errors, setErrors] = useState<ErrorLog[]>([]);
//   const [selectedProject, setSelectedProject] = useState<string>('');
//   const [insights, setInsights] = useState<ErrorInsights | null>(null);
//   const [activeTab, setActiveTab] = useState('overview');
//   const [selectedError, setSelectedError] = useState<ErrorLog | null>(null);

//   const handleSubmit = useCallback(async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);

//     try {
//       if (!selectedProject) {
//         throw new Error('Please select a project first');
//       }
// console.log(selectedProject,"selectedProject")
//       const response = await fetch('/api/submit', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ project: selectedProject }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to fetch error logs');
//       }

//       const data = await response.json();
//       if (!data || !Array.isArray(data)) {
//         throw new Error('Invalid data format received');
//       }

//       setErrors(data);
//       const calculatedInsights = calculateInsights(data);
//       setInsights(calculatedInsights);
//     } catch (err) {
//       console.error('Error fetching data:', err);
//       setError(err instanceof Error ? err.message : 'An error occurred while fetching data');
//       toast.error('Failed to fetch error logs');
//     } finally {
//       setIsLoading(false);
//     }
//   }, [selectedProject]);

//   useEffect(() => {
//     const fetchErrors = async () => {
//       if (!selectedProject) return; // Don't fetch if no project is selected

//       try {
//         const response = await fetch('/api/submit', {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ project: selectedProject }),
//         });
// console.log(response,"response")
//         if (!response.ok) {
//           throw new Error('Failed to fetch errors');
//         }

//         const data = await response.json();
//         if (!data || !Array.isArray(data)) {
//           throw new Error('Invalid data format received');
//         }

//         setErrors(data);
//         const calculatedInsights = calculateInsights(data);
//         setInsights(calculatedInsights);
//       } catch (error) {
//         console.error('Error fetching errors:', error);
//         setError(error instanceof Error ? error.message : 'Failed to fetch errors');
//         toast.error('Failed to fetch errors');
//       }
//     };

//     if (selectedProject) {
//       fetchErrors();
//     }
//   }, [selectedProject]);

//   const toggleUserMenu = () => {
//     setShowUserMenu(!showUserMenu);
//   };

  
//   return (
//     <div className="min-h-screen w-full flex flex-col bg-gray-50">
//       {/* Top Navigation Bar */}
//       <nav className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white shadow-md">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center">
//               <AlertCircle className="h-8 w-8 mr-2" />
//               <h1 className="text-xl font-bold">OpenErr Dashboard</h1>
//             </div>
//             <div className='flex items-center space-x-10'>
//             <div>
//               {insights && (
//                 <div className="flex items-center space-x-2">
//                   <span className="text-sm bg-white bg-opacity-20 px-2 py-1 rounded text-black">
//                     {insights.totalErrors} Errors Tracked
//                   </span>
//                   <RefreshCw onClick={handleSubmit} className="h-5 w-5 cursor-pointer hover:text-blue-200" />
//                   </div>
//               )}
//             </div>
//             {/* Project Selector */}
//             {user?.projects && user.projects.length > 0 && (
//               <div className="relative">
//                 <select
//                   value={selectedProject || ''}
//                   onChange={(e) => setSelectedProject(e.target.value)}
//                   className="bg-white bg-opacity-20 border border-white border-opacity-30 rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 text-black"
//                 >
//                   {user.projects.map((project) => (
//                     <option key={project.apiKey} value={project.apiKey}>
//                       {project.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             )}
//             {/* User Menu */}
//             <div className="relative">
//               <button 
//                 onClick={toggleUserMenu}
//                 className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 bg-gray-100 hover:bg-gray-200 rounded-md py-2 px-3 transition-colors"
//               >
//                 <UserIcon className="h-5 w-5" />
//                 <span className="max-w-32 truncate">{user?.name || user?.email}</span>
//                 <ChevronDownIcon className="h-4 w-4" />
//               </button>
              
//               {showUserMenu && (
//                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 border border-gray-200">
//                   <button
//                     onClick={() => router.push('/profile')}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                   >
//                     <UserIcon className="h-5 w-5" />
//                     Profile
//                   </button>
//                   <button
//                     onClick={logout}
//                     className="flex items-center gap-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
//                   >
//                     <ArrowLeftOnRectangleIcon className="h-4 w-4" />
//                     Logout
//                   </button>
//                 </div>
//               )}
//             </div>
//             </div>
//           </div>
//         </div>
//       </nav>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {isLoading && (
//           <div className="flex justify-center items-center py-12">
//             <div className="animate-pulse flex flex-col items-center">
//               <div className="h-12 w-12 bg-blue-200 rounded-full mb-4"></div>
//               <p className="text-lg text-gray-600">Loading your error data...</p>
//             </div>
//           </div>
//         )}

//         {error && (
//           <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6 rounded-lg">
//             <div className="flex">
//               <div className="flex-shrink-0">
//                 <AlertCircle className="h-5 w-5 text-red-400" />
//               </div>
//               <div className="ml-3">
//                 <p className="text-sm text-red-700">{error}</p>
//                 <div className="mt-2 flex items-center space-x-4">
//                   <button
//                     onClick={handleSubmit}
//                     className="text-sm font-medium text-red-700 hover:text-red-600 bg-red-100 px-3 py-1 rounded-md"
//                   >
//                     Try again
//                   </button>
//                   {error.includes('connection') && (
//                     <button
//                       onClick={() => router.push('/settings')}
//                       className="text-sm font-medium text-red-700 hover:text-red-600"
//                     >
//                       Check connection settings
//                     </button>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {!isLoading && !error && !insights && (
//           <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100 text-center">
//             <AlertTriangle className="h-16 w-16 text-blue-500 mx-auto mb-4" />
//             <h2 className="text-2xl font-semibold text-gray-800 mb-2">No Error Data Found</h2>
//             <p className="text-gray-600 max-w-lg mx-auto mb-4">
//               We couldn&apos;t find any error logs in your database. This could mean:
//             </p>
//             <ul className="text-gray-600 text-left max-w-md mx-auto mb-6">
//               <li className="mb-2">• Your application hasn&apos;t generated any errors yet</li>
//               <li className="mb-2">• The error logs are stored in a different collection</li>
//               <li className="mb-2">• Your database connection might need to be updated</li>
//             </ul>
//             <button
//               onClick={handleSubmit}
//               className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
//             >
//               Refresh Data
//             </button>
//           </div>
//         )}

//         {insights && (
//           <div className='w-full'>
//             {/* Tab Navigation */}
//             <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />

//             {/* Overview Tab */}
//             {activeTab === 'overview' && (
//             <Overview insights={insights}/>
//             )}

//             {/* Timeline Tab */}
//             {activeTab === 'timeline' && (
//               <Timeline timeSeries={insights.timeSeries}/>
//             )}

//             {/* Error Logs Tab */}
//             {activeTab === 'logs' && (
//               <ErrorLogs errorLogs={errors} onViewDetails={setSelectedError}/>
//             )}

//             {/* Detailed Analysis Tab */}
//             {activeTab === 'details' && (
//               <div className="space-y-6">
//                 {selectedError ? (
//                   <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//                     <ErrorDetail error={selectedError} onBack={() => setSelectedError(null)}/>
//                       </div>
//                 ) : (
//                   <div className="space-y-6">
//                     <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//                     <RecentErrorsList errorLogs={errors} onSelectError={setSelectedError}/>  
//                     </div>
                    
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//                         <h2 className="text-lg font-semibold text-gray-800 mb-4">Error Frequencies</h2>
//                         <div className="space-y-3">
//                           {Object.entries(insights.errorTypes)
//                             .sort((a, b) => b[1] - a[1])
//                             .slice(0, 5)
//                             .map(([errorType, count]) => (
//                               <div key={errorType} className="flex items-center">
//                                 <div className="w-1/2 font-medium text-gray-700 truncate pr-2">{errorType}</div>
//                                 <div className="flex-1">
//                                   <div className="bg-gray-200 rounded-full h-2.5">
//                                     <div 
//                                       className="bg-blue-600 h-2.5 rounded-full" 
//                                       style={{ width: `${(count / insights.totalErrors) * 100}%` }}
//                                     ></div>
//                                   </div>
//                                 </div>
//                                 <div className="pl-2 text-gray-600 text-sm w-16 text-right">
//                                   {count} ({((count / insights.totalErrors) * 100).toFixed(1)}%)
//                                 </div>
//                               </div>
//                             ))}
//                         </div>
//                       </div>
                      
//                       <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
//                         <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Insights</h2>
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="bg-gray-50 p-4 rounded-lg text-center">
//                             <div className="text-3xl font-bold text-blue-600">
//                               {insights.performanceMetrics.avgLoadTime?.toFixed(2) || "0"}
//                             </div>
//                             <div className="text-gray-600 text-sm mt-1">Avg Load Time (ms)</div>
//                           </div>
//                           <div className="bg-gray-50 p-4 rounded-lg text-center">
//                             <div className="text-3xl font-bold text-green-600">
//                               {insights.performanceMetrics.avgResponseTime?.toFixed(2) || "0"}
//                             </div>
//                             <div className="text-gray-600 text-sm mt-1">Avg Response Time (ms)</div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>
//         )}
//       </div>
      
//       {/* Footer */}
//       <footer className="w-full bg-white mt-12 border-t border-gray-200">
//     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
//       <div className="flex justify-between items-center">
//         <div className="text-gray-500 text-sm">
//         OpenErr Dashboard • Real-time Error Monitoring
//         </div>
//         <div className="text-gray-500 text-sm">
//           &copy; {new Date().getFullYear()} OpenErr.
//         </div>
//       </div>
//     </div>
//   </footer>
//     </div>
//   );
// }