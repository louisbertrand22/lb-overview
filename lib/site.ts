import { locales, type Locale } from "./i18n";

/**
 * Canonical origin. SITE_URL wins (any host), then the production domain Vercel exposes at build time.
 */
export const siteUrl = process.env.SITE_URL
  ? process.env.SITE_URL.replace(/\/$/, "")
  : process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000";

/** Shown on the page for people to write to; deliberately kept out of structured data */
export const contactEmail = "louisbert91@gmail.com";

export const author = {
  name: "Louis Bertrand",
  url: "https://louis-bertrand.fr",
  sameAs: ["https://louis-bertrand.fr", "https://github.com/louisbertrand22", "https://www.linkedin.com/in/louis-bertrand222"],
};

/** hreflang map for a locale-less path ("" for home); x-default is the root, which redirects by Accept-Language */
export function languageAlternates(path: string) {
  return {
    ...Object.fromEntries(locales.map((l) => [l, `/${l}${path}`])),
    "x-default": path || "/",
  } as Record<Locale | "x-default", string>;
}

export const ogLocale = (lang: Locale) => (lang === "fr" ? "fr_FR" : "en_US");
