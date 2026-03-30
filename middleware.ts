import { NextRequest, NextResponse } from 'next/server';

const ROOT_DOMAIN = 'taxclaim.virtuallaunch.pro';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host') ?? '';
  // Strip port for local dev
  const hostname = host.split(':')[0];

  // Check if this is a subdomain request
  if (!hostname.endsWith(`.${ROOT_DOMAIN}`)) {
    return NextResponse.next();
  }

  const subdomain = hostname.replace(`.${ROOT_DOMAIN}`, '');

  // Skip www and empty subdomains
  if (!subdomain || subdomain === 'www') {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();

  // Only rewrite if not already on /claim path
  if (!url.pathname.startsWith('/claim/')) {
    url.pathname = `/claim/${subdomain}${url.pathname === '/' ? '' : url.pathname}`;
    const response = NextResponse.rewrite(url);
    response.headers.set('x-pro-slug', subdomain);
    return response;
  }

  const response = NextResponse.next();
  response.headers.set('x-pro-slug', subdomain);
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
