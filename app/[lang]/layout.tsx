import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import "../globals.css";
import { fontVariables } from "../fonts";
import { getDictionary, hasLocale, locales } from "@/lib/i18n";
import { author, languageAlternates, ogLocale, siteUrl } from "@/lib/site";
import Nav from "@/components/chrome/Nav";
import Footer from "@/components/chrome/Footer";
import SmoothScroll from "@/components/chrome/SmoothScroll";

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  themeColor: "#f2f1ec",
  colorScheme: "light",
};

export async function generateMetadata({ params }: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    metadataBase: new URL(siteUrl),
    title: { default: dict.meta.title, template: `%s · Louis Bertrand` },
    description: dict.meta.description,
    applicationName: "Louis Bertrand",
    authors: [{ name: author.name, url: author.url }],
    creator: author.name,
    alternates: { canonical: `/${lang}`, languages: languageAlternates("") },
    openGraph: {
      type: "website",
      siteName: "Louis Bertrand",
      title: dict.meta.title,
      description: dict.meta.description,
      locale: ogLocale(lang),
      alternateLocale: locales.filter((l) => l !== lang).map(ogLocale),
      url: `/${lang}`,
    },
    twitter: { card: "summary_large_image", title: dict.meta.title, description: dict.meta.description },
  };
}

export default async function LangLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <html lang={lang} className={fontVariables}>
      <body id="top">
        <a
          href="#main"
          className="label fixed left-4 top-4 z-[200] -translate-y-24 bg-ink px-3 py-2 !text-paper focus:translate-y-0"
        >
          {dict.nav.skip}
        </a>
        <SmoothScroll />
        <Nav locale={lang} dict={dict} />
        <main id="main">{children}</main>
        <Footer dict={dict} />
      </body>
    </html>
  );
}
