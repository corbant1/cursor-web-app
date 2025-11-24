import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;
  
  // Allow access to manual-login, API routes, and static files
  const publicPaths = ['/manual-login', '/api', '/_next', '/favicon.ico'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Skip middleware for public paths
  if (isPublicPath) {
    return NextResponse.next();
  }
  
  // Get the access token from cookies
  const accessToken = request.cookies.get('mfiles_access_token');
  
  // If accessing a protected route without a token, redirect to login
  if (!accessToken) {
    const loginUrl = new URL('/manual-login', request.url);
    // Add a return URL so we can redirect back after login
    loginUrl.searchParams.set('returnTo', pathname);
    return NextResponse.redirect(loginUrl);
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

