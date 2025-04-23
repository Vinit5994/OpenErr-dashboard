import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

// Paths that don't require authentication
const publicPaths = [
  '/',
  '/login',
  '/register',
  '/api/login',
  '/api/register',
  '/api/send-otp',
  '/api/verify-credentials',
  '/_next',
  '/favicon.ico'
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // Check if path is public
  const isPublicPath = publicPaths.some(publicPath => 
    path === publicPath || 
    path.startsWith('/_next') || 
    path.startsWith('/api/_next')
  );
  
  if (isPublicPath) {
    return NextResponse.next();
  }

  // Get the token from the cookies
  const token = request.cookies.get('token')?.value;

  // If no token and trying to access protected route, redirect to login
  if (!token && !isPublicPath) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If token exists and trying to access auth pages, redirect to dashboard
  if (token && (path === '/login' || path === '/register')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
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