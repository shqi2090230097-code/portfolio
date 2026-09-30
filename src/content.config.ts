import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { projectBlocksSchema } from './lib/project-blocks';
import { sectionsSchema } from './lib/sections';
import { glob } from 'astro/loaders';

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, '日期使用 YYYY-MM-DD')
  .refine((value) => {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.valueOf()) && parsed.toISOString().slice(0, 10) === value;
  }, '日期必须真实存在');

function workCollection(type: 'project' | 'archive', directory: string) {
  return defineCollection({
    loader: glob({
      base: `./content/${directory}`,
      pattern: '*/index.md',
      generateId: ({ entry }) => {
        const slug = entry.split('/')[0];
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) {
          throw new Error(`作品目录需要小写英文、数字及连字符：${entry}`);
        }
        return slug;
      },
    }),
    schema: z.object({
      title: z.string().trim().min(1),
      date,
      year: z.number().int().min(1900).max(9999),
      type: z.literal(type),
      status: z.enum(['draft', 'published', 'private']),
      category: z.string().trim().min(1),
      tags: z.array(z.string().trim().min(1)),
      cover: z.object({
        file: z.string().regex(/^[a-zA-Z0-9][a-zA-Z0-9._-]*\.(?:png|jpe?g|webp|avif|gif)$/, '填写当前作品目录中的图片文件名'),
        width: z.number().int().positive().optional(),
        height: z.number().int().positive().optional(),
        alt: z.string().trim().min(1),
      }).nullable(),
      summary: z.string().trim().min(1),
      featured: z.boolean(),
      themeBackground: z.string().regex(/^#[0-9a-fA-F]{6}$/).optional(),
      sections: sectionsSchema.optional(),
      blocks: type === 'project' ? projectBlocksSchema.optional() : z.never().optional(),
    }).refine((data) => data.year === Number(data.date.slice(0, 4)), {
      message: 'year 必须与 date 的年份一致', path: ['year'],
    }),
  });
}

export const collections = {
  projects: workCollection('project', 'projects'),
  archive: workCollection('archive', 'archive'),
};
