// lib/db.js or lib/db.ts
import { MongoClient } from 'mongodb';
import { User } from '@/app/types/index';

if (!process.env.MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;

export type Collections = {
  users: User;
};

export async function connectToDatabase() {
  const client = await clientPromise;
  const db = client.db('error-logger');
  return { client, db };
}
