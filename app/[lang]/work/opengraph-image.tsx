import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { ogCard, ogSize } from "@/lib/og";

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Louis Bertrand · Projects";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const dict = getDictionary(hasLocale(lang) ? lang : "fr");
  return ogCard({ kicker: dict.hero.kicker, title: dict.work.title, subtitle: dict.work.intro, footer: `/${lang}/work` });
}
