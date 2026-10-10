import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const THIRTY_DAYS_IN_SECONDS = 60 * 60 * 24 * 30; // 30 Days

/**
 * Creates a server-side Supabase client using Next.js App Router cookies.
 * Safe for Server Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();

  const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env['NEXT_PUBLIC_SUPABASE_URL '] || '').trim();
  const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY '] || '').trim();

  return createServerClient(
    supabaseUrl,
    supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, {
                ...options,
                maxAge: THIRTY_DAYS_IN_SECONDS,
                sameSite: 'lax',
                path: '/',
              })
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing user sessions.
          }
        },
      },
    }
  );
}
