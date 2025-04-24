import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';

export async function POST(req: Request) {
  try {
    const { email, otp } = await req.json();

    if (!email || !otp) {
      return NextResponse.json(
        { error: 'Email and OTP are required' },
        { status: 400 }
      );
    }

    // Connect to database
    const { db } = await connectToDatabase();

    // Find user by email
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Check if OTP exists and is not expired
    if (!user.otp || !user.otp.code || !user.otp.expiresAt) {
      return NextResponse.json(
        { error: 'OTP not found or expired' },
        { status: 400 }
      );
    }

    // Check if OTP is expired
    if (new Date() > new Date(user.otp.expiresAt)) {
      return NextResponse.json(
        { error: 'OTP has expired' },
        { status: 400 }
      );
    }

    // Verify OTP
    if (user.otp.code !== otp) {
      return NextResponse.json(
        { error: 'Invalid OTP' },
        { status: 400 }
      );
    }

    // Clear OTP after successful verification
    await db.collection('users').updateOne(
      { email },
      { $unset: { otp: "" } }
    );

    // Remove sensitive data before sending response
    const { password, otp: _, ...userData } = user;

    return NextResponse.json({
      success: true,
      user: userData
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 