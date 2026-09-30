import { z } from 'astro/zod';
export const mediaSchema = z.union([
  z.object({ file: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpe?g|webp|avif|gif)$/), width: z.number().int().positive().optional(), height: z.number().int().positive().optional(), alt: z.string().min(1), caption: z.string().optional() }),
  z.object({ url: z.url(), width: z.number().int().positive(), height: z.number().int().positive(), alt: z.string().min(1), caption: z.string().optional() }),
  z.object({ placeholder: z.literal(true), width: z.number().int().positive(), height: z.number().int().positive(), alt: z.string().min(1), caption: z.string().optional() }),
]);
const common = { id: z.string().regex(/^[a-z][a-z0-9-]*$/), title: z.string().min(1).optional() };
export const sectionSchema = z.discriminatedUnion('kind', [
  z.object({ ...common, kind: z.literal('text'), paragraphs: z.array(z.string().min(1)).min(1) }),
  z.object({ ...common, kind: z.literal('media'), media: mediaSchema, width: z.enum(['text', 'content', 'page', 'full']).default('content') }),
  z.object({ ...common, kind: z.literal('gallery'), images: z.array(mediaSchema).min(1), arrangement: z.enum(['grid', 'pair']).default('grid') }).refine((s) => s.arrangement !== 'pair' || s.images.length === 2, 'pair 必须恰好两张图片'),
  z.object({ ...common, kind: z.literal('split'), paragraphs: z.array(z.string().min(1)).min(1), media: mediaSchema, mediaPosition: z.enum(['start', 'end']).default('end') }),
]);
export const sectionsSchema = z.array(sectionSchema).refine((sections) => new Set(sections.map((s) => s.id)).size === sections.length, 'section id 不能重复');
export type ContentMedia = z.infer<typeof mediaSchema>;
export type ContentSection = z.infer<typeof sectionSchema>;
