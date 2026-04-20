export const SITE_TITLE = "Hugo Perez-Vigo";
export const SITE_DESCRIPTION = "Blog personal sobre tecnologia, ciberseguridad y desarrollo web.";
export const TWITTER_HANDLE = "@hugopvigo";
export const MY_NAME = "Hugo Perez-Vigo";
export const SITE_LANG = "es";

const BASE_URL = new URL(import.meta.env.SITE);
export const SITE_URL = BASE_URL.origin;

export function formatDate(date: Date, locale = SITE_LANG) {
  return date.toLocaleDateString(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
