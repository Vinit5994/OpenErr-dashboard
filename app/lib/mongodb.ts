// lib/db.js or lib/db.ts
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
console.log("uri",uri);
if (!uri) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

const client = new MongoClient(uri);
const clientPromise = client.connect();

export default clientPromise;
