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
