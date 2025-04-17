import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import clientPromise from '../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Connect to our database
    const client = await clientPromise;
    const db = client.db('error-logger');

    // Find user by email
    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Create JWT token
    const token = sign(
      { 
        userId: user._id.toString(),
        email: user.email
      }, 
      JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Create response with user data
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
    
    // Set cookie on response
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'strict'
    });
    console.log(response,"response")
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}