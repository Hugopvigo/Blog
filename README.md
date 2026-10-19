# 🚀 hugopvigo.es — Blog Personal

Blog personal de **Hugo Perez-Vigo** sobre tecnología, ciberseguridad y desarrollo web. Construido con Astro y desplegado en servidor propio.

🌐 **[hugopvigo.es](https://hugopvigo.es)**

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [Astro](https://astro.build) | ^7.x | Framework principal (SSG) |
| [Tailwind CSS](https://tailwindcss.com) | ^4.x | Estilos (tokens CSS + utilidades) |
| [Markdoc](https://markdoc.dev) | ^2.x | Contenido en markdown extendido |
| [TypeScript](https://www.typescriptlang.org) | ^7.x | Tipado estático |
| Fontsource | ^5.x | JetBrains Mono + IBM Plex Sans (self-hosted) |
| Apache | — | Servidor web |

---

## ✨ Características

- 🖥️ **Estética de terminal** — ventanas, prompts y monoespaciada en todo el sitio
- 🌗 **Modo oscuro y claro** — conmutador con persistencia en `localStorage`
- 🏷️ **Filtros y búsqueda** — por etiqueta y por texto, sin recarga
- ⚡ **Prefetch** — navegación instantánea entre páginas
- 🖼️ **Imágenes responsive** — layout constrained con responsive styles
- 📡 **RSS feed** — en `/rss.xml`
- 🗺️ **Sitemap** automático
- 🔒 **Seguridad** — iframes sandboxed, rel=noopener, canonical URLs, HSTS
- ♿ **Accesibilidad** — contraste AA comprobado con axe, navegación por teclado, `aria-pressed` en los filtros
- 🎯 **SEO** — meta tags, Open Graph, Twitter Card en todas las páginas
- 🔍 **Búsqueda sin acentos** — se normalizan mayúsculas y diacríticos

---

## 📁 Estructura del proyecto

```
/
├── plantillas/       # Plantilla de posts (post.mdoc)
├── public/
│   └── images/       # Imágenes estáticas
├── src/
│   ├── assets/
│   │   └── projects/ # Capturas de los proyectos (las pone Hugo)
│   ├── components/   # Componentes Astro (home/, terminal, filtros…)
│   ├── content/      # Colecciones: blog/ y projects/
│   ├── layouts/      # Layouts base
│   ├── lib/          # Utilidades de contenido
│   ├── pages/        # Rutas del blog
│   ├── scripts/      # Scripts del navegador (filtros)
│   └── styles/       # CSS global (tokens de la paleta)
├── astro.config.mjs
├── markdoc.config.mjs
└── deploy.sh
```

---

## 🚀 Desarrollo local

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo en localhost:3000
npm run dev

# Build de producción
npm run build

# Preview del build
npm run preview
```

---

## 🚢 Deploy

El deploy se hace en el servidor vía `deploy.sh`:

```bash
bash deploy.sh
```

El script hace:
1. `npm run build` — genera el sitio en `dist/`
2. `rsync` — sincroniza `dist/` con el DocumentRoot de Apache (`/var/www/html/dist`)
3. Ajusta permisos automáticamente

---

## ✍️ Escribir contenido

Los posts van en `src/content/blog/` y los proyectos en `src/content/projects/` en formato Markdoc.
La plantilla está en `plantillas/post.mdoc`.

**Frontmatter de un post:**

```md
---
external: false
title: "Título del post"
description: "Descripción breve"
date: 2025-01-01
tag: "IA" # obligatorio en los posts publicados
snippet: # el fragmento de código que se ve en la ventana
  file: "mi-snippet.sh"
  lang: "bash"
  code: |
    $ comando --que-hace-cosa
    # un guiño al tema del post
---

Contenido aquí...
```

**Frontmatter de un proyecto:**

```md
---
title: "Nombre del proyecto"
description: "Una frase"
date: 2025-01-01
type: "Web" # Web | App | Bot | Script
url: https://ejemplo.es
featured: false
---
```

**Componentes disponibles en Markdoc:**
- `YouTubeEmbed` — embed de YouTube sandboxed
- `GitHubGistEmbed` — embed de Gist con sanitización XSS
- `CodePenEmbed` — embed de CodePen
- `TweetEmbed` — embed de Twitter con soporte dark/light

---

## 🔐 Seguridad

- Iframes con atributo `sandbox` (YouTube, Gist, CodePen)
- `rel="noopener noreferrer"` en todos los `target="_blank"`
- HSTS habilitado en Apache (`max-age=31536000; includeSubDomains`)
- Canonical URLs en todas las páginas

---

## 📄 Licencia

**CC BY-NC-SA 4.0** — Compartir con atribución, sin uso comercial. Consulta [LICENSE](LICENSE) para más detalles.

---

<div align="center">

**Desarrollado por [Hugo Perez-Vigo](https://hugopvigo.es)** · [@hugopvigo](https://x.com/hugopvigo)

[![GitHub](https://img.shields.io/badge/GitHub-Hugopvigo-181717?style=for-the-badge&logo=github)](https://github.com/Hugopvigo)

</div>
