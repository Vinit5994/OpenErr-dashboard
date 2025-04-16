// Define all the types used across dashboard components

export interface ErrorLog {
    _id: string;
    errorType: string;
    message: string;
    stackTrace: string;
    url: string;
    userId: string;
    timestamp: number;
    metadata: {
      browser: {
        name: string;
        version: string;
        platform: string;
        language: string;
      };
      device: {
        type: string;
        screenResolution: string;
        orientation: string;
      };
      duplicateCount: number;
      environment: string;
      performance: {
        xhr: number;
        fetch: number;
        long_task: number;
        memory_usage: number;
      };
      resources: Array<unknown>;
      timing: unknown;
    };
  }
  
  export interface ErrorInsights {
    totalErrors: number;
    errorTypes: { [key: string]: number };
    environments: { [key: string]: number };
    browsers: { [key: string]: number };
    devices: { [key: string]: number };
    timeSeries: Array<{ date: string; count: number }>;
    performanceMetrics: {
      avgLoadTime: number;
      avgResponseTime: number;
    };
  }
  
  export interface SeverityLevel {
    color: string;
    bg: string;
    label: string;
  }