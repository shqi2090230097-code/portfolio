import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, cp, symlink, mkdir, writeFile, readFile, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { spawn } from 'node:child_process';
import { createServer } from 'node:net';

const root = resolve(import.meta.dirname, '..');
const astro = join(root, 'node_modules/astro/bin/astro.mjs');
const wrangler = join(root, 'node_modules/wrangler/bin/wrangler.js');
async function build(cwd) {
  const prepare = spawn(process.execPath, [join(cwd, 'scripts/prepare-local-media.mjs')], { cwd });
  const prepareCode = await new Promise((resolve, reject) => { prepare.on('error', reject); prepare.on('exit', resolve); });
  assert.equal(prepareCode, 0, 'local media preparation succeeds');
  const child = spawn(process.execPath, [astro, 'build'], { cwd, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1' } });
  let output = '';
  child.stdout.on('data', (chunk) => output += chunk);
  child.stderr.on('data', (chunk) => output += chunk);
  const code = await new Promise((resolve, reject) => { child.on('error', reject); child.on('exit', resolve); });
  assert.equal(code, 0, output);
}
async function files(directory) {
  return (await Promise.all((await readdir(directory, { withFileTypes: true })).map(async (entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? files(path) : [path];
  }))).flat();
}
async function preview(cwd, check) {
  const probe = createServer();
  await new Promise((resolve) => probe.listen(0, '127.0.0.1', resolve));
  const port = probe.address().port;
  await new Promise((resolve) => probe.close(resolve));
  const child = spawn(process.execPath, [wrangler, 'dev', '--config', join(cwd, 'dist/server/wrangler.json'), '--ip', '127.0.0.1', '--port', String(port)], { cwd, env: { ...process.env, ASTRO_TELEMETRY_DISABLED: '1', WRANGLER_LOG_PATH: join(cwd, 'wrangler-test.log') }, stdio: ['ignore', 'pipe', 'pipe'] });
  let serverOutput = '';
  child.stdout.on('data', (chunk) => serverOutput += chunk);
  child.stderr.on('data', (chunk) => serverOutput += chunk);
  const exited = new Promise((resolve) => child.on('exit', resolve));
  const base = `http://127.0.0.1:${port}`;
  try {
    let ready = false;
    for (let i = 0; i < 100; i++) {
      if (await fetch(base).then((r) => r.ok).catch(() => false)) { ready = true; break; }
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    assert.ok(ready, `preview server starts: ${serverOutput}`);
    await check(base);
  } finally { child.kill('SIGTERM'); await exited; }
}
function entry(type, status) {
  const sections = [
    { id: 'qa-text', kind: 'text', title: `QA_${type}_${status}_SECTION`, paragraphs: ['模块正文'] },
    { id: 'qa-media', kind: 'media', width: 'full', media: { file: 'detail.png', width: 1, height: 1, alt: `QA_${type}_${status}_MEDIA` } },
    { id: 'qa-pair', kind: 'gallery', arrangement: 'pair', images: [{ placeholder: true, width: 800, height: 1100, alt: '竖图占位' }, { placeholder: true, width: 1200, height: 800, alt: '横图占位' }] },
  ];
  return `---\ntitle: "QA_${type}_${status}_TITLE"\ndate: "2026-09-08"\nyear: 2026\ntype: ${type}\nstatus: ${status}\ncategory: "QA_${type}_${status}_CATEGORY"\ntags: ["QA_${type}_${status}_TAG"]\ncover:\n  file: cover.png\n  width: 1\n  height: 1\n  alt: "QA_${type}_${status}_ALT"\nsummary: "QA_${type}_${status}_SUMMARY"\nfeatured: true\nsections: ${JSON.stringify(sections)}\n---\n\n## QA_${type}_${status}_BODY\n\n![正文配图](/media/${type === 'project' ? 'projects' : 'archive'}/qa-${status}/detail.png)\n`;
}

test('publication boundary: both collections, routes, media, withdrawal, empty state', { timeout: 180000 }, async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'portfolio-publication-'));
  try {
    for (const path of ['src', 'scripts', 'public', 'astro.config.mjs', 'wrangler.jsonc', 'tsconfig.json', 'package.json']) await cp(join(root, path), join(cwd, path), { recursive: true });
    await symlink(join(root, 'node_modules'), join(cwd, 'node_modules'), 'dir');
    for (const [collection, type] of [['projects', 'project'], ['archive', 'archive']]) {
      for (const status of ['published', 'draft', 'private']) {
        const directory = join(cwd, 'content', collection, `qa-${status}`);
        await mkdir(directory, { recursive: true });
        await writeFile(join(directory, 'index.md'), entry(type, status));
        // 标准 1px 测试 PNG，只用于临时测试目录的尺寸读取，不是网站作品图。
        const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64');
        await writeFile(join(directory, 'cover.png'), status === 'published' ? png : `QA_${type}_${status}_COVER_BYTES`);
        await writeFile(join(directory, 'detail.png'), status === 'published' ? png : `QA_${type}_${status}_DETAIL_BYTES`);
        await writeFile(join(directory, 'source.psd'), `QA_${type}_${status}_SOURCE_BYTES`);
      }
    }
    await mkdir(join(cwd, 'inbox'), { recursive: true });
    await writeFile(join(cwd, 'inbox', 'unfiled.md'), 'QA_INBOX_SECRET');
    await build(cwd);
    const outputFiles = await files(join(cwd, 'dist/client'));
    const allOutput = (await Promise.all(outputFiles.map((path) => readFile(path)))).join('\n');
    for (const type of ['project', 'archive']) {
      for (const status of ['draft', 'private']) assert.ok(!allOutput.includes(`QA_${type}_${status}`), `${type}/${status} content and media never emitted`);
      assert.ok(!allOutput.includes(`QA_${type}_published_SOURCE_BYTES`), 'original source not emitted');
    }
    assert.ok(!allOutput.includes('QA_INBOX_SECRET'));
    await preview(cwd, async (base) => {
      const admin = await fetch(base + '/admin');
      assert.equal(admin.status, 200);
      assert.ok((await admin.text()).includes('尚未连接 Supabase'), 'unconfigured Admin gives actionable setup state');
      assert.equal((await fetch(base + '/admin/login')).status, 200);
      const projectsIndex = await fetch(base + '/projects', { redirect: 'manual' });
      assert.equal(projectsIndex.status, 308);
      assert.equal(projectsIndex.headers.get('location'), '/work');
      for (const path of ['/', '/work', '/about']) {
        const response=await fetch(base + path);assert.equal(response.status,200,path);
        if(path!=='/about'){const html=await response.text();assert.ok(html.includes('QA_project_published_TITLE'));assert.ok(html.includes('QA_archive_published_TITLE'));}
      }
      for (const [collection, type] of [['projects', 'project'], ['archive', 'archive']]) {
        const response = await fetch(`${base}/${collection}/qa-published`);
        assert.equal(response.status, 200);
        const detailHtml = await response.text();
        assert.ok(detailHtml.includes(`QA_${type}_published_BODY`), 'Markdown body rendered');
        const images = detailHtml.match(/<img[^>]+>/g) ?? [];
        assert.equal(images.length, 3, 'cover, section media and legacy Markdown all rendered');
        assert.ok(images.every((image) => /width="1"/.test(image) && /height="1"/.test(image)), 'all image dimensions emitted');
        assert.ok(detailHtml.includes(`QA_${type}_published_SECTION`), 'structured content rendered');
        assert.ok(detailHtml.includes('full-width-image') && detailHtml.includes('image-pair'), 'content modules mapped to components');
        for (const file of ['cover.png', 'detail.png']) {
          const media = await fetch(`${base}/media/${collection}/qa-published/${file}`);
          assert.equal(media.status, 200);
          assert.equal(media.headers.get('content-type'), 'image/png');
        }
        for (const status of ['draft', 'private', 'missing']) {
          assert.equal((await fetch(`${base}/${collection}/qa-${status}`)).status, 404);
          assert.equal((await fetch(`${base}/media/${collection}/qa-${status}/cover.png`)).status, 404);
        }
      }
      assert.equal((await fetch(`${base}/inbox/unfiled.md`)).status, 404);
    });
    // Rebuild the SAME output directory after withdrawing both public items.
    for (const collection of ['projects', 'archive']) {
      const path = join(cwd, 'content', collection, 'qa-published', 'index.md');
      await writeFile(path, (await readFile(path, 'utf8')).replace('status: published', `status: ${collection === 'projects' ? 'draft' : 'private'}`));
    }
    await build(cwd);
    await preview(cwd, async (base) => {
      assert.ok((await (await fetch(base+'/work')).text()).includes('暂时没有已发布的作品'));
      for (const collection of ['projects', 'archive']) {
        assert.equal((await fetch(`${base}/${collection}/qa-published`)).status, 404);
        assert.equal((await fetch(`${base}/media/${collection}/qa-published/cover.png`)).status, 404);
      }
    });
  } finally { await rm(cwd, { recursive: true, force: true }); }
});

test('Supabase migration keeps public reads published-only and Admin writes authenticated', async () => {
  const sql = await readFile(join(root, 'supabase/migrations/001_portfolio_cms.sql'), 'utf8');
  const seed = await readFile(join(root, 'supabase/seed.sql'), 'utf8');
  assert.match(sql, /enable row level security/g);
  assert.match(sql, /status = 'published'/);
  assert.match(sql, /for insert to authenticated/);
  assert.match(sql, /for update to authenticated/);
  assert.match(sql, /for delete to authenticated/);
  assert.match(sql, /portfolio-media/);
  assert.doesNotMatch(sql, /service_role/i);
  assert.match(seed, /cover_image/);
  assert.match(seed, /'fullImage'/);
  assert.match(seed, /'intro'/);
  assert.match(seed, /'text'/);
});

test('project blocks: editing, ordering, GIF and opt-in video publication', { timeout: 180000 }, async () => {
  const cwd = await mkdtemp(join(tmpdir(), 'portfolio-blocks-'));
  const image = (alt) => ({ media: { file: 'detail.png', width: 1, height: 1, alt }, ratio: 1.5, fit: 'cover' });
  const blocks = [
    { id: 'hero', type: 'hero', subtitle: 'BLOCKS_DEMO' },
    { id: 'first', type: 'text', heading: 'FIRST_HEADING', body: ['FIRST_BODY'] },
    { id: 'gallery', type: 'gallery', columns: 3, images: [image('KEEP_IMAGE'), image('REMOVE_IMAGE')] },
    { id: 'gif', type: 'fullImage', image: { media: { file: 'motion.gif', width: 1, height: 1, alt: 'GIF_IMAGE' } } },
    { id: 'video', type: 'video', title: 'LOCAL_VIDEO', source: { kind: 'local', file: 'motion.mp4' }, width: 1920, height: 1080 },
  ];
  const document = (status, value) => entry('project', status).replace('\nsections:', `\nblocks: ${JSON.stringify(value)}\nsections:`);
  try {
    for (const path of ['src', 'scripts', 'public', 'astro.config.mjs', 'wrangler.jsonc', 'tsconfig.json', 'package.json']) await cp(join(root, path), join(cwd, path), { recursive: true });
    await symlink(join(root, 'node_modules'), join(cwd, 'node_modules'), 'dir');
    for (const status of ['published', 'draft', 'private']) {
      const dir = join(cwd, 'content/projects', `qa-${status}`);
      await mkdir(dir, { recursive: true });
      await writeFile(join(dir, 'index.md'), document(status, blocks));
      const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64');
      await writeFile(join(dir, 'detail.png'), png);
      await writeFile(join(dir, 'cover.png'), png);
      await writeFile(join(dir, 'motion.gif'), Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7','base64'));
      await writeFile(join(dir, 'motion.mp4'), `VIDEO_${status}_BYTES`);
      await writeFile(join(dir, 'unused.mp4'), 'UNREFERENCED_VIDEO');
    }
    await build(cwd);
    await preview(cwd, async base => {
      const page=await fetch(base + '/projects/qa-published');assert.equal(page.status, 200);const html=await page.text();
      assert.ok(html.indexOf('id="first"') < html.indexOf('id="gallery"'));
      assert.ok(html.includes('REMOVE_IMAGE') && html.includes('GIF_IMAGE') && html.includes('<video'));
      assert.match(html, /--detail-image-ratio:1.5;--detail-image-fit:cover/);
      const video = await fetch(base + '/media/projects/qa-published/motion.mp4');
      assert.equal(video.headers.get('content-type'), 'video/mp4');
      assert.equal(await video.text(), 'VIDEO_published_BYTES');
      assert.equal((await fetch(base + '/media/projects/qa-published/unused.mp4')).status, 404);
      for (const status of ['draft', 'private']) {
        assert.equal((await fetch(`${base}/projects/qa-${status}`)).status, 404);
        assert.equal((await fetch(`${base}/media/projects/qa-${status}/motion.mp4`)).status, 404);
      }
    });
    const updated = [blocks[0], { ...blocks[2], images: [image('ADDED_IMAGE'), image('KEEP_IMAGE'), image('THIRD_IMAGE')] }, blocks[1]];
    await writeFile(join(cwd, 'content/projects/qa-published/index.md'), document('published', updated));
    await build(cwd);
    await preview(cwd,async base=>{const html=await (await fetch(base+'/projects/qa-published')).text();assert.ok(html.indexOf('id="gallery"') < html.indexOf('id="first"'),'section order follows data');assert.ok(html.includes('ADDED_IMAGE')&&html.includes('KEEP_IMAGE')&&html.includes('THIRD_IMAGE'));assert.ok(!html.includes('REMOVE_IMAGE')&&!html.includes('<video'),'removed content disappears');assert.equal((await fetch(base+'/media/projects/qa-published/motion.mp4')).status,404);});
  } finally { await rm(cwd, { recursive: true, force: true }); }
});
