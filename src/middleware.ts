import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user');
  const userRole = user ? JSON.parse(user.value).userRole : null;
  
  // Protect /dashboard/users route
  if (request.nextUrl.pathname === '/dashboard/users') {
    if (userRole === 'Viewer') {
      return NextResponse.redirect(new URL('/dashboard/tasks', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/dashboard/:path*',
}; 