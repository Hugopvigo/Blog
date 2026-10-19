import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";
import { getPublishedPosts, postSlug } from "../lib/content-utils";

// Solo la entradilla (decisión de Hugo): el post se lee en la web.
export async function GET() {
  const sortedPosts = await getPublishedPosts();
  const baseUrl = SITE_URL.replace(/\/+$/g, "");

  const rssItems = sortedPosts.map((entry) => {
    const { data: frontmatter } = entry;

    if (frontmatter.external) {
      return {
        title: frontmatter.title,
        pubDate: frontmatter.date,
        link: frontmatter.url,
      };
    }

    return {
      title: frontmatter.title,
      pubDate: frontmatter.date,
      description: frontmatter.description,
      link: `${baseUrl}/blog/${postSlug(entry)}`,
    };
  });

  const rssFeed = await rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: baseUrl,
    items: rssItems,
  });

  return new Response(rssFeed.body, {
    headers: { "Content-Type": "application/xml" },
  });
}
