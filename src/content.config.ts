import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const faq = defineCollection({
  loader: glob({ pattern: "**/src/content/faq/*.md", base: "." }),
  schema: z.object({
    title: z.string(),
    order: z.number().optional().default(0),
  }),
});

export const collections = { faq };
