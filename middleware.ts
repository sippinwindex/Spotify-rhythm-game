import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import type { Session } from 'next-auth'; // For req.auth type

import { auth } from './auth'; // Adjust path if needed

export const middleware = auth(
  (req: NextRequest & { auth: Session | null }) => {
    if (!req.auth) {
      const signInUrl = new URL('/api/auth/signin', req.url);
      return NextResponse.redirect(signInUrl);
    }
    return NextResponse.next();
  }
);

export const config = {
  matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico).*)'],
};
