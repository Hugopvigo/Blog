import { getCollection, type CollectionEntry } from "astro:content";
import slugify from "slugify";

export function getReadingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.ceil(words / 200);
}

export interface Heading {
  depth: number;
  text: string;
  slug: string;
}

export function extractHeadings(body: string): Heading[] {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings: Heading[] = [];
  let match: RegExpExecArray | null;
  while ((match = headingRegex.exec(body)) !== null) {
    const depth = match[1].length;
    const text = match[2].trim();
    headings.push({ depth, text, slug: slugify(text.toLowerCase()) });
  }
  return headings;
}

/** Slug del post, sin la extensión. */
export function postSlug(entry: CollectionEntry<"blog">): string {
  return entry.id.replace(/\.mdoc$/, "");
}

/** Enlace al post: interno o externo. */
export function postHref(entry: CollectionEntry<"blog">): string {
  if (entry.data.external) return entry.data.url;
  return `/blog/${postSlug(entry)}`;
}

/** Posts publicados, del más reciente al más antiguo. */
export async function getPublishedPosts(): Promise<CollectionEntry<"blog">[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Proyectos publicados, del más reciente al más antiguo. */
export async function getPublishedProjects(): Promise<
  CollectionEntry<"projects">[]
> {
  const projects = await getCollection("projects", ({ data }) => !data.draft);
  return projects.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

/** Número de fila: 06, 05… con el total de elementos. */
export function postNumber(index: number, total: number): string {
  return String(total - index).padStart(2, "0");
}

/** Host de una URL, sin protocolo ni barra final. */
export function urlHost(url: string): string {
  return url.replace(/^https?:\/\//, "").replace(/\/+$/, "");
}

/**
 * Posts relacionados: primero los del mismo tag y, si no llegan a n, los más
 * recientes. El post actual queda fuera.
 */
export function relatedPosts(
  current: CollectionEntry<"blog">,
  all: CollectionEntry<"blog">[],
  n = 3
): CollectionEntry<"blog">[] {
  const others = all.filter((post) => post.id !== current.id);
  const sameTag = others.filter(
    (post) => post.data.tag && post.data.tag === current.data.tag
  );
  const rest = others.filter((post) => !sameTag.includes(post));
  return [...sameTag, ...rest].slice(0, n);
}

/** Minúsculas, sin acentos: para buscar y comparar. */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export interface Snippet {
  file: string;
  lang: string;
  code: string;
}

/** Extensión de fichero según el lenguaje del bloque de código. */
const LANG_EXT: Record<string, string> = {
  bash: "sh",
  sh: "sh",
  shell: "sh",
  python: "py",
  javascript: "js",
  js: "js",
  typescript: "ts",
  ts: "ts",
  nginx: "conf",
};

/** Parte un texto en líneas de como mucho `width` caracteres. */
function wrap(text: string, width: number): string[] {
  const lines: string[] = [];
  let current = "";
  for (const word of text.split(/\s+/).filter(Boolean)) {
    if (!current) {
      current = word;
    } else if (current.length + 1 + word.length <= width) {
      current += ` ${word}`;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Fragmento de código de un post, en este orden:
 *   1. el `snippet` del frontmatter;
 *   2. el primer bloque de código del cuerpo;
 *   3. un fragmento generado con la cabecera del post.
 * En los casos 2 y 3 se avisa por consola: el post debería traer el suyo.
 */
export function resolveSnippet(entry: CollectionEntry<"blog">): Snippet {
  if (entry.data.snippet) return entry.data.snippet;

  const slug = postSlug(entry);

  const block = entry.body?.match(/```([\w+-]*)\n([\s\S]*?)```/);
  if (block) {
    const lang = block[1] || "txt";
    const code = block[2]
      .split("\n")
      .filter((line) => line.trim() !== "")
      .slice(0, 5)
      .join("\n");
    console.warn(
      `${slug}: sin snippet propio, uso el primer bloque de código del post`
    );
    return { file: `${slug}.${LANG_EXT[lang] ?? "txt"}`, lang, code };
  }

  const description =
    "description" in entry.data ? (entry.data.description ?? "") : "";
  const code = [
    `$ head -4 ${slug}.md`,
    `# ${entry.data.title}`,
    ...wrap(description, 40).slice(0, 2),
  ].join("\n");
  console.warn(`${slug}: sin snippet propio, uso un fragmento generado`);
  return { file: `${slug}.md`, lang: "markdown", code };
}
