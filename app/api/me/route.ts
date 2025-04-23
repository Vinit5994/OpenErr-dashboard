import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

export async function GET(request: Request) {
  try {
    // Get token from cookies
    const cookieStore =await cookies();
    const token = cookieStore.get('token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
    }

    try {
      // Connect to database
      const client = await clientPromise;
      const db = client.db('error-logger');
      
      // Find user by ID
      const user = await db.collection('users').findOne(
        { _id: new ObjectId(token) },
        { projection: { password: 0 } } // Exclude password
      );

      if (!user) {
        const response = NextResponse.json(
          { error: 'User not found' },
          { 
            status: 404,
            headers: {
              'Access-Control-Allow-Credentials': 'true',
              'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
              'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Authorization'
            }
          }
        );
        response.cookies.delete('token');
        return response;
      }

      const response = NextResponse.json({
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          projects: user.projects,
          apikey: user.apiKey
        }
      });

      // Add CORS headers
      response.headers.set('Access-Control-Allow-Credentials', 'true');
      response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
      response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

      return response;
    } catch (error) {
      console.log(error)
      // Invalid token format
      const response = NextResponse.json(
        { error: 'Invalid token' },
        { 
          status: 401,
          headers: {
            'Access-Control-Allow-Credentials': 'true',
            'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization'
          }
        }
      );
      response.cookies.delete('token');
      return response;
    }
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { 
        status: 401,
        headers: {
          'Access-Control-Allow-Credentials': 'true',
          'Access-Control-Allow-Origin': request.headers.get('origin') || '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization'
        }
      }
    );
  }
}