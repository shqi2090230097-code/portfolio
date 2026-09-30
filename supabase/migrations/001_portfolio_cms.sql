create extension if not exists pgcrypto;

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(trim(title)) > 0),
  subtitle text,
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  cover_image jsonb,
  category text not null default '未分类',
  year integer not null check (year between 1900 and 9999),
  client text,
  role text,
  duration text,
  summary text not null default '',
  description text,
  featured boolean not null default false,
  status text not null default 'draft' check (status in ('draft','published')),
  sort_order integer not null default 0,
  theme_background text check (theme_background is null or theme_background ~ '^#[0-9a-fA-F]{6}$'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_blocks (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  type text not null check (type in ('intro','text','fullImage','imageGrid','gallery','imageText','video','spacer')),
  content jsonb not null default '{}'::jsonb,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists projects_public_order on public.projects(status, sort_order);
create index if not exists project_blocks_order on public.project_blocks(project_id, sort_order);

create or replace function public.set_updated_at() returns trigger language plpgsql security invoker set search_path = '' as $$
begin new.updated_at = now(); return new; end $$;
drop trigger if exists projects_updated_at on public.projects;
create trigger projects_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists project_blocks_updated_at on public.project_blocks;
create trigger project_blocks_updated_at before update on public.project_blocks for each row execute function public.set_updated_at();

alter table public.projects enable row level security;
alter table public.project_blocks enable row level security;

drop policy if exists "public reads published projects" on public.projects;
drop policy if exists "authenticated creates projects" on public.projects;
drop policy if exists "authenticated updates projects" on public.projects;
drop policy if exists "authenticated deletes projects" on public.projects;
drop policy if exists "public reads blocks of published projects" on public.project_blocks;
drop policy if exists "authenticated creates blocks" on public.project_blocks;
drop policy if exists "authenticated updates blocks" on public.project_blocks;
drop policy if exists "authenticated deletes blocks" on public.project_blocks;

create policy "public reads published projects" on public.projects for select using (status = 'published' or auth.role() = 'authenticated');
create policy "authenticated creates projects" on public.projects for insert to authenticated with check (true);
create policy "authenticated updates projects" on public.projects for update to authenticated using (true) with check (true);
create policy "authenticated deletes projects" on public.projects for delete to authenticated using (true);
create policy "public reads blocks of published projects" on public.project_blocks for select using (
  auth.role() = 'authenticated' or exists (select 1 from public.projects p where p.id = project_id and p.status = 'published')
);
create policy "authenticated creates blocks" on public.project_blocks for insert to authenticated with check (true);
create policy "authenticated updates blocks" on public.project_blocks for update to authenticated using (true) with check (true);
create policy "authenticated deletes blocks" on public.project_blocks for delete to authenticated using (true);

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('portfolio-media','portfolio-media',true,104857600,array['image/jpeg','image/png','image/webp','image/avif','image/gif','video/mp4','video/webm'])
on conflict (id) do update set public=excluded.public, file_size_limit=excluded.file_size_limit, allowed_mime_types=excluded.allowed_mime_types;

drop policy if exists "public reads portfolio media" on storage.objects;
drop policy if exists "authenticated uploads portfolio media" on storage.objects;
drop policy if exists "authenticated updates portfolio media" on storage.objects;
drop policy if exists "authenticated deletes portfolio media" on storage.objects;

create policy "public reads portfolio media" on storage.objects for select using (bucket_id = 'portfolio-media');
create policy "authenticated uploads portfolio media" on storage.objects for insert to authenticated with check (bucket_id = 'portfolio-media');
create policy "authenticated updates portfolio media" on storage.objects for update to authenticated using (bucket_id = 'portfolio-media') with check (bucket_id = 'portfolio-media');
create policy "authenticated deletes portfolio media" on storage.objects for delete to authenticated using (bucket_id = 'portfolio-media');
