import { z } from 'astro/zod';
import { mediaSchema } from './sections';
const text = z.string().trim().min(1);
const items = z.array(text).default([]);
const common = { id: z.string().regex(/^[a-z][a-z0-9-]*$/) };
export const projectImageSchema = z.object({
  media: mediaSchema,
  fit: z.enum(['contain', 'cover']).default('contain'),
  ratio: z.number().positive().max(10).optional(),
});
const copy = { eyebrow: text.optional(), heading: text.optional(), body: z.array(text).min(1) };
const meta = { client: text.optional(), role: items, year: z.number().int().optional(), deliverables: items, tools: items };
const imageBlock = (type: 'fullImage' | 'wideImage' | 'portraitImage') => z.object({ ...common, type: z.literal(type), image: projectImageSchema });
export const projectBlockSchema = z.discriminatedUnion('type', [
  z.object({ ...common, type: z.literal('hero'), title: text.optional(), subtitle: text.optional(), year: z.number().int().optional(), role: items, tools: items, categories: items, cover: projectImageSchema.optional() }),
  z.object({ ...common, type: z.literal('intro'), label: text.optional(), heading: text, description: z.array(text).min(1) }),
  imageBlock('fullImage'), imageBlock('wideImage'), imageBlock('portraitImage'),
  z.object({ ...common, type: z.literal('imageGrid'), images: z.array(projectImageSchema).min(1), columns: z.union([z.literal(2), z.literal(3)]).default(2), layout: z.enum(['regular', 'mosaic']).default('regular') }),
  z.object({ ...common, type: z.literal('gallery'), images: z.array(projectImageSchema).min(1), columns: z.union([z.literal(2), z.literal(3)]).default(3), layout: z.enum(['regular', 'stage']).default('regular') }),
  z.object({ ...common, ...copy, type: z.literal('imageText'), image: projectImageSchema, imagePosition: z.enum(['left', 'right']).default('left') }),
  z.object({ ...common, ...copy, type: z.literal('text'), alignment: z.enum(['left', 'center', 'right']).default('left') }),
  z.object({ ...common, type: z.literal('statement'), text, label: text.optional() }),
  z.object({ ...common, type: z.literal('video'), title: text, source: z.discriminatedUnion('kind', [
    z.object({ kind: z.literal('local'), file: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(mp4|webm)$/) }),
    z.object({ kind: z.literal('external'), url: z.url().refine(v => v.startsWith('https://'), '外部视频必须使用 HTTPS') }),
    z.object({ kind: z.literal('placeholder'), description: text }),
  ]), width: z.number().int().positive(), height: z.number().int().positive(), poster: mediaSchema.optional(), caption: text.optional() }),
  z.object({ ...common, type: z.literal('spacer'), size: z.enum(['small', 'medium', 'large']).default('medium') }),
  z.object({ ...common, ...meta, type: z.literal('projectMeta'), heading: text.default('Project information') }),
]);
export const projectBlocksSchema = z.array(projectBlockSchema).min(1)
  .refine(blocks => new Set(blocks.map(b => b.id)).size === blocks.length, 'block id 不能重复')
  .refine(blocks => blocks[0]?.type === 'hero' && blocks.filter(b => b.type === 'hero').length === 1, '首个 block 必须是唯一 hero');
export type ProjectBlock = z.infer<typeof projectBlockSchema>;
export type ProjectImage = z.infer<typeof projectImageSchema>;
