# 项目长期规则

## 目标与范围

这是长期保存设计作品的个人网站。优先内容可靠性、可移植性和维护成本。技术栈固定为 Astro + TypeScript，现有 Content Collections 作为回退与本地内容，Supabase Database/Auth/Storage 作为可编辑内容源。使用 Astro Cloudflare server 支持即时发布后的动态 slug。未经用户明确要求，不做品牌视觉设计或改动现有公开视觉。

## Supabase Admin 长期规则

- `/admin` 不加入公开导航，必须由 Supabase Auth 和 middleware 保护；未配置环境变量时只显示配置说明。
- 公开数据库查询只读取 `published`。任何 Admin 操作依赖 RLS，禁止加入 service role key、关闭 RLS 或把密钥写死。
- `projects.sort_order` 决定公开作品与 Next Project 顺序；`project_blocks.sort_order` 决定详情模块顺序。不得依赖 UUID 或创建时间排序。
- 数据库项目通过 `projects-repository.ts` 映射到现有 Work/ProjectBlock，再交给同一个 `ProjectRenderer`。不要为 Preview、Supabase 或单个项目复制详情页。
- 本地 Content Collections 必须继续可用。数据库中同 slug 的项目优先，避免 seed 后重复展示。
- Storage 只保存媒体文件；数据库保存 URL、固有尺寸、alt 和 caption。禁止 base64 入库。删除引用不自动删除 Storage 文件，避免误删其他引用；需要清理时先查引用。
- Schema/RLS/storage 改动必须同步 `supabase/migrations`、TypeScript 类型、README 与测试。生产部署使用 Cloudflare Workers；运行时代码不得依赖 Node 文件系统。

## 内容契约

- Project 放 `content/projects/<slug>/index.md`，Archive 放 `content/archive/<slug>/index.md`。
- 每个作品必须包含 title、date、year、type、status、category、tags、cover、summary、featured。
- Schema 位于 `src/content.config.ts`。date 为带引号的真实 YYYY-MM-DD，year 与 date 一致，type 与集合一致。
- status 仅允许 draft、published、private，不设置默认 published。
- 内容不依赖展示组件、CSS 类名或框架导入。重做页面不得要求用户重新整理内容。
- slug 来自目录名，仅小写英文字母、数字和连字符。不要无故修改已发布 slug；需要更改时同时设计重定向。
- 内容结构改动同步更新 templates、README、测试，并考虑现有内容兼容。

## 公开边界

- 公开列表、首页精选、详情 getStaticPaths、媒体以及未来新增搜索、feed、sitemap 等，必须使用 `src/lib/works.ts` 的 getPublishedWorks。
- 仅 status === published 可公开；draft 和 private 在开发、构建、预览中一律不显示且无详情路由。
- 不将作品源文件、inbox 或私密资源放入 public，不增加绕过状态过滤的直接内容导出。
- 图片保存在作品目录，只经 `src/pages/media/[...path].ts` 输出 published 作品的选定图片。不要改用全局图片 glob 或无条件复制整个 content。
- private 不等于访问密码；只部署 dist。撤下作品时需要完整替换旧部署产物。
- inbox 为待整理区，不属于 collection，不参与输出。私密源内容不能进入公开 Git 仓库。

## 工程维护与验收

- 视觉写在 layouts/components/styles，站点文字写在 src/data/site.ts，内容写在 content。
- 优先 Astro 和标准库，不为轻量功能增加框架。保持严格 TypeScript 和可访问的语义 HTML。
- package-lock.json 应提交，使用 npm ci 重现环境。
- 修改发布逻辑、schema 或路由后运行 npm run build 和 npm test，检查两类作品、各状态、直接访问以及资源泄漏。
- 测试在临时目录使用虚拟内容，不修改真实作品。不得将测试文件当作用户真实作品展示。
- 页面变更需运行站点并检查基础导航、正文、移动端可读性；用户明确说不做视觉设计时不得扩展设计范围。

## Layout System 长期规则

- 所有设计数值与断点集中在 src/design/tokens.mjs；不在组件中散写宽度、字体、间距和媒体查询。
- global.css 负责结构与 token 映射；不要通过修改作品数据来改变整站字体、颜色或视觉效果。
- sections 是可选的向后兼容扩展，只记录内容、模块顺序与稳定的布局意图。不得要求旧 Markdown 迁移。
- 新模块统一在 src/lib/sections.ts 校验，由 ContentSections 映射；同步 docs/layout-system.md 和模板示例。
- MediaBlock 是图片显示入口，维持固有尺寸、替代文字及原始比例。卡片 contain，不默认裁切。现有 Markdown 图片由原生处理器补尺寸。
- 不将长文强制塞进数据字段；保持 Markdown 正文兼容。全宽图片由 ProjectSection width=full 提供，不用 100vw 造成滚动条溢出。
- 修改布局需验证 Home、Work、Project Detail、Archive Detail 的桌面及手机；筛选要验证组合条件、空结果、重置和无 JS 基础内容。

## 首页参考复刻规则

- 当前用户已明确授权按提供录屏复刻视觉与交互。以 docs/reference-replica.md 记录的参考范围为准，不自行增加新的概念或录屏不存在的首屏 UI。
- FolderPortfolio 只读取 published，featured 优先、最近作品补位。空卡位为装饰占位，不添加虚假内容或链接。
- 视觉参数在 tokens.mjs / fanSlots / interaction，素材接口在 src/data/home.ts。复刻与后续换素材不得改写作品文件或 Schema。
- 默认、展开、hover、移出、键盘 Escape、窄屏点击、reduced-motion 都应可用；不得为了截图写死展开状态。
- 原字形、贴纸、作品图缺失时明确标记占位，不声称逐像素一致，不使用整张录屏截图作为交互背景。

## Project Detail System v1

- 新项目优先用可选 blocks；旧 sections / Markdown 保持兼容，禁止强制迁移。blocks 在 src/lib/project-blocks.ts 校验，唯一 hero 在首项，id 唯一。
- 项目内容与占位全部在 content/projects/<slug>/index.md；不得在 Renderer 中判断具体 slug 或写 Demo 文案。
- 使用统一 ProjectDetailLayout / ProjectRenderer，视觉限定 project-detail 作用域，detail-* 数值仍放 tokens.mjs。
- blocks 图片复用 resolveMedia / MediaBlock，显式 ratio + fit 才改变展示框；原始文件尺寸必须保留。
- 视频仅输出 published 项目 blocks 明确引用的 mp4/webm，不全量复制视频、不自动播放、不无条件嵌入外部播放器。
- 新增 block 或媒体类型需同步 docs/project-detail-system.md 和发布边界测试，验证数据增删/重排与视频撤下。

## Creative portfolio 展示层

- Work 使用 ProjectSequence，不替换首页 FolderPortfolio。保留 WorkFilters 的 data-work-* 过滤契约。
- workVisual 从现有 cover / hero / sections 读取比例，不能为了列表裁切或写入假艺术作品。
- sequence-* / detail-* token 管理工作序列与详情视觉，不改 Schema 来实现尺寸变化。
- 原生滚动；cursor 只增强桌面精细鼠标，触摸/reduced-motion 不启用；无 JS 时链接和内容完整可用。
- 视觉参考访问限制记录于 docs/studio-visual-pass.md，不把推断说成已观察到的参考动效。
