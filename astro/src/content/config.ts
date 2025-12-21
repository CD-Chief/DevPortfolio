import { defineCollection, z } from 'astro:content';

const projectsCollection = defineCollection({
  type: 'content',
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
