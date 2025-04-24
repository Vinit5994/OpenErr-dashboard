import { ObjectId } from 'mongodb';

export interface Project {
  _id: ObjectId;
  name: string;
  apiKey: string;
  mongodbUri: string;
  createdAt: Date;
  errors: ErrorLog[];
}

export interface ErrorLog {
  _id: ObjectId;
  message: string;
  stackTrace: string;
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export interface User {
  _id: ObjectId;
  name: string;
  email: string;
  password: string;
  apiKey: string;
  projects: Project[];
  createdAt: Date;
  updatedAt: Date;
}

export interface ErrorLogRequest {
  apiKey: string;
  error: {
    message: string;
    stackTrace: string;
    metadata?: Record<string, unknown>;
  };
} 