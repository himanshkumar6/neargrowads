import { createClient } from '@supabase/supabase-js';

/**
 * Privileged Service Role Supabase Client.
 * WARNING: Bypasses RLS. Use ONLY for admin signup / auth triggers / system background tasks.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL configuration');
  }

  let keyToUse = serviceRoleKey;

  // Validate that the service role key belongs to the current Supabase project ref
  if (serviceRoleKey && supabaseUrl) {
    try {
      const parts = serviceRoleKey.trim().split('.');
      if (parts.length === 3) {
        const payloadJson = Buffer.from(parts[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadJson);
        const expectedRef = new URL(supabaseUrl).hostname.split('.')[0];
        if (payload.ref && expectedRef && payload.ref !== expectedRef) {
          console.warn(
            `[Supabase Admin] WARNING: SUPABASE_SERVICE_ROLE_KEY is for project "${payload.ref}" but NEXT_PUBLIC_SUPABASE_URL is for "${expectedRef}". Falling back to anon key.`
          );
          keyToUse = anonKey;
        }
      }
    } catch {
      // In case of parsing error, keep serviceRoleKey or fallback
    }
  }

  const finalKey = keyToUse || anonKey;
  if (!finalKey) {
    throw new Error('Missing Supabase API key configuration');
  }

  return createClient(supabaseUrl, finalKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
