'use client';

import { ErrorLog } from '../../utils/types';
import { formatDate, getSeverityLevel } from '../../utils/helpers';

interface ErrorLogsProps {
  errorLogs: ErrorLog[];
  onViewDetails: (log: ErrorLog) => void;
}

export default function ErrorLogs({ errorLogs, onViewDetails }: ErrorLogsProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">Error Log List</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Error Type</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Environment</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {errorLogs.map((log) => {
            const severity = getSeverityLevel(log.errorType);
            return (
              <tr key={log._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severity.bg} ${severity.color}`}>
                    {severity.label}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{log.errorType}</td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{log.message}</td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">{log.url}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{log.metadata.environment}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">{formatDate(log.timestamp)}</td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <button 
                    onClick={() => onViewDetails(log)}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}