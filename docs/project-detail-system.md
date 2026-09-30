# Project Detail System v1

## 编辑入口

Demo 是 `content/projects/demo-detail/index.md`，URL `/projects/demo-detail`。所有 Demo 文案和占位媒体均在这个文件的 YAML frontmatter 中，没有真实客户项目。其 `status: published` 是为了可直接访问，因此也会正常出现在首页补位和 Work 列表中。删掉 Demo 或设为 draft 即可撤下。

新作品：可使用 `templates/project-blocks.md` 作为最小起点，或复制 Demo 目录，改目录名为唯一 slug，再修改 index.md 的 title、date、year、category、summary 等。**date 要带引号**，例如 `date: "2026-09-09"`。先使用 draft，整理完成改 published。private / draft 均不生成公开页面、图片或视频。

当前 Astro 7.3.1 的 Content Collections + glob loader 已满足需求，继续使用；无新 CMS、数据库或运行时依赖。[Astro Content Collections 文档](https://docs.astro.build/en/guides/content-collections/)。排版参考 [Glean](https://www.glean.com/) 的大字、小信息和图像节奏，以及本次任务明确的 editorial 原则，不采用其品牌素材。

## 文字与模块顺序

作品唯一主标题默认使用顶层 title；hero.title 可选覆盖详情标题。hero.subtitle 默认回退顶层 summary，year 默认回退顶层 year。列表封面继续使用顶层 cover，hero.cover 可以另设详情页大图。标题、说明、caption 都是纯文字，正文仍可放在 Markdown 区域（在 blocks 之后输出）。不需要写 HTML 或 className。

`blocks` 是顺序列表。移动整个 `- id: ...` 模块即可排序，删除整个模块即可移除。id 必须唯一且为小写英文/数字/连字符；第一项必须是唯一 hero，其余模块可自由组合重复。旧项目没有 blocks 时仍使用原 sections + Markdown，不要求迁移。新项目建议仅使用 blocks；存在 blocks 时旧 sections 不参与渲染。

| type | 内容 / 布局选项 |
| --- | --- |
| hero | title、subtitle、year、role[]、tools[]、categories[]、cover |
| intro | label、heading、description[] |
| fullImage | 页面容器内大图 image |
| wideImage | 突破容器的全宽图 image，比例由图片或 ratio 决定 |
| portraitImage | 居中窄幅海报 image |
| imageGrid | images[]、columns: 2 或 3；可选 `layout: mosaic` 用于不等尺寸拼贴 |
| imageText | image、eyebrow、heading、body[]、imagePosition: left 或 right |
| text | eyebrow、heading、body[]、alignment: left / center / right |
| statement | text、可选 label |
| gallery | 任意非零数量 images[]，columns: 2 或 3；可选 `layout: stage` 用于黑底横图＋错位竖图 |
| video | title、source、width、height、可选 poster / caption |
| spacer | size: small / medium / large，增加额外留白 |
| projectMeta | heading、client、role[]、year、deliverables[]、tools[] |

空 imageGrid / gallery 应删除整个模块，不能保留空数组。移动端图文自动图在前、文在后；Grid 手机单列、平板最多两列、桌面按 columns。数量不够一行时保留原尺寸，不拉伸成另一套版式。

`layout` 省略时为 `regular`，旧项目版式不变。`mosaic` 和 `stage` 只记录稳定的内容编排意图，不依赖具体项目 slug 或 CSS 类名。`stage` 建议依次放 1 张横图与 3 张竖图；其他数量仍会渲染，但没有相同的错位节奏。

首页与 `/design-index` 的六个大字标题现在是长期创作方向，链接到 `/work?direction=<slug>`。方向及匹配标签集中在 `src/data/design-directions.ts`；项目使用现有 `tags` 或 `category` 归类，不需要新增 schema。示例概念项目仍在 `content/projects/{afterimage,common-ground,soft-signal,field-notes,form-and-feeling,moving-still}/index.md`，并明确标注 Placeholder，不代表真实委托或完成作品。将项目设为 `draft` 或 `private` 后，它不会出现在公开索引或详情页。

## 增加 / 删除图片

图片文件放当前作品目录，不放 public。支持 PNG/JPG/WebP/AVIF/GIF。删除或新增 `images` 数组项即可调整 Gallery，数组顺序就是展示顺序。

```yaml
- id: gallery
  type: gallery
  columns: 3
  images:
    - media:
        file: poster.webp
        alt: 海报完整画面
        caption: 可选图片说明
      fit: contain
    - media:
        file: motion.gif
        alt: 动态视觉实验
      fit: contain
```

图片尺寸从文件自动读取，保留原始比例并提供 width/height，避免加载跳动。如需统一展示框，添加 `ratio: 1.5`（宽÷高）；`fit: contain` 完整展示，`fit: cover` 在框内裁切。没有 ratio 时按原图比例，cover 不会凭空裁切。横图、竖图、方图不必都设置 ratio。

单图块写 `image:`，hero 写 `cover:`，内部字段与 images 的每项一致。占位替换时将 `media` 内的 placeholder/width/height 删除，换为 file/alt；不要同时保留两套字段。

GIF 原样提供，不自动转成静态图。系统不会暂停 GIF 内部动画；重要动效可优先使用有原生控制器的视频。

## 视频

```yaml
- id: motion
  type: video
  title: 动态演示
  width: 1920
  height: 1080
  source:
    kind: local
    file: motion.mp4
  poster:
    file: poster.webp
    alt: 视频封面
  caption: 动态设计过程
```

支持 MP4 / WebM，保存在当前作品目录。只有 published 作品 blocks 引用的视频会输出，未引用视频不会随目录全量发布。缺失的本地视频会使 build 报错。浏览器原生 controls、playsinline、无自动播放；width/height 填真实视频尺寸。第一版不包含转码与字幕管理。

外部视频位置：`source: { kind: external, url: "https://..." }`。v1 使用明确链接打开外部网站，不自动嵌入第三方播放器。未准备好时使用 `kind: placeholder` 与 description。不要将嵌入 HTML 填进数据。

## 维护接口

- Schema / 类型：`src/lib/project-blocks.ts`
- 统一映射：`src/components/project/ProjectRenderer.astro`
- 共用图片、文字、信息、视频组件：`src/components/project/`
- 共享布局 / Next Project：`src/layouts/ProjectDetailLayout.astro`
- 视觉规则：`src/styles/project-detail.css`
- 数值、断点、字号、节奏、motion：`src/design/tokens.mjs` 中 `detail-*`

Previous / Next Project 只从 published Project 中按现有日期排序选择，末项循环到第一项；只有一个项目时显示 Work 返回入口。概念预览之间单独循环，不会跳入真实作品或旧 Demo。不会链接 Archive、draft 或 private。

增加 block type 时扩展判别联合 Schema 与 Renderer 分支；不要为某个 slug 写条件分支。现有首页文件夹与 Work 筛选不需要调整。详情样式全部以 project-detail / detail-* 限定作用域。

微动效仅用于进入视口，hover 仅用于链接；无 JS 时内容可读，prefers-reduced-motion 时禁用 reveal。改变系统动效偏好也会清除尚未显示的 reveal 状态。

## 检查命令

`npm run build` 检查类型、内容和静态路由。`npm test` 使用临时作品测试旧内容兼容、published 边界、图片/GIF、视频引用和撤下、图片增删以及 blocks 重排，不改真实内容。
