import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { TECH_NAMES, TOPICS } from './data/tech';

const projectsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: ({ image }) =>
    z.object({
      id: z.number(),
      title: z.string(),
      size: z.enum(['S', 'M', 'L']),
      tech: z.array(z.enum(TECH_NAMES)),
      image: image().optional(),
      summary: z.string(),
      link: z.string().optional(),
      showMoreButton: z.boolean().default(true),
    }),
});

const postsCollection = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
      excerpt: z.string(),
      coverImage: image(),
      publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      topic: z.enum(TOPICS),
      tech: z.array(z.enum(TECH_NAMES)).default([]),
      relatedPosts: z.array(z.string()).optional(),
      relatedProjects: z.array(z.number()).optional(),
      links: z
        .array(
          z.object({
            label: z.string(),
            url: z.string().url(),
          })
        )
        .optional(),
    }),
});

export const collections = {
  projects: projectsCollection,
  posts: postsCollection,
};
