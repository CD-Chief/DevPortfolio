import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      title: z.string(),
      size: z.enum(['S', 'M', 'L']),
      tech: z.array(z.string()),
      image: image().optional(),
      summary: z.string(),
      link: z.string().optional(),
      showMoreButton: z.boolean().default(true),
    }),
});

export const collections = {
  projects: projectsCollection,
};
