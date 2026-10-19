/**
 * Mapa de tamaños de las imágenes de `public/images/`.
 *
 * Lo genera el plugin de Vite `image-sizes` de `astro.config.mjs`: mide cada
 * imagen con `sharp` en cada build y expone el resultado por este módulo
 * virtual. `Figure.astro` lo importa para poner `width`/`height` en el
 * `<img>` y que el navegador reserve el hueco (nada de saltos de layout).
 */
declare module "virtual:image-sizes" {
  const sizes: Record<string, { width: number; height: number }>;
  export default sizes;
}
