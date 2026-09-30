import { motion } from './motion.mjs';
// 唯一数值来源。断点既生成媒体查询，也导出供测试与未来脚本复用。
export const breakpoints = { tablet: '48rem', desktop: '75rem' };
export const tokens = {
  'space-1': '.25rem', 'space-2': '.5rem', 'space-3': '.75rem',
  'space-4': '1rem', 'space-6': '1.5rem', 'space-8': '2rem',
  'space-12': '3rem', 'space-16': '4rem', 'space-24': '6rem', 'space-32': '8rem',
  'page-max': '90rem', 'content-max': '72rem', 'text-max': '42rem',
  'font-family': 'system-ui, sans-serif',
  'text-small': '.875rem', 'text-body': '1rem', 'text-lead': '1.25rem',
  'text-heading': '1.75rem', 'text-title': '2.5rem', 'text-display': '3rem',
  'weight-regular': '400', 'weight-medium': '500', 'weight-bold': '650',
  'leading-body': '1.75', 'leading-heading': '1.2', 'leading-meta': '1.5',
  'radius-none': '0', 'radius-small': '.25rem',
  'color-bg': '#ffffff', 'color-surface': '#f2f2f2', 'color-text': '#181818',
  'color-muted': '#606060', 'color-border': '#d5d5d5',
  'border-width': '1px', 'focus-width': '2px', 'underline-offset': '.2em',
  'gutter': 'var(--space-4)', 'grid-gap': 'var(--space-4)',
  'section-gap': 'var(--space-16)', 'section-gap-compact': 'var(--space-8)',
  'section-gap-spacious': 'var(--space-24)', 'image-gap': 'var(--space-4)',
  'grid-columns': '4', 'work-span': '4', 'pair-columns': '1', 'image-columns': '1',
  'split-text-span': '4', 'split-media-span': '4', 'hero-title-span': '4',
  'meta-columns': '2', 'hero-min-height': '24rem', 'cover-ratio': '4 / 3',
  'header-gap': 'var(--space-4)', 'card-row-gap': 'var(--space-12)',
};
export const responsiveTokens = {
  tablet: {
    'gutter': 'var(--space-8)', 'grid-gap': 'var(--space-6)',
    'section-gap': 'var(--space-24)', 'section-gap-spacious': 'var(--space-32)',
    'image-gap': 'var(--space-6)', 'grid-columns': '8', 'work-span': '4',
    'pair-columns': '2', 'image-columns': '2', 'split-text-span': '4', 'split-media-span': '4',
    'hero-title-span': '8', 'meta-columns': '4', 'hero-min-height': '30rem',
    'text-title': '3.5rem', 'text-display': '4rem',
  },
  desktop: {
    'gutter': 'var(--space-12)', 'grid-gap': 'var(--space-8)',
    'section-gap': 'var(--space-32)', 'image-gap': 'var(--space-8)',
    'grid-columns': '12', 'work-span': '4', 'image-columns': '3',
    'split-text-span': '4', 'split-media-span': '8', 'hero-title-span': '8',
    'hero-min-height': '34rem', 'text-title': '4rem', 'text-display': '5rem',
  },
};
// 参考录屏 1012 × 570：只替换展示 token，内容契约不变。
Object.assign(tokens, {
  'page-max': '84rem', 'color-bg': '#fdfdfd', 'color-surface': '#f3f5f6',
  'color-text': '#232729', 'color-muted': '#7c858a', 'color-border': '#e6ecef',
  'font-family': 'Arial, "Helvetica Neue", system-ui, sans-serif',
  'text-navigation': '.875rem', 'text-caption': '.75rem',
  'radius-media': '1.25rem', 'radius-card': '1.5rem', 'radius-pill': '999px',
  'shadow-soft': '0 .5rem 2rem rgb(39 87 105 / .08)',
  'duration-fast': '180ms', 'duration-normal': '360ms', 'duration-fan': '620ms',
  'ease-standard': 'cubic-bezier(.22,.7,.25,1)', 'ease-spring': 'cubic-bezier(.2,1.24,.36,1)',
  'stage-aspect': '1012 / 558', 'stage-width': '100%', 'stage-height': '100svh',
  'scene-scale': '1.85', 'fan-spread': '.62',
  'folder-width': '29cqw', 'folder-height': '23.4cqw',
  'folder-top': 'calc(50% - 8.4cqw * var(--scene-scale))',
  'folder-radius': '2cqw', 'folder-tab-width': '44%', 'folder-tab-height': '7cqw',
  'folder-back-top': '3.4cqw', 'folder-front-top': '6.8cqw', 'folder-front-height': '16.6cqw',
  'folder-open-drop': '1.8cqw', 'folder-open-scale': '.95',
  'folder-perspective': '120cqw', 'folder-glass-blur': '1.3cqw',
  'folder-back': 'linear-gradient(150deg,#13bfd9,#37c9df 66%,#7bdde7)',
  'folder-front': 'linear-gradient(150deg,rgba(58,222,234,.96),rgba(12,198,223,.97) 65%,rgba(73,216,231,.92))',
  'folder-shadow': 'inset .1cqw .12cqw .5cqw rgb(255 255 255 / .38), inset 0 -1.2cqw 1.7cqw rgb(221 255 255 / .58), 0 1.1cqw 1.4cqw rgb(57 192 211 / .2)',
  'folder-back-shadow': '0 .8cqw 2cqw rgb(58 174 197 / .13)',
  'floor-shadow-width': '21cqw', 'floor-shadow-height': '2.2cqw',
  'floor-shadow-top': '27.1cqw', 'floor-shadow-blur': '1.1cqw', 'floor-shadow-color': 'rgb(70 137 156 / .27)',
  'folder-label-size': '2.15cqw', 'folder-label-left': '7%', 'folder-label-bottom': '10%',
  'folder-label-color': '#e4fdff', 'folder-label-shadow': '0 .1cqw .2cqw rgb(51 141 152 / .18)',
  'folder-arrow-size': '4.05cqw', 'folder-arrow-right': '6%', 'folder-arrow-bottom': '21%',
  'folder-arrow-font': '3cqw', 'folder-arrow-color': '#6ebfcf', 'folder-arrow-bg': '#d7f9fb',
  'folder-arrow-shadow': '0 .2cqw .6cqw rgb(58 138 154 / .16), inset 0 .1cqw .1cqw white',
  'sticker-one-size': '7cqw', 'sticker-one-left': '16%', 'sticker-one-top': '10%',
  'sticker-one-rotation': '-12deg', 'sticker-one-bg': '#f2d54f',
  'sticker-two-width': '4.9cqw', 'sticker-two-height': '4.8cqw', 'sticker-two-left': '59%', 'sticker-two-top': '33%', 'sticker-two-rotation': '12deg',
  'sticker-border': '.38cqw', 'sticker-shadow': '0 .25cqw .35cqw rgb(25 109 130 / .18)',
  'sticker-type-size': '1.45cqw', 'sticker-text': '#6f7c83', 'sticker-outline': '#fff', 'folder-open-tilt': '5deg',
  'welcome-font': '"Pacifico", "Brush Script MT", cursive', 'welcome-size': '28cqw',
  'welcome-top': 'calc(50% - 3.7cqw * var(--scene-scale))',
  'welcome-tracking': '-.055em', 'welcome-color': '#e6edf7', 'welcome-stroke': '.15cqw',
  'welcome-stroke-color': '#d7deeb', 'welcome-scale-x': '1.24', 'welcome-left': 'calc(50% - 3cqw)', 'welcome-scale-y': '1',
  'welcome-shadow': '.18cqw .28cqw .1cqw #d9e2ef, .38cqw .48cqw .3cqw rgb(206 220 238 / .7), -.18cqw -.18cqw .2cqw white',
  'welcome-highlight': 'linear-gradient(170deg,white 20%,rgba(255,255,255,.05) 40%,rgba(209,223,241,.4) 58%,white 77%,rgba(210,223,241,.2) 88%)',
  'fan-radius': '1.4cqw', 'fan-padding': '.45cqw', 'fan-caption-height': '3cqw',
  'fan-caption-size': '1.05cqw', 'fan-border': '.1cqw', 'fan-outline': 'rgb(255 255 255 / .9)',
  'fan-shadow': '0 .8cqw 2cqw rgb(65 74 94 / .12)',
  'fan-hover-shadow': '0 1cqw 2.4cqw rgb(65 74 94 / .22)',
  'fan-hover-lift': '-1.3cqw', 'fan-hover-scale': '1.12', 'fan-hover-rank': '90',
  'fan-blank-opacity': '1', 'fan-label-size': '1.1cqw', 'fan-label-offset': '-1.8cqw', 'fan-label-bg': 'rgb(255 255 255 / .86)', 'fan-label-color': '#708275', 'fan-safe-horizontal': '-17cqw', 'fan-safe-top': '-11cqw',
  'float-distance': '.35cqw', 'float-duration': '5.5s', 'entry-duration': '480ms',
  'entry-distance': '.5cqw', 'pointer-duration': '180ms',
});
Object.assign(responsiveTokens.tablet, {
  'scene-scale': '1', 'fan-spread': '1', 'stage-height': 'auto',
  'stage-width': 'min(100%, calc(100svh * 1.8136))', 'welcome-size': '23cqw',
});
Object.assign(responsiveTokens.desktop, {
  'scene-scale': '1', 'fan-spread': '1', 'work-span': '6',
  'text-title': '3.5rem',
});

// 每个槽位是参考画面的空间参数，不是作品数据。优先作品放在中间前排。
export const fanSlots = [
  { x: -21.4, y: -3.1, rotate: -18, closedX: -6, closedY: .4, closedRotate: -7, closedScale: .72, width: 12.8, height: 13.8, rank: 20, delay: 65, color: '#efdce8', workIndex: 4, label: 'ui design', framed: false },
  { x: -12.5, y: -7.3, rotate: -9, closedX: -3.8, closedY: 0, closedRotate: -5, closedScale: .77, width: 13.8, height: 13.3, rank: 30, delay: 35, color: '#aed856', workIndex: 2, label: '', framed: false },
  { x: -4.5, y: -7.2, rotate: -2, closedX: -1.5, closedY: 1, closedRotate: -2, closedScale: .79, width: 12.3, height: 12.8, rank: 40, delay: 15, color: '#5dafe1', workIndex: 1, label: '', framed: false },
  { x: 6, y: -8.4, rotate: 4, closedX: 1.8, closedY: -.3, closedRotate: 3, closedScale: .72, width: 13.6, height: 14, rank: 60, delay: 0, color: '#28114c', workIndex: 0, label: '', framed: true },
  { x: 13.2, y: -3.1, rotate: 11, closedX: 4.7, closedY: .8, closedRotate: 5, closedScale: .7, width: 11.7, height: 10.6, rank: 30, delay: 40, color: '#777c80', workIndex: 3, label: '', framed: false },
  { x: 19.8, y: -1.8, rotate: 14, closedX: 7, closedY: .4, closedRotate: 8, closedScale: .72, width: 10.6, height: 13.2, rank: 20, delay: 70, color: '#aeff37', workIndex: 5, label: 'Comment', framed: false },
];
export const interaction = { closeDelay: 90, maxTiltX: 1.1, maxTiltY: 1.6, maxShift: .2 };
// Project Detail: scoped rules consume these tokens without changing the home scene.
Object.assign(tokens, {
  'detail-max': '84rem', 'detail-reading': '42rem', 'detail-portrait': '38rem',
  'detail-title': 'clamp(3rem, 8vw, 8rem)', 'detail-heading': 'clamp(1.8rem, 3.5vw, 3.6rem)',
  'detail-statement': 'clamp(2.6rem, 6vw, 6rem)', 'detail-leading': '1.08',
  'detail-tracking': '-.045em', 'detail-section-gap': 'clamp(4rem, 10vw, 10rem)',
  'detail-hero-gap': 'clamp(3rem, 7vw, 7rem)', 'detail-grid-columns': '1',
  'detail-split-columns': 'minmax(0, 1fr)', 'detail-split-right': 'minmax(0, 1fr)', 'detail-copy-order': '0',
  'detail-grid-three': '1', 'detail-intro-columns': 'minmax(0, 1fr)',
  'detail-meta-columns': '2', 'detail-reveal-distance': '1rem', 'detail-reveal-duration': '700ms',
  'detail-space-small': 'var(--space-4)', 'detail-space-medium': 'var(--space-12)',
  'detail-space-large': 'var(--space-24)', 'detail-radius': 'var(--radius-small)',
});
Object.assign(responsiveTokens.tablet, {
  'detail-grid-columns': '2', 'detail-grid-three': '2',
  'detail-split-columns': 'minmax(0, 1.3fr) minmax(0, 1fr)', 'detail-split-right': 'minmax(0, 1fr) minmax(0, 1.3fr)', 'detail-copy-order': '-1',
  'detail-intro-columns': 'minmax(0, 1fr) minmax(0, 2fr)', 'detail-meta-columns': '3',
});
Object.assign(responsiveTokens.desktop, { 'detail-grid-three': '3' });
Object.assign(tokens, {
  'sequence-title': 'clamp(5rem, 22vw, 23rem)', 'sequence-name': 'clamp(1.8rem, 4.8vw, 5rem)',
  'sequence-meta': '.75rem', 'sequence-height': '65svh', 'sequence-gap': 'clamp(5rem, 15vw, 14rem)',
  'sequence-cursor': '5rem', 'sequence-inactive': '.5', 'sequence-scale': '.985',
  'sequence-shift': '1rem', 'sequence-duration': '800ms', 'sequence-tracking': '-.065em',
  'sequence-align': 'start', 'sequence-filter-gap': 'var(--space-4)',
  'detail-title': 'clamp(3rem, 9vw, 10rem)', 'detail-next-size': 'clamp(2.8rem, 7vw, 8rem)',
  'detail-gallery-offset': '0', 'detail-next-height': '45svh',
});
Object.assign(responsiveTokens.tablet, { 'sequence-align': 'end', 'sequence-height': '76svh', 'detail-gallery-offset': 'var(--space-24)' });
Object.assign(tokens, {
 'lusion-bg':'#F0F1FA', 'lusion-text':'#000000', 'lusion-blue':'#1A2FFB',
 'lusion-blue-dark':'#071BDF', 'lusion-muted':'#E4E6EF', 'lusion-dark':'#121416',
 'studio-gutter':'3vw', 'studio-heading':'clamp(2.5rem, 16.3vw, 21rem)',
 'studio-nav':'.7rem', 'studio-radius':'14px', 'studio-hero':'62svh',
 'studio-item-width':'91vw', 'studio-track-height':'280svh', 'studio-track-gap':'5vw',
 'studio-card-height':'54svh', 'studio-title':'clamp(1.65rem, 3.2vw, 3.6rem)',
 'studio-motion':'800ms', 'studio-title-delay':'90ms', 'studio-title-shift':'14px',
 'studio-cursor-dot':'8px', 'studio-cursor-view':'80px', 'studio-contact':'clamp(3.8rem, 13vw, 12rem)',
 'studio-detail-hero':'auto', 'studio-detail-name':'clamp(3rem, 7vw, 8rem)',
 'studio-detail-wide':'94vw', 'studio-detail-portrait':'88vw', 'studio-description-columns':'1fr',
 'studio-detail-padding':'var(--space-24)',
});
Object.assign(responsiveTokens.tablet, {
 'studio-heading':'clamp(3rem, 18.8vw, 21rem)', 'studio-detail-hero':'90svh', 'studio-hero':'64svh', 'studio-item-width':'52vw', 'studio-detail-wide':'70vw',
 'studio-detail-portrait':'40vw', 'studio-description-columns':'3fr 6fr',
 'studio-detail-padding':'var(--space-32)',
});
Object.assign(tokens, {
 'motion-fast': `${motion.fast}ms`, 'motion-medium': `${motion.medium}ms`, 'motion-page': `${motion.page}ms`,
 'ease-weighted': motion.weighted, 'ease-soft': motion.soft,
 'duration-fast':'var(--motion-fast)', 'duration-normal':'var(--motion-medium)',
 'duration-fan':'var(--motion-page)', 'ease-standard':'var(--ease-weighted)', 'ease-spring':'var(--ease-soft)',
 'studio-motion':'calc(var(--motion-medium) * 2)', 'sequence-duration':'var(--motion-page)',
 'detail-reveal-duration':'var(--motion-page)', 'pointer-duration':'var(--motion-fast)', 'entry-duration':'var(--motion-page)',
 'studio-title-delay':`${motion.titleDelay}ms`, 'menu-stagger':`${motion.menuStagger}ms`,
 'field-height':'110svh', 'field-cta':'clamp(3rem, 10vw, 10rem)', 'field-cta-top':'42%',
});
Object.assign(responsiveTokens.tablet, { 'field-height':'135svh' });
// Meilin presentation layer; content and block data stay independent.
Object.assign(tokens, {
 'meilin-black':'#090909', 'meilin-paper':'#f7f7f3', 'meilin-green':'#abd64e',
 'meilin-ink':'#141414', 'meilin-rule':'#d7d7d0',
 'meilin-edge':'clamp(1rem, 2.2vw, 2.25rem)', 'meilin-image-gap':'6px',
 'meilin-display':'clamp(5rem, 15.5vw, 16rem)',
 'meilin-work-title':'clamp(4.5rem, 14vw, 15rem)',
 'meilin-meta':'.68rem', 'meilin-piece-title':'clamp(1.4rem, 2.1vw, 2.5rem)',
 'meilin-index-title':'clamp(3.4rem, 8.1vw, 8.8rem)',
 'meilin-preview-width':'clamp(16rem, 25vw, 28rem)',
 'meilin-red':'#df473c', 'meilin-blur':'2px',
 'meilin-cursor-size':'12px', 'meilin-cursor-interactive-scale':'2.3',
 'about-display':'clamp(7rem, 24vw, 24rem)',
 'about-lead':'clamp(2.4rem, 5.2vw, 6rem)',
 'about-statement':'clamp(3.6rem, 8vw, 10rem)',
 'about-section-title':'clamp(3.5rem, 8vw, 9rem)',
 'about-row-title':'clamp(2rem, 4.4vw, 5rem)',
 'about-contact-title':'clamp(4.4rem, 13vw, 15rem)',
 'about-rule':'1px solid var(--meilin-rule)',
 'design-index-display':'clamp(7rem, 16vw, 17rem)',
 'detail-mosaic-gap':'6px', 'detail-stage-gap':'clamp(.5rem, 1.1vw, 1.25rem)',
 'detail-stage-padding':'clamp(5rem, 11vw, 11rem)',
 'detail-stage-wide':'min(76vw, 94rem)',
 'detail-switch-side':'clamp(1.25rem, 3vw, 3rem)',
});
const declarations = (values) => Object.entries(values).map(([key, value]) => `--${key}:${value}`).join(';');
export const tokenCSS = `:root{${declarations(tokens)}}` + Object.entries(responsiveTokens)
  .map(([name, values]) => `@media(min-width:${breakpoints[name]}){:root{${declarations(values)}}}`).join('');
