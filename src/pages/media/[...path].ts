import type { APIRoute, GetStaticPaths } from 'astro';
export const prerender = true;
import { readdir, readFile } from 'node:fs/promises';
import { join, extname } from 'node:path';
import { getPublishedWorks, workDirectory } from '../../lib/works';

const mime: Record<string, string> = {
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm',
};

// 只输出 published 作品目录里的图片。源文件、inbox、private/draft 资源不会被复制。
export const getStaticPaths: GetStaticPaths = async () => {
  const works = await getPublishedWorks();
  return (await Promise.all(works.map(async (work) => {
    const directory = workDirectory(work);
    const files = await readdir(directory, { withFileTypes: true });
    return files.filter((file) => file.isFile() && /^[a-zA-Z0-9][a-zA-Z0-9._-]*$/.test(file.name) && mime[extname(file.name)] && (!['.mp4', '.webm'].includes(extname(file.name)) || work.data.blocks?.some(block => block.type === 'video' && block.source.kind === 'local' && block.source.file === file.name)))
      .map((file) => ({
        params: { path: `${work.collection}/${work.id}/${file.name}` },
        props: { file: join(directory, file.name), contentType: mime[extname(file.name)] },
      }));
  }))).flat();
};

export const GET: APIRoute = async ({ props }) => new Response(
  new Uint8Array(await readFile(props.file)),
  { headers: { 'Content-Type': props.contentType } },
);
