import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const isAuthenticated = request.cookies.get('isAdminAuthenticated');
  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (!isAuthenticated && !isLoginPage) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  if (isAuthenticated && isLoginPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};