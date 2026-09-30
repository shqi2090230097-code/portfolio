import { createServerClient, parseCookieHeader } from '@supabase/ssr';
import type { AstroCookies } from 'astro';
import { hasSupabaseConfig, supabaseAnonKey, supabaseUrl } from './config';

export function getSupabaseServerClient(cookies?: AstroCookies, request?: Request) {
  if (!hasSupabaseConfig) return null;
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll: () => parseCookieHeader(request?.headers.get('cookie') ?? ''),
      setAll: (items) => items.forEach(({ name, value, options }) => cookies?.set(name, value, options)),
    },
  });
}
