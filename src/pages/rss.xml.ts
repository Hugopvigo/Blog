import rss from "@astrojs/rss";
import { render } from "astro:content";
import { experimental_AstroContainer } from "astro/container";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";
import { getPublishedPosts, postSlug } from "../lib/content-utils";

export async function GET() {
  const sortedPosts = await getPublishedPosts();

  let baseUrl = SITE_URL;
  baseUrl = baseUrl.replace(/\/+$/g, "");

  // Contenedor de Astro para renderizar el cuerpo de cada post a HTML
  // (contenido completo en el RSS, no solo la entradilla).
  const container = await experimental_AstroContainer.create();

  const rssItems = await Promise.all(
    sortedPosts.map(async (entry) => {
      const { data: frontmatter } = entry;
      const slug = postSlug(entry);

      if (frontmatter.external) {
        return {
          title: frontmatter.title,
          pubDate: frontmatter.date,
          link: frontmatter.url,
        };
      }

      const { Content } = await render(entry);
      let content = await container.renderToString(Content);

      // Los scripts de los componentes no pintan nada en un lector de RSS.
      content = content.replace(/<script\b[\s\S]*?<\/script>/gi, "");

      // Las rutas relativas tienen que ser absolutas para los lectores de RSS.
      content = content.replace(
        /(\s(?:src|href))="\/(?!\/)/g,
        `$1="${baseUrl}/`
      );

      return {
        title: frontmatter.title,
        pubDate: frontmatter.date,
        description: frontmatter.description,
        link: `${baseUrl}/blog/${slug}`,
        content,
      };
    })
  );

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
