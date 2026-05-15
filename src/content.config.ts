import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const baseSchema = z.object({
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  title: z.string(),
  date: z.date(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/blog" }),
  schema: z.discriminatedUnion("external", [
    baseSchema.extend({
      external: z.literal(false),
      description: z.string().optional(),
      ogImagePath: z.string().optional(),
      canonicalUrl: z.string().optional(),
    }),
    baseSchema.extend({
      external: z.literal(true),
      url: z.string(),
    }),
  ]),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/projects" }),
  schema: baseSchema.extend({
    url: z.string(),
  }),
});

export const collections = { blog, projects };
