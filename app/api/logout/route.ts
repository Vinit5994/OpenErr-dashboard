import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET() {
  const cookieStore =await cookies();

  // Clear the auth_token by setting it with an expired maxAge
  cookieStore.set('token', '', {
    httpOnly: true,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // Expire immediately
    sameSite: 'strict',
  });

  return NextResponse.json({ message: 'Logged out successfully' });
}
