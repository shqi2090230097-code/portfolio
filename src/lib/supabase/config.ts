export const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL?.trim() ?? '';
export const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY?.trim() ?? '';
// The checked-in setup instructions use human-readable placeholders. Treat them
// as unconfigured so the public preview can still use Content Collections.
let validUrl = false;
try {
  const parsed = new URL(supabaseUrl);
  validUrl = parsed.protocol === 'https:' || (parsed.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(parsed.hostname));
} catch { /* not a URL */ }
export const hasSupabaseConfig = validUrl && supabaseAnonKey.length > 20 && !supabaseAnonKey.includes('你的');
