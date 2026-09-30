import { getCollection, type CollectionEntry } from 'astro:content';
import { stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { databaseBlocks, getDatabaseProjects, parseCover, type DatabaseProject } from './projects-repository';
import type { ContentMedia, ContentSection } from './sections';
import type { ProjectBlock } from './project-blocks';

export type LocalWork = CollectionEntry<'projects'> | CollectionEntry<'archive'>;
export interface RemoteWork {
  collection: 'projects'; id: string; source: 'supabase'; body?: string;
  data: {
    title: string; date: string; year: number; type: 'project'; status: 'published'; category: string;
    tags: string[]; cover: ContentMedia | null; summary: string; featured: boolean;
    themeBackground?: string; sections?: ContentSection[]; blocks: ProjectBlock[]; sortOrder: number;
  };
}
export type Work = LocalWork | RemoteWork;
export type WorkCollection = Work['collection'];

export function workUrl(work: Work): string {
  return `/${work.collection}/${work.id}`;
}

export function mediaUrl(work: Work, file: string): string {
  return `/media/${work.collection}/${work.id}/${file}`;
}

export function workDirectory(work: Work): string {
  if ('source' in work) throw new Error('远程作品没有本地内容目录');
  return resolve('content', work.collection, work.id);
}

// 所有公开页面、详情路径、媒体输出只从这里读取内容。默认拒绝非 published。
export async function getPublishedWorks(collection?: WorkCollection): Promise<Work[]> {
  const local: LocalWork[] = collection
    ? await getCollection(collection, ({ data }) => data.status === 'published')
    : (await Promise.all([
        getCollection('projects', ({ data }) => data.status === 'published'),
        getCollection('archive', ({ data }) => data.status === 'published'),
      ])).flat();

  for (const work of local) {
    if (work.data.cover) {
      const file = resolve(workDirectory(work), work.data.cover.file);
      if (!(await stat(file).catch(() => undefined))?.isFile()) {
        throw new Error(`封面文件不存在：${work.collection}/${work.id}/${work.data.cover.file}`);
      }
    }
  }
  const remote: RemoteWork[] = collection === 'archive' ? [] : (await getDatabaseProjects().catch((error) => {
    console.warn(String(error)); return [];
  })).map(databaseProjectToWork);
  const remoteSlugs = new Set(remote.map((work) => work.id));
  const works: Work[] = [...remote, ...local.filter((work) => work.collection !== 'projects' || !remoteSlugs.has(work.id))];
  return works.sort((a, b) => {
    const ao = 'source' in a ? a.data.sortOrder : Number.MAX_SAFE_INTEGER;
    const bo = 'source' in b ? b.data.sortOrder : Number.MAX_SAFE_INTEGER;
    return ao - bo || b.data.date.localeCompare(a.data.date) || workUrl(a).localeCompare(workUrl(b));
  });
}

export function databaseProjectToWork(project: DatabaseProject): RemoteWork {
  return {
    collection: 'projects', id: project.slug, source: 'supabase' as const, body: project.description ?? undefined,
    data: {
      title: project.title, date: project.created_at.slice(0, 10), year: project.year, type: 'project' as const,
      status: 'published' as const, category: project.category, tags: [], cover: parseCover(project.cover_image),
      summary: project.summary, featured: project.featured, blocks: databaseBlocks(project), sortOrder: project.sort_order,
      ...(project.theme_background ? { themeBackground: project.theme_background } : {}),
    },
  };
}

export async function getPublishedProject(slug: string): Promise<Work | undefined> {
  return (await getPublishedWorks('projects')).find((work) => work.id === slug);
}
