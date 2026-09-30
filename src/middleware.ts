import { defineMiddleware } from 'astro:middleware';
import { hasSupabaseConfig } from './lib/supabase/config';
import { getSupabaseServerClient } from './lib/supabase/server';

export const onRequest = defineMiddleware(async (context, next) => {
  const path = context.url.pathname;
  if (!path.startsWith('/admin') || path === '/admin/login' || !hasSupabaseConfig) return next();
  const client = getSupabaseServerClient(context.cookies, context.request);
  const { data: { user } } = await client!.auth.getUser();
  if (!user) {
    const target = encodeURIComponent(path + context.url.search);
    return context.redirect(`/admin/login?next=${target}`);
  }
  context.locals.user = user;
  return next();
});
