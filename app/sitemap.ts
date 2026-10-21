import type { MetadataRoute } from "next";
import { projects } from "@/content/projects";
import { locales } from "@/lib/i18n";
import { languageAlternates, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ["", "/work", ...projects.map((p) => `/work/${p.slug}`)];
  return paths.flatMap((path) =>
    locales.map((lang) => ({
      url: `${siteUrl}/${lang}${path}`,
      changeFrequency: "monthly" as const,
      priority: path === "" ? 1 : path === "/work" ? 0.8 : 0.6,
      alternates: {
        languages: Object.fromEntries(Object.entries(languageAlternates(path)).map(([l, p]) => [l, `${siteUrl}${p}`])),
      },
    })),
  );
}
