import rss from "@astrojs/rss";
import { getCollection } from "astro:content";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";

export async function GET() {
  const posts = await getCollection("blog", ({ data }) => !data.draft);

  const sortedPosts = posts.sort(
    (a, b) =>
      new Date(b.data.date).valueOf() - new Date(a.data.date).valueOf()
  );

  let baseUrl = SITE_URL;
  baseUrl = baseUrl.replace(/\/+$/g, "");

  const rssItems = sortedPosts.map(({ data: frontmatter, id }) => {
    const slug = id.replace(/\.mdoc$/, "");

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
