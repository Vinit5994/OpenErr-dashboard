import { MongoClient, MongoError } from 'mongodb';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  let client: MongoClient | null = null;
  
  try {
    const { uri } = await req.json();
    console.log(uri);
    if (!uri) {
      return NextResponse.json(
        { error: 'Missing MongoDB URI' },
        { status: 400 }
      );
    }

    // Validate URI format
    if (!uri.startsWith('mongodb://') && !uri.startsWith('mongodb+srv://')) {
      return NextResponse.json(
        { error: 'Invalid MongoDB URI format' },
        { status: 400 }
      );
    }

    // Increase connection timeout values to handle slow connections
    const connectionTimeout = 30000; // 30 seconds instead of 10
    client = new MongoClient(uri, {
      connectTimeoutMS: connectionTimeout,
      serverSelectionTimeoutMS: connectionTimeout * 2, // 60 seconds for server selection
      socketTimeoutMS: connectionTimeout,
      maxPoolSize: 10, // Limit connection pool size
      retryWrites: true, // Enable retry for write operations
      retryReads: true, // Enable retry for read operations
    });

    // Attempt to connect with a timeout promise
    const connectPromise = client.connect();
    await connectPromise;
    
    // Verify connection with a short ping timeout
    await client.db().admin().ping();
    
    const db = client.db('error-log');
    
    // Check if collection exists
    const collections = await db.listCollections().toArray();
    const hasErrorsCollection = collections.some(coll => coll.name === 'errors');
    
    if (!hasErrorsCollection) {
      return NextResponse.json(
        { error: 'Errors collection not found in database' },
        { status: 404 }
      );
    }

    // Fetch logs with error handling
    const logs = await db.collection('errors')
      .find({})
      .sort({ timestamp: -1 }) // Sort by most recent first
      .limit(1000) // Limit to prevent memory issues
      .toArray();

    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    console.error('Error in submit route:', error);

    // Handle specific MongoDB errors
    if (error instanceof MongoError) {
      switch (error.code) {
        case 'ENOTFOUND':
        case 'ETIMEDOUT':
          return NextResponse.json(
            { error: 'Could not connect to MongoDB server. Connection timed out. Please check your connection and try again.' },
            { status: 503 }
          );
        case 'ECONNREFUSED':
          return NextResponse.json(
            { error: 'Connection refused. Please check if the MongoDB server is running.' },
            { status: 503 }
          );
        case 'EACCES':
          return NextResponse.json(
            { error: 'Access denied. Please check your credentials.' },
            { status: 403 }
          );
        default:
          return NextResponse.json(
            { error: `Database error: ${error.message}` },
            { status: 500 }
          );
      }
    }

    // Handle DNS lookup errors (common with MongoDB Atlas)
    if (error instanceof Error && error.message.includes('querySrv ETIMEOUT')) {
      return NextResponse.json(
        { error: 'DNS lookup timeout. Check your network connection or MongoDB Atlas status.' },
        { status: 503 }
      );
    }

    // Handle other types of errors
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  } finally {
    // Always close the connection
    if (client) {
      try {
        await client.close();
      } catch (closeError) {
        console.error('Error closing MongoDB connection:', closeError);
      }
    }
  }
}