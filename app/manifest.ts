import type { MetadataRoute } from "next";
import { getDictionary, defaultLocale } from "@/lib/i18n";

export default function manifest(): MetadataRoute.Manifest {
  const dict = getDictionary(defaultLocale);
  return {
    name: dict.meta.title,
    short_name: "Louis Bertrand",
    description: dict.meta.description,
    start_url: "/",
    display: "browser",
    background_color: "#f2f1ec",
    theme_color: "#f2f1ec",
    lang: defaultLocale,
    icons: [
      { src: "/icon.png", sizes: "512x512", type: "image/png" },
      { src: "/apple-icon.png", sizes: "180x180", type: "image/png" },
    ],
  };
}
