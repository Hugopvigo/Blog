import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";
import { BLOG_TAGS, PROJECT_TYPES } from "./config";

const baseSchema = z.object({
  draft: z.boolean().default(false),
  featured: z.boolean().default(false),
  title: z.string(),
  date: z.date(),
  /** Etiqueta del artículo (obligatoria en los posts publicados). */
  tag: z.enum(BLOG_TAGS).optional(),
  /** Fragmento de código que se muestra en las ventanas del diseño. */
  snippet: z
    .object({
      file: z.string(),
      lang: z.string(),
      code: z.string(),
    })
    .optional(),
});

const blog = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/blog" }),
  schema: z
    .discriminatedUnion("external", [
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
    ])
    // El tag va en la unión y no en cada rama: discriminatedUnion no admite
    // ramas con refine.
    .superRefine((data, ctx) => {
      if (!data.draft && !data.tag) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["tag"],
          message: `tag obligatorio en posts publicados: ${BLOG_TAGS.join(" | ")}`,
        });
      }
    }),
});

const projects = defineCollection({
  loader: glob({ pattern: "**/*.mdoc", base: "./src/content/projects" }),
  schema: baseSchema.extend({
    url: z.string(),
    type: z.enum(PROJECT_TYPES),
    description: z.string().nullish(),
  }),
});

export const collections = { blog, projects };
