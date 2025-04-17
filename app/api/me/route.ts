import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

interface JwtPayload {
  userId: string;
  email: string;
}

export async function GET() {
  try {
    // Get token from cookies - use the response for type safety
    const cookieStore =await cookies();
    const token = cookieStore.get('auth_token')?.value;
    console.log(token)
    if (!token) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    // Verify token
    const decoded = verify(token, JWT_SECRET) as JwtPayload;
   
    // Connect to database
    const client = await clientPromise;
    const db = client.db('error-logger');
   
    // Find user
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } } // Exclude password
    );

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        apikey:user.apiKey
      }
    });
  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}