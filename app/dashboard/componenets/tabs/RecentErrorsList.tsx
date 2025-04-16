import {getSeverityLevel,formatDate} from '../../utils/helpers'
import {ErrorLog} from '../../utils/types'
interface RecentErrorsListProps {
    errorLogs: ErrorLog[];
    onSelectError: (error: ErrorLog) => void;
  }
export default function RecentErrorsList({ errorLogs, onSelectError }: RecentErrorsListProps) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Error Details</h2>
        <p className="text-gray-600 mb-6">Select an error from the list to view detailed information.</p>
        
        <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider mb-2">Recent Errors</h3>
        <div className="space-y-4">
          {errorLogs.slice(0, 5).map((log) => {
            const severity = getSeverityLevel(log.errorType);
            return (
              <div 
                key={log._id} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                onClick={() => onSelectError(log)}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${severity.bg} ${severity.color} mb-2`}>
                      {severity.label}
                    </span>
                    <h4 className="font-medium text-gray-900">{log.errorType}</h4>
                    <p className="text-sm text-gray-600 mt-1">{log.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{formatDate(log.timestamp)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }