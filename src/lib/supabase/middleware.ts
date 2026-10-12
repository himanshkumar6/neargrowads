import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

/**
 * Validates, refreshes, and manages Supabase Auth sessions across all incoming requests.
 * Complies with official Next.js App Router and @supabase/ssr best practices:
 * 1. Synchronizes cookies between request headers and response headers.
 * 2. Accurately propagates session deletions (maxAge: 0) instead of overwriting with default lifetimes.
 * 3. Preserves set-cookie headers across redirects to prevent stale session loops.
 * 4. Automatically purges invalidated refresh tokens (code: refresh_token_not_found) to stop terminal log flooding.
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return supabaseResponse;
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, {
              path: '/',
              sameSite: 'lax',
              ...options,
            })
          );
        },
      },
    }
  );

  // Helper to ensure all cookies attached to supabaseResponse are preserved on redirect responses
  const createRedirect = (url: URL) => {
    const redirectResponse = NextResponse.redirect(url);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value, cookie);
    });
    return redirectResponse;
  };

  let user = null;

  let isSessionInvalid = false;
  const hasAuthCookies = request.cookies.getAll().some((c) =>
    c.name.startsWith('sb-') || c.name.includes('supabase') || c.name.includes('auth-token')
  );

  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      // Specifically identify invalid / revoked refresh tokens (e.g. refresh_token_not_found, validation_failed)
      // Exclude simple AuthSessionMissingError (which occurs when unauthenticated users visit)
      const isInvalidRefreshToken =
        hasAuthCookies &&
        error.name !== 'AuthSessionMissingError' &&
        (error.code === 'refresh_token_not_found' ||
          error.code === 'validation_failed' ||
          error.message?.toLowerCase().includes('refresh token'));

      if (isInvalidRefreshToken) {
        isSessionInvalid = true;
        // Clear all Supabase auth cookie chunks from the response so the browser stops sending
        // the defunct refresh token on subsequent requests.
        const allCookies = request.cookies.getAll();
        allCookies.forEach((c) => {
          if (
            c.name.startsWith('sb-') ||
            c.name.includes('supabase') ||
            c.name.includes('auth-token')
          ) {
            supabaseResponse.cookies.set(c.name, '', {
              path: '/',
              maxAge: 0,
              expires: new Date(0),
              sameSite: 'lax',
            });
          }
        });
      }
    } else {
      user = data.user;
    }
  } catch (err: unknown) {
    const authErr = err as { name?: string; code?: string; message?: string; status?: number };
    const isInvalidRefreshToken =
      hasAuthCookies &&
      authErr?.name !== 'AuthSessionMissingError' &&
      (authErr?.code === 'refresh_token_not_found' ||
        authErr?.code === 'validation_failed' ||
        authErr?.message?.toLowerCase().includes('refresh token'));

    if (isInvalidRefreshToken) {
      isSessionInvalid = true;
      const allCookies = request.cookies.getAll();
      allCookies.forEach((c) => {
        if (
          c.name.startsWith('sb-') ||
          c.name.includes('supabase') ||
          c.name.includes('auth-token')
        ) {
          supabaseResponse.cookies.set(c.name, '', {
            path: '/',
            maxAge: 0,
            expires: new Date(0),
            sameSite: 'lax',
          });
        }
      });
    }
  }

  const pathname = request.nextUrl.pathname;

  // Protect all admin routes except the login page
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin/login';
      // Preserve returnUrl for legitimate post-login redirection if not already dashboard
      if (pathname !== '/admin' && pathname !== '/admin/dashboard') {
        url.searchParams.set('returnUrl', pathname);
      }
      if (isSessionInvalid) {
        url.searchParams.set('reason', 'session_expired');
      }
      return createRedirect(url);
    }
  }

  // Redirect authenticated users away from login pages
  if (user) {
    if (pathname === '/login' || pathname === '/admin/login') {
      const url = request.nextUrl.clone();
      const returnUrl = request.nextUrl.searchParams.get('returnUrl');
      // Validate that returnUrl is an internal route to prevent open redirect vulnerabilities
      if (returnUrl && returnUrl.startsWith('/admin') && !returnUrl.startsWith('/admin/login')) {
        url.pathname = returnUrl;
        url.searchParams.delete('returnUrl');
      } else {
        url.pathname = '/admin/dashboard';
        url.searchParams.delete('returnUrl');
      }
      return createRedirect(url);
    }
  }

  return supabaseResponse;
}
