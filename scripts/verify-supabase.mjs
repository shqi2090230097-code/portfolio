import { createClient } from '@supabase/supabase-js';

const url = process.env.PUBLIC_SUPABASE_URL?.trim();
const key = process.env.PUBLIC_SUPABASE_ANON_KEY?.trim();
const email = process.env.SUPABASE_TEST_EMAIL?.trim();
const password = process.env.SUPABASE_TEST_PASSWORD;

if (!url || !key) {
  console.error('Supabase 未配置：请在 .env 填写 PUBLIC_SUPABASE_URL 和 PUBLIC_SUPABASE_ANON_KEY。');
  process.exit(2);
}

const options = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const publicClient = createClient(url, key, options);
const adminClient = createClient(url, key, options);
const fail = (message, error) => { throw new Error(`${message}: ${error?.message ?? error}`); };

const publicRead = await publicClient.from('projects').select('id,slug,status').eq('status', 'published').limit(1);
if (publicRead.error) fail('公开 projects 查询失败，请确认 migration 已执行', publicRead.error);
console.log('✓ 数据库可连接，公开 published 查询正常');

if (!email || !password) {
  console.log('○ 未填写 SUPABASE_TEST_EMAIL / SUPABASE_TEST_PASSWORD，跳过登录、CRUD 与 Storage 写入联调');
  process.exit(0);
}

const login = await adminClient.auth.signInWithPassword({ email, password });
if (login.error) fail('测试账号登录失败', login.error);
console.log('✓ Supabase Auth 登录正常');

let projectId;
let storagePath;
const slug = `cms-verification-${Date.now()}`;
try {
  const created = await adminClient.from('projects').insert({
    title: 'CMS Verification — Delete Me', slug, category: 'Verification', year: new Date().getFullYear(),
    summary: 'Temporary integration record', status: 'draft', sort_order: 999999,
  }).select('id').single();
  if (created.error) fail('创建 Draft 失败', created.error);
  projectId = created.data.id;

  const hiddenDraft = await publicClient.from('projects').select('id').eq('slug', slug);
  if (hiddenDraft.error || hiddenDraft.data?.length) fail('Draft 公开边界验证失败', hiddenDraft.error ?? '匿名用户读到了 Draft');

  const updated = await adminClient.from('projects').update({ summary: 'Updated integration record' }).eq('id', projectId);
  if (updated.error) fail('更新项目失败', updated.error);

  const block = await adminClient.from('project_blocks').insert({
    project_id: projectId, type: 'text', sort_order: 0,
    content: { eyebrow: 'Verification', heading: 'Database block', body: ['Temporary block'], alignment: 'left' },
  });
  if (block.error) fail('创建项目模块失败', block.error);

  storagePath = `${projectId}/${crypto.randomUUID()}-verification.png`;
  const png = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/l9sAAAAASUVORK5CYII=', 'base64');
  const upload = await adminClient.storage.from('portfolio-media').upload(storagePath, png, { contentType: 'image/png', upsert: false });
  if (upload.error) fail('Storage 上传失败', upload.error);
  const { data: media } = adminClient.storage.from('portfolio-media').getPublicUrl(storagePath);
  const mediaResponse = await fetch(media.publicUrl);
  if (!mediaResponse.ok) fail('Storage public URL 无法访问', `${mediaResponse.status} ${mediaResponse.statusText}`);

  const published = await adminClient.from('projects').update({
    status: 'published', cover_image: { url: media.publicUrl, width: 1, height: 1, alt: 'Verification pixel' },
  }).eq('id', projectId);
  if (published.error) fail('发布项目失败', published.error);

  const visibleProject = await publicClient.from('projects').select('id,status').eq('slug', slug).single();
  if (visibleProject.error || visibleProject.data.status !== 'published') fail('Published 匿名读取失败', visibleProject.error ?? '返回状态不正确');
  const visibleBlocks = await publicClient.from('project_blocks').select('id').eq('project_id', projectId);
  if (visibleBlocks.error || visibleBlocks.data.length !== 1) fail('Published blocks 匿名读取失败', visibleBlocks.error ?? '模块数量不正确');

  const unpublished = await adminClient.from('projects').update({ status: 'draft' }).eq('id', projectId);
  if (unpublished.error) fail('下架项目失败', unpublished.error);
  const hiddenAgain = await publicClient.from('projects').select('id').eq('slug', slug);
  if (hiddenAgain.error || hiddenAgain.data?.length) fail('下架后的公开边界验证失败', hiddenAgain.error ?? '匿名用户仍能读取项目');
  console.log('✓ Draft/Published、CRUD、block 外键、RLS 与 Storage 上传均正常');
} finally {
  if (projectId) await adminClient.from('projects').delete().eq('id', projectId);
  if (storagePath) await adminClient.storage.from('portfolio-media').remove([storagePath]);
  await adminClient.auth.signOut();
}
