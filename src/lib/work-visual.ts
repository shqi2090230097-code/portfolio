import type { Work } from './works';
import type { ContentMedia } from './sections';
// Use existing content for the preview. No presentation fields are added to the schema.
export function workVisual(work: Work): ContentMedia {
  if (work.data.cover) return work.data.cover;
  const hero = work.data.blocks?.find(block => block.type === 'hero');
  if (hero?.type === 'hero' && hero.cover) return hero.cover.media;
  const section = work.data.sections?.find(section => section.kind === 'media');
  if (section?.kind === 'media') return section.media;
  return { placeholder: true, width: 1600, height: 1000, alt: `${work.data.title} · 封面待补充` };
}
