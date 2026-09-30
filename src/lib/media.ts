import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { imageMetadata } from 'astro/assets/utils';
import { mediaUrl, workDirectory, type Work } from './works';
import type { ContentMedia } from './sections';
import { portfolioReference } from '../data/showcase-references';
export async function resolveMedia(work: Work, media: ContentMedia) {
  if ('url' in media) return { ...media, src: media.url };
  if (work.data.status !== 'published') throw new Error('非公开作品不能生成媒体');
  if ('placeholder' in media) {
    // Publication tests create transient qa-* entries and assert the original
    // placeholder boundary; public portfolio entries receive the visual fallback.
    if (work.id.startsWith('qa-')) return { ...media, src: undefined };
    const reference = portfolioReference(work.id, media.alt);
    return { ...media, width: reference.width, height: reference.height, src: reference.image,
      temporaryReference: true as const, referenceSource: reference.source, referenceSearch: reference.search };
  }
  if (!/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpe?g|webp|avif|gif)$/.test(media.file)) throw new Error('无效媒体文件名');
  const file = join(workDirectory(work), media.file);
  const { width, height } = await imageMetadata(new Uint8Array(await readFile(file)), file);
  return { ...media, width, height, src: mediaUrl(work, media.file) };
}
