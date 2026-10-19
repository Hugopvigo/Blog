/**
 * Normaliza texto para buscar y comparar: minúsculas y sin diacríticos.
 * Vive solo aquí (sin dependencias de `astro:content`) para poder usarse
 * también desde los scripts del navegador.
 */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
