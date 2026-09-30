# 第二阶段：作品集结构骨架

## 三层职责

1. 内容：`content/**/index.md` 中的元数据、可选 sections、Markdown 正文。
2. 结构：`src/components/` 与 `src/layouts/`。`ContentSections` 将内容模块映射到公开组件。
3. 样式：`src/design/tokens.mjs` 保存所有设计数值，`src/styles/global.css` 将语义组件映射到 token。

内容不导入 Astro/React 组件、不写 CSS 类名或像素值。sections 内只有内容、图片固有尺寸（占位时）、阅读顺序，以及 page/content/text/full、grid/pair 等稳定的布局意图。之后改变这些意图的具体表现时，只修改组件和 token。

## 统一 token 与 Grid

| 项目 | 默认规则 | 修改入口 |
| --- | --- | --- |
| 页面最大宽度 | 90rem | page-max |
| 作品内容最大宽度 | 72rem | content-max |
| 正文最大宽度 | 42rem | text-max |
| Mobile | 小于 48rem，4 列，1rem 安全边距 | tokens |
| Tablet | 从 48rem 起，8 列，2rem 安全边距 | breakpoints.tablet、responsiveTokens.tablet |
| Desktop | 从 75rem 起，12 列，3rem 安全边距 | breakpoints.desktop、responsiveTokens.desktop |
| Work Grid | Mobile 1 张、Tablet 2 张、Desktop 3 张 | grid-columns、work-span |
| Image Grid | 1 / 2 / 3 列 | image-columns |
| Image Pair | 1 / 2 / 2 列 | pair-columns |
| section 节奏 | normal、compact、spacious | section-gap 系列 |
| 图片间距 | 与段落、卡片间距独立 | image-gap |
| 首页 Hero | 最小高度 24 / 30 / 34rem，可随内容增长 | hero-min-height |

断点不能通过 CSS var 用在媒体查询中，因此在 `tokens.mjs` 中统一定义断点并生成 CSS；没有在多个组件中重复写媒体查询。BaseLayout 在所有页面注入同一套 token。

修改 token 时，Grid 的 span 要与列数一起调整。上述默认值为中性起点，未确定最终视觉风格。

## 公共组件接口

| 组件 | 主要接口与职责 |
| --- | --- |
| Container | width: page / content / text / full，class，默认 slot |
| SiteHeader | 统一站点导航；文字来自 site.ts |
| SiteFooter | 默认 slot，可替换底部内容 |
| WorkCard | work；封面框、标题、年份、分类、类型、摘要 |
| WorkGrid | works；响应式作品网格与无内容状态 |
| WorkFilters | works；类型、年份、分类组合筛选；无 JS 时显示全部作品 |
| ProjectHero | work、默认 slot；标题、摘要、metadata 和可选封面 |
| ProjectMeta | work；统一项目字段展示 |
| ProjectSection | id、title、width、spacing、默认 slot |
| MediaBlock | work、media、priority；固有尺寸、替代文字、caption、加载优先级 |
| FullWidthImage | work、media；放入 width="full" 的 ProjectSection，跳出页面最大宽度 |
| ImageGrid | work、images；响应式多图网格 |
| ImagePair | work、images（恰好两张）；双图，手机堆叠 |
| TextBlock | paragraphs、默认 slot；段落或原 Markdown 正文 |
| SectionHeading | title、id、level（2 / 3）、默认 slot |
| ContentSections | work；唯一的内容模块到组件的映射位置 |

`WorkList` 保留为 WorkGrid 的兼容入口。页面里的结构性 0、100%、1fr 不属于设计尺寸；原图 width/height 是媒体数据，不是视觉 token。

## 可组合正文

原有必填字段不变，只新增可选 `sections`，旧作品完全不需要修改。模块按数组顺序呈现；Markdown 正文仍可继续使用，放在模块之后。没有 sections 时保持普通 Markdown 页面。

每个模块需要本作品内唯一的英文 `id`，`title` 可选。没有固定的项目章节清单，背景、职责、过程、成果和复盘均可按需要用 text、split 等表达。

在 frontmatter 中、结束的 `---` 之前添加：

```yaml
sections:
  - id: background
    kind: text
    title: 项目背景
    paragraphs:
      - 说明这个项目的背景与目标。
  - id: key-visual
    kind: media
    width: page
    media:
      file: key-visual.webp
      alt: 项目的主视觉
      caption: 可选的图片说明
  - id: process
    kind: split
    title: 设计过程
    mediaPosition: end
    paragraphs:
      - 说明一个设计决策及其原因。
    media:
      file: process.webp
      alt: 设计过程记录
  - id: comparison
    kind: gallery
    arrangement: pair
    images:
      - file: version-a.webp
        alt: 方案 A
      - file: version-b.webp
        alt: 方案 B
  - id: full-result
    kind: media
    width: full
    media:
      file: result.webp
      alt: 最终作品全景
```

- `text`：纯文字；paragraphs 是普通文本数组，不执行 HTML。需要列表、链接或富文本时可继续使用 Markdown 正文。
- `media`：单图，width 允许 text/content/page/full；竖版海报通常选 text，横图选 content/page。
- `gallery`：任意数量的 grid；pair 必须两张。不会自动裁切到同一比例，混合横竖图允许自然高低差。
- `split`：图文组合，mediaPosition 为 start/end，手机自动堆叠。

`content/projects/example-project/index.md` 展示各类组合，`content/archive/example-archive/index.md` 展示单幅竖图与原 Markdown 共存。为了无图片素材时验证骨架，示例使用以下可替换的中性占位：

```yaml
media:
  placeholder: true
  width: 800
  height: 1100
  alt: 竖版作品占位
```

换成真实图片时，将占位对象替换为 `file`、`alt`、可选 `caption`；不需要手动填写真实图片尺寸。

## 图片与发布边界

- 实际图片由 Astro 已有的 imageMetadata 读取固有尺寸；HTML 写入 width/height，CSS 宽度自适应、高度自动，减少加载位移。
- 卡片使用统一封面框（cover-ratio），图片 contain 完整显示，允许黑白灰留白，不裁切或拉伸原图。
- 正文图片默认保持原始比例；占位块同样用原始宽高比预留空间。
- 原 Markdown 的 `/media/集合/slug/文件名` 图片由原生 Sätteri 插件补尺寸。图片必须属于当前作品，不能引用其他作品的私密媒体。
- 继续使用原有仅 published 可生成资源的媒体路由。没有图库全局复制、没有将内容移动到 public，也没有第三方图床请求。
- 本阶段做响应式显示与固有尺寸；未引入图片多尺寸转码。后续可在 MediaBlock/媒体层统一增加 srcset 或压缩，无需修改内容。
- `@astrojs/markdown-satteri` 原本就是当前 Astro 的依赖；现在将它声明为直接开发依赖，使用原生扩展接口，不安装另一套 Markdown 引擎。

参考：[Astro 图片文档](https://docs.astro.build/en/guides/images/)。

## 验证与后续修改

执行 `npm run build`、`npm test`，并在浏览器检查 `/`、`/work`、两类示例详情。检查 390px 手机、820px 平板与 1440px 桌面；重点确认无横向溢出、列数正确、比例不变、筛选可重置、模块顺序正确。

未来更换字体、颜色、整体宽度和留白时先修改 token；改变模块结构时修改组件或 ContentSections；新增内容能力时扩展可选 section kind 并同步模板、校验及文档。暂不增加视觉装饰或动画。
