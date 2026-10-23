import { hasLocale, locales } from "@/lib/i18n";
import { ogCard, ogSize } from "@/lib/og";
import { servicesCopy as copy } from "@/content/services";

export const generateStaticParams = () => locales.map((lang) => ({ lang }));

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Louis Bertrand · Services";

export default async function Image({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : "fr";
  return ogCard({ kicker: copy.kicker[locale], title: copy.title[locale], subtitle: copy.statement[locale], footer: `/${locale}/services` });
}
