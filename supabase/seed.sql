with demo as (
  insert into public.projects (title,subtitle,slug,cover_image,category,year,client,role,duration,summary,description,featured,status,sort_order)
  values ('Demo — 作品的阅读节奏','Demo / Placeholder — 用于验证作品详情页系统，不代表真实委托项目。','demo-detail','{"placeholder":true,"width":1800,"height":1000,"alt":"Demo cover / Placeholder"}'::jsonb,'Demo / Placeholder',2026,'Demo / No client','Design direction / Visual design','Demo','模块化作品详情页演示。所有文字与媒体均为占位。','此项目由现有 Content Collection Demo 迁移而来，可在后台直接编辑。',false,'published',0)
  on conflict (slug) do update set title=excluded.title, cover_image=coalesce(public.projects.cover_image, excluded.cover_image) returning id
)
insert into public.project_blocks(project_id,type,content,sort_order)
select demo.id, block.type, block.content, block.ord from demo cross join (values
  ('intro','{"label":"01 / Context","heading":"从一个问题开始。","description":["这里填写项目背景：为谁设计，需要解决什么问题，以及项目的边界。","每个模块只表达一个主要信息。此处所有内容均为可替换占位。"]}'::jsonb,0),
  ('text','{"eyebrow":"02 / Approach","heading":"先建立秩序，再表达细节。","body":["这里填写设计方法与关键判断。修改这段文字不需要改页面组件。"],"alignment":"left"}'::jsonb,1),
  ('fullImage','{"image":{"media":{"placeholder":true,"width":1800,"height":1100,"alt":"03 — Full image / Placeholder"},"fit":"contain"}}'::jsonb,2),
  ('imageGrid','{"columns":2,"images":[{"media":{"placeholder":true,"width":900,"height":1200,"alt":"04 — Portrait A / Placeholder"},"fit":"contain"},{"media":{"placeholder":true,"width":900,"height":1200,"alt":"05 — Portrait B / Placeholder"},"fit":"contain"}]}'::jsonb,3),
  ('imageText','{"imagePosition":"right","image":{"media":{"placeholder":true,"width":1000,"height":1200,"alt":"06 — Detail / Placeholder"},"fit":"contain"},"eyebrow":"04 / Decisions","heading":"图像与解释，彼此留出空间。","body":["在这里说明这张图对应的设计决策。"]}'::jsonb,4),
  ('gallery','{"columns":3,"images":[{"media":{"placeholder":true,"width":1200,"height":800,"alt":"07 — Landscape / Placeholder"},"fit":"contain"},{"media":{"placeholder":true,"width":800,"height":1100,"alt":"08 — Portrait / Placeholder"},"fit":"contain"},{"media":{"placeholder":true,"width":1000,"height":1000,"alt":"09 — Square / Placeholder"},"fit":"contain"}]}'::jsonb,5),
  ('video','{"title":"05 / Motion — Placeholder","source":{"kind":"placeholder","description":"在项目数据中替换为视频 URL。"},"width":1920,"height":1080,"caption":"视频占位；不自动播放。"}'::jsonb,6)
) as block(type,content,ord)
where not exists (select 1 from public.project_blocks pb where pb.project_id=demo.id and pb.type=block.type);
