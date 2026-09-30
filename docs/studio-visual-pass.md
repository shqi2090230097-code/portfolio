# Creative portfolio pass

本轮视觉优先级改为 Lusion Projects；Glean 仅保留内容与 editorial 思路。已读取项目列表及 Oryzo AI、Of The Oak、Porsche: Dream Machine 三个详情页。参考浏览器访问返回 net::ERR_CONNECTION_CLOSED，无法核验其真实动画、cursor 与手机截图，因此本轮为基于可读取结构和用户明确尺度要求的第一轮吸收，不声称逐像素或动效完全一致。

参考来源：
- https://lusion.co/projects/
- https://lusion.co/projects/oryzo_ai/
- https://lusion.co/projects/of_the_oak/
- https://lusion.co/projects/porsche_dream_machine/

Work 改为 ProjectSequence：巨型标题、数量、小型 metadata、大图和独立项目名。保留原 WorkFilters 的 data-work-* 契约，排序和所有链接仍来自 getPublishedWorks。没有修改首页、真实内容、Schema 或 block API。

workVisual 优先顶层 cover，再取 hero.cover、旧 sections 的首张单图，最后使用明确占位；比例由真实媒体元数据决定。没有默认 crop，竖幅按视口高度限定宽度，超宽图按可用页宽展示。不同尺寸不会统一塞进卡片。

IntersectionObserver 的中心区域负责 active 状态；轻微 scale、标题 translate 和 opacity 使用 CSS transition。原生滚动、无 WebGL、无新动画依赖、无 scroll hijacking。VIEW 只在项目图、精细鼠标与桌面宽度下出现；触摸和 reduced-motion 不增强光标。无 JS 时所有内容和链接正常可见。

详情继续使用相同 Renderer。扩大标题，metadata 使用小字号，Hero 全宽，gallery 隔项错落，Next Project 增加下一件作品的真实预览。手机取消 Gallery 错落，保留原图文重排；tokens 的 sequence-* 与 detail-* 为集中调整入口。

验证：1440 桌面、1280 笔记本、390 手机；滚动列表到底；检查比例、横向溢出、hover、筛选、链接。测试继续涵盖内容增删/换序及 draft/private 边界。Reduced-motion 样式关闭序列缩放/位移与淡化，沿用详情 reveal 的降级规则。
