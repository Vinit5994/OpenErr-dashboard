import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Paths that don't require authentication
const publicPaths = ['/', '/login', '/api/login', '/api/register'];

export function middleware(request: NextRequest) {
  // Get the path of the request
  const path = request.nextUrl.pathname;
  
  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || path.startsWith('/api/_next')
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get('auth_token')?.value;

  // If no token, redirect to login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    // Verify token
    verify(token, JWT_SECRET);
    return NextResponse.next();
  } catch (error) {
    console.log(error)
    // If token is invalid, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};