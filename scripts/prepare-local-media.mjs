import { cp, mkdir, readFile, readdir, rm } from 'node:fs/promises';
import { extname, join } from 'node:path';

const contentRoot = new URL('../content/', import.meta.url);
const outputRoot = new URL('../public/media/', import.meta.url);
const allowed = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif', '.gif', '.mp4', '.webm']);

await rm(outputRoot, { recursive: true, force: true });

for (const collection of ['projects', 'archive']) {
  const collectionDirectory = new URL(`${collection}/`, contentRoot);
  const entries = await readdir(collectionDirectory, { withFileTypes: true }).catch(() => []);
  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const sourceDirectory = new URL(`${entry.name}/`, collectionDirectory);
    const markdown = await readFile(new URL('index.md', sourceDirectory), 'utf8');
    const frontmatter = markdown.match(/^---\s*\n([\s\S]*?)\n---/)?.[1] ?? '';
    if (!/^status:\s*["']?published["']?\s*$/m.test(frontmatter)) continue;
    const referenced = new Set([...frontmatter.matchAll(/["']?file["']?\s*:\s*["']?([A-Za-z0-9][A-Za-z0-9._-]*)["']?/g)].map((match) => match[1]));
    for (const file of referenced) {
      if (!allowed.has(extname(file).toLowerCase())) continue;
      const destination = join(outputRoot.pathname, collection, entry.name, file);
      await mkdir(new URL(`./${collection}/${entry.name}/`, outputRoot), { recursive: true });
      await cp(new URL(file, sourceDirectory), destination);
    }
  }
}
