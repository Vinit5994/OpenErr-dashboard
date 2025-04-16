'use client';

import { ErrorLog } from '../../utils/types';
// import { formatDate } from '../../utils/helpers';

interface ErrorDetailProps {
  error: ErrorLog;
  onBack: () => void;
}

interface ErrorDetailProps {
  error: ErrorLog;
  onBack: () => void;
}

function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

export default function ErrorDetail({ error, onBack }: ErrorDetailProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-800">{error.errorType}</h2>
          <p className="text-gray-600 mt-1">{error.message}</p>
        </div>
        <button 
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Back to all errors
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Basic Info</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">URL:</span>
              <span className="text-gray-900 font-medium">{error.url}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Environment:</span>
              <span className="text-gray-900 font-medium">{error.metadata.environment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Date:</span>
              <span className="text-gray-900 font-medium">{formatDate(error.timestamp)}</span>
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 mt-6">Browser & Device</h3>
          <div className="bg-gray-50 p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Browser:</span>
              <span className="text-gray-900 font-medium">{`${error.metadata.browser.name} ${error.metadata.browser.version}`}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Platform:</span>
              <span className="text-gray-900 font-medium">{error.metadata.browser.platform}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Device Type:</span>
              <span className="text-gray-900 font-medium">{error.metadata.device.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Screen:</span>
              <span className="text-gray-900 font-medium">{error.metadata.device.screenResolution}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Orientation:</span>
              <span className="text-gray-900 font-medium">{error.metadata.device.orientation}</span>
            </div>
          </div>
        </div>
        
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Performance Metrics</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-blue-600">
                {error.metadata.performance.xhr?.toFixed(2) || "0"}
              </div>
              <div className="text-gray-600 text-sm mt-1">XHR (ms)</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-green-600">
                {error.metadata.performance.fetch?.toFixed(2) || "0"}
              </div>
              <div className="text-gray-600 text-sm mt-1">Fetch (ms)</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-yellow-600">
                {error.metadata.performance.long_task || "0"}
              </div>
              <div className="text-gray-600 text-sm mt-1">Long Task (ms)</div>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-purple-600">
                {((error.metadata.performance.memory_usage || 0) / (1024 * 1024)).toFixed(2)}
              </div>
              <div className="text-gray-600 text-sm mt-1">Memory (MB)</div>
            </div>
          </div>
          
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2 mt-6">Stack Trace</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <pre className="text-xs text-gray-800 overflow-x-auto whitespace-pre-wrap break-words max-h-64 overflow-y-auto">
              {error.stackTrace}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}