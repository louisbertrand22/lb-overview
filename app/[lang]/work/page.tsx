import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { languageAlternates, ogLocale } from "@/lib/site";
import WorkGrid from "@/components/work/WorkGrid";
import Reveal from "@/components/motion/Reveal";

export async function generateMetadata({ params }: PageProps<"/[lang]/work">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = getDictionary(lang);
  return {
    title: dict.work.title,
    description: dict.work.intro,
    alternates: { canonical: `/${lang}/work`, languages: languageAlternates("/work") },
    openGraph: {
      type: "website",
      siteName: "Louis Bertrand",
      title: `${dict.work.title} · Louis Bertrand`,
      description: dict.work.intro,
      locale: ogLocale(lang),
      url: `/${lang}/work`,
    },
  };
}

export default async function WorkPage({ params }: PageProps<"/[lang]/work">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const dict = getDictionary(lang);

  return (
    <div className="gutter pb-[clamp(5rem,14vh,9rem)] pt-28 md:pt-36">
      <header className="grid gap-8 border-t-2 border-ink pb-10 pt-6 md:grid-cols-12">
        <h1 className="display text-[clamp(3.5rem,13vw,12rem)] md:col-span-8">{dict.work.title}</h1>
        <Reveal className="self-end md:col-span-4" delay={0.15}>
          <p className="max-w-[40ch] text-lg leading-snug text-ink-soft">{dict.work.intro}</p>
        </Reveal>
      </header>
      <WorkGrid locale={lang} />
    </div>
  );
}
