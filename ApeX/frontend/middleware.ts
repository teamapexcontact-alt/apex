import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Generate a random nonce for each request
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');

  // Create CSP header with nonce for inline scripts
  const cspHeader = [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' https://www.googletagmanager.com https://challenges.cloudflare.com`,
    "style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com",
    "img-src 'self' data:",
    "connect-src 'self' https://*.firebaseio.com https://*.googleapis.com https://*.firebaseapp.com https://*.firebasestorage.app https://*.resend.com https://*.upstash.io https://www.googletagmanager.com https://challenges.cloudflare.com",
    "font-src 'self' https://cdn.jsdelivr.net https://fonts.gstatic.com",
    "frame-src https://challenges.cloudflare.com",
    "frame-ancestors 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ].join('; ');

  // Set the nonce in a response header so it can be accessed in the app
  const response = NextResponse.next();
  response.headers.set('x-nonce', nonce);
  response.headers.set('Content-Security-Policy', cspHeader);
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), interest-cohort=()');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next (Next.js internal resources)
     * - favicon.ico (favicon file)
     * - 404 (404 page)
     * - _not-found (excl static 404 page builder)
     */
    '/((?!api|_next|favicon.ico|404|_not-found).*)',
  ],
};
