import rss from "@astrojs/rss";
import { render } from "astro:content";
import { experimental_AstroContainer } from "astro/container";
import { SITE_TITLE, SITE_DESCRIPTION, SITE_URL } from "../config";
import { getPublishedPosts, postSlug } from "../lib/content-utils";

/**
 * Quita del HTML un elemento (con todo lo que lleva dentro) cuya clase
 * incluye `className`. Cuenta las aperturas y los cierres anidados del mismo
 * elemento, así que no se rompe con el HTML que generan los componentes.
 */
function stripElement(html: string, className: string): string {
  let out = html;

  for (;;) {
    const open = new RegExp(
      `<([a-z][a-z0-9]*)\\b[^>]*\\bclass="[^"]*\\b${className}\\b[^"]*"[^>]*>`,
      "i"
    );
    const match = open.exec(out);
    if (!match) return out;

    const tag = match[1];
    const start = match.index;
    const innerStart = start + match[0].length;

    // Elemento vacío: solo se quita la etiqueta.
    if (match[0].endsWith("/>")) {
      out = out.slice(0, start) + out.slice(innerStart);
      continue;
    }

    // Se busca el cierre que le corresponde contando el anidamiento.
    const scan = new RegExp(`<(/?)${tag}\\b[^>]*>`, "gi");
    scan.lastIndex = innerStart;
    let depth = 1;
    let end = -1;

    for (let step = scan.exec(out); step; step = scan.exec(out)) {
      if (step[1] === "/") {
        depth--;
        if (depth === 0) {
          end = step.index + step[0].length;
          break;
        }
      } else if (!step[0].endsWith("/>")) {
        depth++;
      }
    }

    // Sin cierre no se toca nada: mejor dejar el HTML como estaba.
    if (end === -1) return out;

    out = out.slice(0, start) + out.slice(end);
  }
}

/**
 * El feed lleva el artículo, no la web: se quita el cromado de los
 * componentes (la barra de la ventana con su semáforo y su nombre de
 * fichero, el botón de copiar y el prefijo «##» de los encabezados) y los
 * atributos `data-astro-cid-*` que Astro usa para sus estilos con ámbito.
 */
function cleanForFeed(html: string): string {
  let out = html;

  // Barras de las ventanas de terminal (código) y de las figuras.
  out = stripElement(out, "term-window__bar");
  out = stripElement(out, "term-figure__bar");

  // Botón de copiar de los bloques de código.
  out = stripElement(out, "term-window__copy");

  // Prefijo «## » / «### » de los encabezados.
  out = stripElement(out, "post-heading__prefix");

  // Atributos de estilo con ámbito de Astro (con valor o sin él).
  out = out.replace(/\sdata-astro-cid-[\w-]+(="[^"]*")?/gi, "");

  return out;
}

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

      // Fuera el cromado de la web: en el feed solo queda el artículo.
      content = cleanForFeed(content);

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
