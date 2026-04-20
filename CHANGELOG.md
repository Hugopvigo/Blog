# CHANGELOG - Blog de Hugo Perez-Vigo

## 2026-04-20 - Sesion de optimizacion y nuevas funcionalidades

### Subida de imagenes
- Subidas `debian_2025.jpeg` (487 KB) e `ia.jfif` (131 KB) al servidor
- Movidas de `public/` a `public/images/` para coincidir con las rutas del codigo
- Corregida referencia en `AboutTheTheme.astro`: apuntaba a `debian_2025.webp` pero el archivo era `.jpeg`

### Optimizacion de imagenes (ImageMagick)
- Convertidas todas las imagenes de `public/images/` a WebP con compresion:

| Archivo | Original | WebP | Reduccion |
|---------|----------|------|-----------|
| debian_2025.jpeg | 487 KB | 108 KB | 78% |
| ia.jfif | 131 KB | 96 KB | 27% |
| blogster.png | 219 KB | 16 KB | 93% |
| og.png | 115 KB | 22 KB | 81% |

### Optimizacion automatica de imagenes (astro:assets)
- Copiadas imagenes fuente a `src/assets/images/` para que Astro las procese
- Migrado `AboutTheTheme.astro` de `<img>` a `<Picture />` de `astro:assets`
- `<Picture />` genera formato AVIF + WebP + JPG fallback con multiples tamanos
- Ejemplo de output: 476 KB original → 180 KB AVIF (1200w), 32 KB (320w)

### Responsive images automaticas
- Configurado `image.layout: "constrained"` en `astro.config.mjs`
- Activado `image.responsiveStyles: true` para CSS automatico de redimension
- Todas las imagenes procesadas por Astro generan `srcset` y `sizes` automaticos

### View Transitions
- Activado en `src/layouts/PageLayout.astro` via `<ViewTransitions />`
- Navegacion entre paginas sin recarga completa del navegador
- Transiciones suaves tipo SPA (Single Page Application)
- El navegador no vuelve a descargar CSS, JS ni fuentes al cambiar de pagina

### Prefetch
- Activado `prefetch: true` en `astro.config.mjs`
- Al hacer hover sobre un enlace, Astro precarga la pagina destino en segundo plano
- Resultado: navegacion practicamente instantanea al hacer click

### Deploy automatizado
- Creado script `deploy.sh` en `/home/ubuntu/web/hugopvigo/Blog/deploy.sh`
- Pasos: `npm run build` → `rsync --delete` a `/var/www/html/dist/` → permisos 775/664

### Actualizacion de dependencias
- `@astrojs/tailwind`: 2.1.3 → 6.0.2 (compatible con Astro 5)
- RSS endpoint (`rss.xml.ts`): arreglado para devolver `Response` (requerido en Astro 5)

### MDX - Intento revertido
- Se intento instalar `@astrojs/mdx` para usar `<Picture />` dentro de posts `.md`
- El sistema de Markdoc custom del blog no es compatible con MDX sin una migracion mayor
- MDX desinstalado, archivos `.mdx` eliminados, `read.ts` y config restaurados
- Las imagenes en posts `.md` siguen usando `public/images/` con WebP manual

---

### Estado final del proyecto

**astro.config.mjs:**
```js
export default defineConfig({
  prefetch: true,
  image: { layout: "constrained", responsiveStyles: true },
  integrations: [sitemap(), tailwind()],
});
```

**PageLayout.astro:** incluye `<ViewTransitions />`

**AboutTheTheme.astro:** usa `<Picture />` de `astro:assets` con formatos AVIF + WebP

**Imagenes optimizadas:** WebP en `public/images/` (para posts .md) + src/assets/ (para componentes .astro)
