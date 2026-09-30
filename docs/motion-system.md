# Motion system

Timing/easing 与模拟参数集中在 `src/design/motion.mjs`，CSS 变量由 `tokens.mjs` 导出。新增交互复用 `motion-loop.ts` 的 wake/stop/damp，不创建独立常驻 RAF。

- ProjectSequence 缓存轨道几何，原生 scroll 更新目标 progress，共享 RAF 插值 transform。筛选和 resize 重新测量。
- DetailDepth 只处理可见桌面图片；移动端和 reduced motion 保留静态图片。
- MotionTitles 对少数大标题做整行遮罩入场；内容不依赖 JavaScript 才可阅读。
- StudioCursor 桌面细鼠标启用；VIEW / LET’S TALK 从交互语义属性获取。
- StudioChrome 保持轻量原生 details 回退，增强开关动画、Esc 与外部关闭。

## Portfolio Token Field

StudioFooter 使用单个 Canvas 2D。默认桌面 280、笔记本 210、手机 80 个原创基础几何，帧耗时偏高时减量。DPR 上限 1.75，手机 1.5。粒子通过弹簧、阻尼、轻重力接近基准位置；指针施加局部排斥，CTA 有排除区。

CTA 文案/链接只改 `src/data/site.ts` 的 contact。颜色、数量与力学参数只改 motion.mjs。不要加入品牌资产或数百个 DOM 节点。

Footer 离开 viewport 或文档隐藏时停止更新。Reduced motion 使用静态构图，不运行滚动物理。开发时可用 `?motion-debug=1` 查看 token-field 的 data-*：particles、frame-p95（Canvas 更新/绘制耗时，不是整体帧率）、long-tasks、running。诊断只在显式查询参数下启用。

## 页面切换

`data-page-transition` 标记同源 CTA / Next Project，使用共享 550ms 时序的出场/入场面板，不模拟加载百分比。保留原生链接、修饰键和 reduced motion。页面下载时间不包含在动画时长内。
