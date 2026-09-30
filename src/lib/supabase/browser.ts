import { createBrowserClient } from '@supabase/ssr';
import { hasSupabaseConfig, supabaseAnonKey, supabaseUrl } from './config';

export function getSupabaseBrowserClient() {
  if (!hasSupabaseConfig) return null;
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
