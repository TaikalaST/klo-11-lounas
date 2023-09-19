import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { appConfig } from '@config';

export async function middleware(request: NextRequest) {
  const requestUrl = new URL(request.url);
  console.log(Array.from(requestUrl.searchParams.entries()));

  // Check if the hostname is allowed
  if (
    !appConfig.allowedHosts.some((allowedHost) =>
      allowedHost.test(requestUrl.hostname)
    )
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Redirect vercel cron jobs to the production url
  // TODO: Probably caused by bug in Vercel, remove when fixed
  if (
    request.headers.get('user-agent') === 'vercel-cron/1.0' &&
    !requestUrl.searchParams.has('redirected')
  ) {
    const redirectUrl = new URL(request.url);
    redirectUrl.hostname = 'klo-11-lounas.vercel.app';
    redirectUrl.searchParams.set('redirected', 'true');
    console.log(`Redirecting to ${redirectUrl.toString()}`);

    await fetch(redirectUrl.toString(), {
      headers: {
        'User-Agent': 'vercel-cron/1.0',
      },
    });
    return NextResponse.json({ status: 'ok' }, { status: 200 });
  }

  console.log(`Allowed request from ${requestUrl.hostname}`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    /* FOR_FUTURE_REF:
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * '/((?!_next/static|_next/image|favicon.ico).*)'
     */
    '/api/:path*',
  ],
};
