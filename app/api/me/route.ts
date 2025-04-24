import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../lib/mongodb';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const email = cookieStore.get('email')?.value;

    if (!email) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
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

    // Remove sensitive data
    const { password, otp, ...userWithoutSensitiveData } = user;
    return NextResponse.json(userWithoutSensitiveData);
  } catch (error) {
    console.error('Error in me route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}