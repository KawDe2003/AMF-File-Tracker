import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { decrypt } from '@/lib/auth';

// Paths that don't require authentication
const publicPaths = ['/login', '/api/auth/login'];

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  const isPublicPath = publicPaths.some(p => path.startsWith(p));

  // Get the token from cookies
  const token = request.cookies.get('tracer_session')?.value;

  // Decrypt and verify
  const session = await decrypt(token);

  if (!isPublicPath && !session) {
    // Redirect to login if accessing a protected route without a session
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', path);
    return NextResponse.redirect(loginUrl);
  }

  if (path === '/login' && session) {
    // Already logged in — redirect to dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  const response = NextResponse.next();

  // Pass down user info in headers for server components or API routes
  if (session) {
    response.headers.set('x-user-id', session.id);
    response.headers.set('x-user-role', session.role);
    response.headers.set('x-user-email', session.email);
    response.headers.set('x-user-name', session.name);
    response.headers.set('x-user-calling-agent', session.isCallingAgent ? 'true' : 'false');
  }

  return response;
}

// Run on all routes except Next.js internals and static files
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
