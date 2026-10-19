import rss from "@astrojs/rss";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";
import { getPublishedPosts, postSlug } from "../lib/content-utils";

export async function GET() {
  const sortedPosts = await getPublishedPosts();

  let baseUrl = SITE_URL;
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssItems = sortedPosts.map((entry) => {
    const { data: frontmatter } = entry;
    const slug = postSlug(entry);

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
      link: `${baseUrl}/blog/${slug}`,
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
