import { ErrorLog, ErrorInsights, SeverityLevel } from './types';

// Format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  return new Date(timestamp).toLocaleString();
};

// Format severity level based on error type
export const getSeverityLevel = (errorType: string): SeverityLevel => {
  if (errorType.includes('Fatal') || errorType.includes('Crash')) {
    return { color: 'text-red-600', bg: 'bg-red-100', label: 'Critical' };
  } else if (errorType.includes('Error')) {
    return { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Error' };
  } else if (errorType.includes('Warning')) {
    return { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Warning' };
  } else {
    return { color: 'text-blue-600', bg: 'bg-blue-100', label: 'Info' };
  }
};

// Calculate insights from error logs
export const calculateInsights = (logs: ErrorLog[]): ErrorInsights => {
  const errorTypes: { [key: string]: number } = {};
  const environments: { [key: string]: number } = {};
  const browsers: { [key: string]: number } = {};
  const devices: { [key: string]: number } = {};
  const timeSeries: { [key: string]: number } = {};
  let totalLoadTime = 0;
  let totalResponseTime = 0;

  logs.forEach((log: ErrorLog) => {
    // Count error types
    errorTypes[log.errorType] = (errorTypes[log.errorType] || 0) + 1;
    
    // Count environments
    environments[log.metadata.environment] = (environments[log.metadata.environment] || 0) + 1;
    
    // Count browsers
    const browserKey = `${log.metadata.browser.name} ${log.metadata.browser.version}`;
    browsers[browserKey] = (browsers[browserKey] || 0) + 1;
    
    // Count devices
    devices[log.metadata.device.type] = (devices[log.metadata.device.type] || 0) + 1;
    
    // Time series data
    const date = new Date(log.timestamp).toISOString().split('T')[0];
    timeSeries[date] = (timeSeries[date] || 0) + 1;
    
    // Performance metrics
    totalLoadTime += log.metadata.performance.fetch || 0;
    totalResponseTime += log.metadata.performance.long_task || 0;
  });

  return {
    totalErrors: logs.length,
    errorTypes,
    environments,
    browsers,
    devices,
    timeSeries: Object.entries(timeSeries).map(([date, count]) => ({ date, count })).sort((a, b) => a.date.localeCompare(b.date)),
    performanceMetrics: {
      avgLoadTime: logs.length ? totalLoadTime / logs.length : 0,
      avgResponseTime: logs.length ? totalResponseTime / logs.length : 0,
    },
  };
};

export const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];