# 长期维护的个人作品网站

Astro + TypeScript + Content Collections + Supabase。公开展示继续复用原有组件；Supabase 提供轻量 Admin、Auth、Database 与 Storage。未配置 Supabase 时自动回退到现有 Content Collections。

## 本地运行与验证

使用 Node.js 24 LTS（`.nvmrc`），在此目录运行：

```sh
npm ci
npm run dev
```

浏览器打开终端显示的地址，默认 http://127.0.0.1:4321。

```sh
npm run build   # 类型检查、内容校验、静态构建
npm test        # 在临时目录验证公开内容、详情路由、资源及状态切换
npm run preview # 预览 dist 中的正式构建
```

正式构建使用 Astro Cloudflare server：

```sh
npm run build
npx wrangler dev
```

Cloudflare Workers Builds 使用 `npm run build` 与 `npx wrangler deploy`，Root directory 为 `/`，并提供下方 Supabase 环境变量。Worker 名称在 `wrangler.jsonc` 中固定为 `millionmeilin`。

## Supabase Admin

1. 在 Supabase 新建项目。
2. 打开 SQL Editor，执行 `supabase/migrations/001_portfolio_cms.sql`。
3. 再执行 `supabase/seed.sql`，把当前 Demo 加入后台；这一步可选且可重复执行。
4. 在 Authentication → Users 创建自己的邮箱/密码账号。当前 RLS 允许任意 authenticated 用户管理内容，因此只创建可信账号。
5. 复制 `.env.example` 为 `.env`，填写：

```dotenv
PUBLIC_SUPABASE_URL=https://your-project.supabase.co
PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

不要在浏览器代码中使用 service role key。本项目不需要 service role key。

只填写 URL 与 anon key 后，可以先验证公开连接与表结构：

```sh
npm run supabase:verify
```

如需一次验证 Auth、Draft/Published、项目与模块 CRUD、RLS 和 Storage 上传，再在本地 `.env` 临时填写 `SUPABASE_TEST_EMAIL` 与 `SUPABASE_TEST_PASSWORD`。脚本会创建一个临时 Draft、上传 1px 测试图片、验证发布和下架边界，然后清理项目与媒体。测试账号密码不会进入前端构建，也不要提交 `.env`。

重启开发服务器后访问 `/admin`。未登录会进入 `/admin/login`。后台支持项目新建、编辑、复制、删除确认、发布/下架、排序、封面上传、模块增删/复制/排序、图片与视频上传、自动保存和草稿预览。上传文件进入 `portfolio-media` bucket；数据库只保存 URL、尺寸、alt 与 caption，不保存 base64。

当前 Admin 模块与前台 block 的对应关系：Section Title → `intro`、Text → `text`、Full Image → `fullImage`、Two Column Images → `imageGrid`、Gallery → `gallery`、Image + Text → `imageText`、Video → `video`、Spacer → `spacer`。Hero 从项目基础信息和封面自动生成。

数据库项目会优先覆盖同 slug 的本地项目。这样执行 seed 后 `/projects/demo-detail` 仍是原地址，但内容来自 Supabase。公开页面只读取 `published`；Admin Preview 使用同一个 `ProjectRenderer` 读取草稿。

## 目录与职责

```text
content/
  projects/<slug>/index.md  # 完整项目 / Case Study
  archive/<slug>/index.md   # 海报、Banner、实验、小型作品
  .../<slug>/cover.webp     # 同目录存放选定可发布的图片
inbox/                     # 原始文件、待整理内容，不加载、不构建
templates/                # project.md、archive.md，初始状态 draft
src/
  content.config.ts        # 字段定义与校验
  lib/works.ts             # Content Collections + Supabase 的统一公开查询
  lib/projects-repository.ts # 数据库项目与现有 renderer 的适配
  lib/admin/               # Admin 浏览器端编辑逻辑
  lib/supabase/            # 浏览器/服务端 Supabase client
  data/site.ts             # 站点文字与个人介绍
  pages/                   # 路由
  layouts/                 # 页面结构
  components/              # 展示组件
  styles/                  # 样式
tests/                    # 发布边界回归测试
supabase/                 # schema/RLS/storage migration 与 Demo seed
```

`content` 只保存内容，不写布局类名、组件导入或样式。未来重新设计仅修改 layouts、components、styles 和必要的 pages，作品数据无需重整。正文使用普通 Markdown。

## 新增一个作品

1. 将新作品原始资料放进 `inbox/作品名/`，选出要公开的图片。
2. 为完整项目建立 `content/projects/my-project/`；单件作品建立 `content/archive/my-poster/`。
3. 复制 `templates/project.md` 或 `templates/archive.md` 为该目录的 `index.md`。
4. 填写顶部字段和下方 Markdown 正文。目录名就是稳定 slug：仅小写英文字母、数字与连字符，发布后不要随意改名。
5. 图片放在同一个作品目录，文件名用英文字母、数字、点、下划线或连字符，扩展名使用小写。支持 png、jpg、jpeg、webp、avif、gif。
6. 整理时保持 `draft`；准备公开时改成 `published`，运行 `npm run build`、`npm test` 和本地预览。

示例字段：

```yaml
---
title: "我的第一个项目"
date: "2026-09-08"
year: 2026
type: project
status: draft
category: "品牌设计"
tags: ["品牌", "视觉系统"]
cover:
  file: cover.webp
  width: 1600
  height: 1200
  alt: "项目视觉系统的整体展示"
summary: "一句话说明项目背景和设计成果。"
featured: false
---
```

没有封面时写 `cover: null`，页面不生成占位图片。封面不是必需，但其他字段均须填写；`tags` 可为空数组。`date` 必须加引号，使用真实日期 `YYYY-MM-DD`，`year` 与其年份一致。`type` 在 projects 目录必须为 `project`，在 archive 目录必须为 `archive`。`category` 用一个主要分类，`tags` 补充多个关键词。首页精选由 `featured: true` 控制，首页最新和全部作品按日期降序排列，同日按地址稳定排序。

正文图片示例（替换 collection、slug 和文件名）：

```md
![海报的文字与版式细节](/media/archive/my-poster/detail.webp)
```

图片应使用上述 `/media/` 地址，不使用源文件相对路径，不在 Markdown 中通过 import 引入文件。构建时只复制 `published` 作品数据中通过 `file` 明确引用的媒体；建议同时填写真实 `width` / `height` 以避免布局跳动。PSD、AI、未选素材留在 inbox 或独立备份中。Markdown 正文中不要写其他未发布作品的敏感文字或素材链接。

## 发布状态

| status | 本地公开页面 | 生产页面与详情 | 图片资源 |
| --- | --- | --- | --- |
| draft | 不显示 | 不生成 | 不输出 |
| private | 不显示 | 不生成 | 不输出 |
| published | 显示 | 生成 | 输出 |

`private` 表示只保存在源文件中，不是带密码页面。直接访问 draft/private 的地址同样返回 404，featured 不会绕过状态过滤。没有隐藏内容预览模式；可在编辑器预览 Markdown，需要浏览器检查时在本地临时改为 published，检查结束恢复状态后再构建。

不要把私密内容或图片放进 Astro 的 `public/`，该目录会直接复制到站点。不要将私密源文件提交到公开 Git 仓库；本项目的状态规则保护网站产物，不能隐藏公开仓库中的文件。inbox 默认被 Git 忽略，需要独立备份；如需 Git 保存 private 内容，应使用私有仓库。

## 现有页面

- `/`：精选与最新作品。
- `/work`：视觉作品网格，支持类型、年份、分类组合筛选、数量与空结果。
- `/projects`：兼容入口，永久重定向到现有 `/work` 作品浏览页。
- `/showcase`：黑色背景、滚动切换中心作品的旋转索引。点击停在中心的作品，会在同页打开画面与设计思路；完整案例仍保留原详情路由。页面自动读取已发布作品，至少保留 18 个展位；新增作品后依次填入，不需要修改页面组件。
- 全站在真实封面或项目媒体缺失时使用 `src/data/showcase-references.ts` 的外部临时视觉参考。它们不进入 Content Collections、不代表本人作品；详情媒体与 Showcase 保留来源入口。真实作品补齐 cover 或 block media 后会自动优先显示真实素材。
- `/projects/[slug]`：完整项目正文。
- `/archive/[slug]`：单件作品正文。
- `/about`：个人介绍，编辑 `src/data/site.ts`。
- 不存在及未发布的作品地址：404。

附带两份明确标记的已发布结构示例，帮助检查两类内容和路由。正式使用前可删除 `content/projects/example-project/` 与 `content/archive/example-archive/`，或改为 draft；空列表也能正常构建。

## 长期维护

- 提交 `package-lock.json`，平时使用 `npm ci`；有计划地升级依赖并重新执行构建、测试。
- 内容、模板、schema 与文档一起维护。增加字段应兼容旧内容，或提供明确迁移。
- 源码用私有 Git 仓库保存历史，原始文件另行备份；已发布 slug 变更时必须安排重定向。
- 下一步优先整理真实作品、统一分类和标签、补全个人介绍，再讨论视觉设计。

技术参考：[Astro Content Collections 官方文档](https://docs.astro.build/en/guides/content-collections/)。

## 第二阶段：版式骨架与可组合内容

页面已升级为封面为主的作品网格，支持类型、年份、分类组合筛选；首页保留 Intro / Featured Work / Recent Work 结构。

- 统一尺寸、颜色、字体、间距与断点：`src/design/tokens.mjs`。
- 公共版式与作品集组件：`src/components/`。
- 新增可选 `sections`，用于 text / media / gallery / split 自由组合。原必填字段不变，旧 Markdown 不需要迁移。
- 两份示例使用灰色比例占位，无新生成图片；真实文件自动读取尺寸。
- 组合格式、所有组件接口、Grid 规则及后续修改方法见 [Layout System 说明](docs/layout-system.md)。

## 第三阶段：首页参考复刻

首页现改为参考录屏的背景大字、文件夹与扇形作品卡片，不再使用前一阶段的首页 Grid 构图。`/work` 和详情页保留原结构并继承统一 token。操作、素材替换入口和已知差异见 [参考复刻说明](docs/reference-replica.md)。

## Design Index / 六个创作方向

独立索引在 `/design-index`，首页的目录也使用同一组方向。六个标题、中文标签及简短说明集中在 `src/data/design-directions.ts`。作品继续保存在现有 Content Collections 或 Admin 数据源中：给作品的 `tags` 添加 `Brand Language`、`Visual Stories`、`Illustration World`、`Visual Experiments`、`Form & Color` 或 `Personal Projects`，就会进入相应的 `/work?direction=...` 筛选结果。也可以把 `category` 设成同名方向。不要在索引组件里复制作品内容；未发布的作品不会出现。示例概念作品仅作占位，替换时请使用自己的真实图片与说明。

## Project Detail System v1

模块化详情 Demo：`content/projects/demo-detail/index.md`，访问 `/projects/demo-detail`。修改这个文件的 `blocks` 即可编辑文字、图片数量与顺序、图文布局、视频和 section 顺序。旧 sections 项目保持兼容。

About 页的介绍、关注方向和联系文字集中在 `src/data/site.ts` 的 `aboutPage`。填入 `contactEmail` 后，页面会将占位提示换成邮件链接；未填写时不会生成虚假的联系方式。

详细字段说明、添加作品和媒体示例见 [Project Detail System](docs/project-detail-system.md)。

## Work / Creative portfolio 展示

`/work` 使用大型 ProjectSequence，保留原筛选与公开状态逻辑。封面比例来自现有内容，视觉与动效集中在 `sequence-*` / `detail-*` token。实现范围与参考站访问限制见 [本轮说明](docs/studio-visual-pass.md)。
