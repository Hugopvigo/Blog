# 🚀 hugopvigo.es — Blog Personal

Blog personal de **Hugo Perez-Vigo** sobre tecnología, ciberseguridad y desarrollo web. Construido con Astro y desplegado en servidor propio.

🌐 **[hugopvigo.es](https://hugopvigo.es)**

---

## 🛠️ Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| [Astro](https://astro.build) | ^5.x | Framework principal (SSG) |
| [Tailwind CSS](https://tailwindcss.com) | ^3.x | Estilos |
| [Markdoc](https://markdoc.dev) | ^0.2 | Contenido en markdown extendido |
| [TypeScript](https://www.typescriptlang.org) | ^4.9 | Tipado estático |
| [Font Awesome](https://fontawesome.com) | 6 | Iconografía (bundle minimalista) |
| Apache | — | Servidor web |

---

## ✨ Características

- 🌙 **Dark mode** — toggle con persistencia en localStorage
- ⚡ **Prefetch** — navegación instantánea entre páginas
- 🖼️ **Imágenes responsive** — layout constrained con responsive styles
- 📡 **RSS feed** — en `/rss.xml`
- 🗺️ **Sitemap** automático
- 🔒 **Seguridad** — iframes sandboxed, rel=noopener, canonical URLs, HSTS
- ♿ **Accesibilidad** — aria-labels, navegación por teclado, Escape para cerrar menú
- 🎯 **SEO** — meta tags, Open Graph, Twitter Card en todas las páginas
- 💡 **Perfect Lighthouse score** — 100/100
- 📦 **FA optimizado** — bundle propio de 3 iconos vs 800KB del full CSS

---

## 📁 Estructura del proyecto

```
/
├── content/
│   ├── blog/          # Posts del blog (.md)
│   └── projects/      # Proyectos (.md)
├── public/
│   ├── fonts/         # Space Grotesk (self-hosted)
│   ├── fontawesome/   # FA bundle minimalista
│   └── images/        # Imágenes estáticas
├── src/
│   ├── components/    # Componentes Astro
│   ├── layouts/       # Layouts base
│   ├── lib/markdoc/   # Config Markdoc + schemas
│   ├── pages/         # Rutas del blog
│   └── styles/        # CSS global
├── astro.config.mjs
├── tailwind.config.cjs
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

Los posts van en `content/blog/` y los proyectos en `content/projects/` en formato Markdown.

**Frontmatter de un post:**

```md
---
external: false
title: "Título del post"
description: "Descripción breve"
date: 2025-01-01
---

Contenido aquí...
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

MIT © [Hugo Perez-Vigo](https://hugopvigo.es)
