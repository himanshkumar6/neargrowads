import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

declare global {
  interface Window {
    __is_redirecting_to_login?: boolean;
  }
}

/**
 * Defensive Murphy's Law Centralized Auth Guard Helper
 * Prevents race conditions, duplicate toasts, and infinite redirect loops.
 */
export async function handleSessionExpired() {
  if (typeof window === 'undefined') return;

  // Murphy's Law Guard #1: Lock flag to prevent multiple concurrent execution loops
  if (window.__is_redirecting_to_login) return;
  window.__is_redirecting_to_login = true;

  // Murphy's Law Guard #2: Check if already on login page
  if (window.location.pathname.startsWith('/admin/login')) {
    window.__is_redirecting_to_login = false;
    return;
  }

  // Murphy's Law Guard #3: Clean storage purge & Supabase Auth Cookie Destroy
  try {
    localStorage.clear();
    sessionStorage.clear();
    const supabase = createClient();
    await supabase.auth.signOut().catch(() => {});
  } catch (err) {
    console.warn('Storage purge warning:', err);
  }

  // Murphy's Law Guard #4: Single deduplicated Sonner toast ID
  toast.error('Session Expired: Please log in with HR Admin credentials', {
    id: 'session-expired-global',
    duration: 4000,
  });

  // Murphy's Law Guard #5: Immediate hard redirect to auth page with branded transition
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('neargrow:navigation-start', { detail: { href: '/admin/login' } })
    );
  }
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.href = '/admin/login';
}

/**
 * Defensive Fetch Interceptor Helper
 * Automatically handles 401/403 responses from API routes cleanly.
 */
export async function secureFetch(url: string, init?: RequestInit): Promise<Response> {
  const res = await fetch(url, init);
  if (res.status === 401 || res.status === 403) {
    handleSessionExpired();
  }
  return res;
}
