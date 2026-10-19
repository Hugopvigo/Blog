import slugify from "slugify";

/**
 * Id de un encabezado. Lo usan el render de Markdoc (el id del <hN>) y el
 * índice (el enlace): si cada uno lo calculara a su manera, el enlace del
 * índice no encontraría su encabezado.
 */
export function headingSlug(text: string): string {
  return slugify(text, { lower: true, strict: true, locale: "es" });
}
