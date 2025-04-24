// lib/db.js or lib/db.ts
import { MongoClient, Db } from 'mongodb';
import { User } from '@/app/types/index';

if (!process.env.MONGODB_URI) {
  throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}

const uri = process.env.MONGODB_URI;
const options = {};

interface GlobalWithMongo {
  _mongoClientPromise?: Promise<MongoClient>;
}

const globalWithMongo = global as GlobalWithMongo;

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options);
    globalWithMongo._mongoClientPromise = client.connect();
  }
  clientPromise = globalWithMongo._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

// Export a module-scoped MongoClient promise. By doing this in a
// separate module, the client can be shared across functions.
export default clientPromise;

export type Collections = {
  users: User;
};

interface CachedDb {
  client: MongoClient;
  db: Db;
}

// Create a singleton instance
let cachedDb: CachedDb | null = null;

export async function connectToDatabase() {
  if (cachedDb) {
    try {
      // Verify the connection is still alive
      await cachedDb.db.command({ ping: 1 });
      return cachedDb;
    } catch (error) {
      console.error('Error connecting to database:', error);
      // If the connection is dead, clear the cache and reconnect
      cachedDb = null;
    }
  }

  try {
    const client = await clientPromise;
    
    if (!client) {
      throw new Error('Failed to connect to MongoDB');
    }

    const db = client.db('error-logger');
    
    // Cache the database connection
    cachedDb = { client, db };
    
    return cachedDb;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw new Error('Failed to connect to database');
  }
}
