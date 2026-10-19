/* eslint-disable turbo/no-undeclared-env-vars */
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import markdoc from "@astrojs/markdoc";
import sharp from "sharp";
import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

/* 
  We are doing some URL mumbo jumbo here to tell Astro what the URL of your website will be.
  In local development, your SEO meta tags will have localhost URL.
  In built production websites, your SEO meta tags should have your website URL.
  So we give our website URL here and the template will know what URL to use 
  for meta tags during build.
  If you don't know your website URL yet, don't worry about this
  and leave it empty or use localhost URL. It won't break anything.
*/

const SERVER_PORT = 3000;
// the url to access your blog during local development
const LOCALHOST_URL = `http://localhost:${SERVER_PORT}`;
// the url to access your blog after deploying it somewhere (Eg. Netlify)
const LIVE_URL = "https://hugoperezvigo.es";
// this is the astro command your npm script runs
const SCRIPT = process.env.npm_lifecycle_script || "";
const isBuild = SCRIPT.includes("astro build");
let BASE_URL = LOCALHOST_URL;
// When you're building your site in local or in CI, you could just set your URL manually
if (isBuild) {
  BASE_URL = LIVE_URL;
}

/*
  Las imágenes de los posts viven en `public/images/`, así que `astro:assets`
  no las procesa y no puede ponerles `width`/`height`. Para que el navegador
  reserve el hueco de la imagen (y el texto de debajo no salte) hace falta
  saber su tamaño real.

  Este plugin mide todas las imágenes de `public/images/` con sharp y expone
  un mapa `{ "/images/fichero.jpg": { width, height } }` por un módulo
  virtual. El mapa se calcula en cada build, así que no se queda obsoleto.
*/
const IMAGES_DIR = fileURLToPath(new URL("./public/images/", import.meta.url));
const IMAGE_SIZES_ID = "virtual:image-sizes";
const RESOLVED_IMAGE_SIZES_ID = "\0" + IMAGE_SIZES_ID;

function imageSizesPlugin() {
  return {
    name: "image-sizes",
    resolveId(id) {
      if (id === IMAGE_SIZES_ID) return RESOLVED_IMAGE_SIZES_ID;
      return undefined;
    },
    async load(id) {
      if (id !== RESOLVED_IMAGE_SIZES_ID) return undefined;

      const sizes = {};
      let files = [];
      try {
        files = await readdir(IMAGES_DIR);
      } catch {
        // Sin `public/images/` no hay nada que medir.
        files = [];
      }

      for (const file of files.sort()) {
        if (!/\.(jpe?g|png|webp|avif|gif)$/i.test(file)) continue;
        try {
          const { width, height } = await sharp(
            join(IMAGES_DIR, file)
          ).metadata();
          if (!width || !height) continue;
          sizes[`/images/${file}`] = { width, height };
        } catch {
          // Imagen ilegible: se queda sin medidas (no rompe el build).
        }
      }
      return `export default ${JSON.stringify(sizes)};`;
    },
  };
}

export default defineConfig({
  prefetch: false,
  server: { port: SERVER_PORT },
  site: BASE_URL,
  image: {
    layout: "constrained",
    responsiveStyles: true,
  },
  integrations: [
    markdoc(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss(), imageSizesPlugin()],
  },
});
