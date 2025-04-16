export interface User {
  _id?: string;
  name: string;
  email: string;
  apiKey: string;
  mongodbUri: string;
  createdAt?: Date;
}

export interface ErrorLog {
  _id?: string;
  userId: string;
  errorType: string;
  message: string;
  stackTrace?: string;
  url?: string;
  metadata?: Record<string, unknown>;
  timestamp?: Date;
}

export interface ErrorLogRequest {
  errors: Array<{
    type: string;
    message: string;
    stack?: string;
    url?: string;
    metadata?: Record<string, unknown>;
  }>;
} 