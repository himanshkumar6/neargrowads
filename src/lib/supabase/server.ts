import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Creates a server-side Supabase client using Next.js App Router cookies.
 * Safe for Server Components, Server Actions, and Route Handlers.
 * Request-scoped with cookie Store setAll that strictly preserves deletion maxAge/expires.
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
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, {
                path: '/',
                sameSite: 'lax',
                ...options,
              });
            });
          } catch {
            // The `setAll` method was called from a Server Component.
            // This is expected and safe when middleware is responsible for refreshing user sessions.
          }
        },
      },
    }
  );
}
