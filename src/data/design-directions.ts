import type { Work } from '../lib/works';

export interface DesignDirection {
  slug: string;
  title: string;
  chinese: string;
  tag: string;
  description: string;
  background: string;
  foreground: string;
}

// Six enduring directions, not six client claims. Projects opt in through an existing tag.
export const designDirections: DesignDirection[] = [
  { slug:'brand-language', title:'BRAND LANGUAGE', chinese:'品牌语言', tag:'Brand Language', description:'视觉识别、概念与品牌语言。', background:'#d7d8d1', foreground:'#252620' },
  { slug:'visual-stories', title:'VISUAL STORIES', chinese:'视觉叙事', tag:'Visual Stories', description:'以构图、色彩和氛围讲述视觉故事。', background:'#cbc9c0', foreground:'#24231f' },
  { slug:'illustration-world', title:'ILLUSTRATION WORLD', chinese:'插画世界', tag:'Illustration World', description:'插画、角色与原创图像语言。', background:'#d7ccc2', foreground:'#30261f' },
  { slug:'visual-experiments', title:'VISUAL EXPERIMENTS', chinese:'视觉实验', tag:'Visual Experiments', description:'动态图像、AI 辅助与新媒介探索。', background:'#c6ccd0', foreground:'#202a2c' },
  { slug:'form-and-color', title:'FORM & COLOR', chinese:'形式与色彩', tag:'Form & Color', description:'海报、构成、字体和色彩研究。', background:'#c9c5b9', foreground:'#28241e' },
  { slug:'personal-projects', title:'PERSONAL PROJECTS', chinese:'个人创作', tag:'Personal Projects', description:'由自己发起、持续发展的创作项目。', background:'#c9c8c2', foreground:'#22231f' },
];

export function workInDirection(work: Work, direction: DesignDirection): boolean {
  const tag = direction.tag.toLowerCase();
  return work.data.tags.some(value => value.toLowerCase() === tag)
    || work.data.category.toLowerCase() === tag;
}
