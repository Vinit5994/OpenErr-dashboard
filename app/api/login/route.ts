import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, otp } = body;

    const client = await clientPromise;
    const db = client.db('error-logger');

    const user = await db.collection('users').findOne({ email });
    
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    if (!user.otp || user.otp.code !== otp || new Date(user.otp.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired OTP' },
        { status: 401 }
      );
    }

    // Clear OTP after successful verification
    await db.collection('users').updateOne(
      { email },
      { $unset: { otp: "" } }
    );

    // Create a simple token (just the user ID)
    const token = user._id.toString();

    // Create the response
    const response = NextResponse.json({
      message: 'Login successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        projects: user.projects || [],
      }
    });

    // Set the cookie with proper headers
    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax'
    });

    // Add CORS headers
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    response.headers.set('Access-Control-Allow-Origin', request.headers.get('origin') || '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}