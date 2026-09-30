import { projectBlockSchema, type ProjectBlock } from './project-blocks';
import type { ContentMedia } from './sections';
import { getSupabaseServerClient } from './supabase/server';
import type { ProjectBlockRow, ProjectRow } from '../types/database';
import type { AstroCookies } from 'astro';

export interface DatabaseProject extends ProjectRow { project_blocks: ProjectBlockRow[] }

export function parseCover(value: unknown): ContentMedia | null {
  if (!value || typeof value !== 'object') return null;
  const media = value as Partial<ContentMedia> & { url?: string; placeholder?: boolean; width?: number; height?: number; alt?: string };
  if (media.placeholder === true && media.width && media.height && media.alt) {
    return { placeholder: true, width: media.width, height: media.height, alt: media.alt, ...('caption' in media && media.caption ? { caption: String(media.caption) } : {}) };
  }
  return media.url && media.width && media.height && media.alt
    ? { url: media.url, width: media.width, height: media.height, alt: media.alt, ...('caption' in media && media.caption ? { caption: String(media.caption) } : {}) }
    : null;
}

export function databaseBlocks(project: DatabaseProject): ProjectBlock[] {
  const cover = parseCover(project.cover_image);
  const hero: ProjectBlock = {
    id: 'hero', type: 'hero', title: project.title, subtitle: project.subtitle ?? project.summary,
    year: project.year, role: project.role ? [project.role] : [], tools: [], categories: [project.category],
    ...(cover ? { cover: { media: cover, fit: 'contain' as const } } : {}),
  };
  const blocks = [...(project.project_blocks ?? [])].sort((a, b) => a.sort_order - b.sort_order).flatMap((row) => {
    const parsed = projectBlockSchema.safeParse({ id: `block-${row.id}`, type: row.type, ...(row.content as object) });
    if (!parsed.success) { console.warn(`忽略无效 block ${row.id}`, parsed.error.message); return []; }
    return [parsed.data];
  });
  return [hero, ...blocks];
}

export async function getDatabaseProjects(options: { includeDrafts?: boolean; id?: string; slug?: string; cookies?: AstroCookies; request?: Request } = {}): Promise<DatabaseProject[]> {
  const client = getSupabaseServerClient(options.cookies, options.request);
  if (!client) return [];
  let query = client.from('projects').select('*, project_blocks(*)').order('sort_order').order('sort_order', { referencedTable: 'project_blocks' });
  if (!options.includeDrafts) query = query.eq('status', 'published');
  if (options.id) query = query.eq('id', options.id);
  if (options.slug) query = query.eq('slug', options.slug);
  const { data, error } = await query;
  if (error) throw new Error(`Supabase projects query failed: ${error.message}`);
  return (data ?? []) as unknown as DatabaseProject[];
}
