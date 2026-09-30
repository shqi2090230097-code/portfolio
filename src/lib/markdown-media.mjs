import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageMetadata } from 'astro/assets/utils';

// Astro 自带 Sätteri 的原生 HAST 插件：给旧 Markdown 图片补固有尺寸。
export default function markdownMedia(document) {
  return {
    name: 'portfolio-media-dimensions',
    element: {
      filter: ['img'],
      async visit(node, context) {
        if (context.data.astro?.frontmatter?.status !== 'published') return;
        const src = String(node.properties?.src ?? '');
        const match = src.match(/^\/media\/(projects|archive)\/([a-z0-9]+(?:-[a-z0-9]+)*)\/([a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpe?g|webp|avif|gif))$/);
        if (!match) throw new Error(`正文图片使用当前作品的 /media/ 地址：${src}`);
        const [, collection, slug, name] = match;
        const ownPath = resolve('content', collection, slug, 'index.md');
        if (!document.fileURL || fileURLToPath(document.fileURL) !== ownPath) throw new Error(`正文图片必须属于当前作品：${src}`);
        const path = resolve('content', collection, slug, name);
        const { width, height } = await imageMetadata(new Uint8Array(await readFile(path)), path);
        for (const [key, value] of Object.entries({ width, height, loading: 'lazy', decoding: 'async' })) context.setProperty(node, key, value);
      },
    },
  };
}
