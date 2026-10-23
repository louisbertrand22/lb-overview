import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { hasLocale } from "@/lib/i18n";
import { contactEmail, languageAlternates, ogLocale } from "@/lib/site";
import { getProject, t } from "@/content/projects";
import { method, services, servicesCopy as copy } from "@/content/services";
import Reveal from "@/components/motion/Reveal";
import { ServicesJsonLd } from "@/components/seo/JsonLd";

export async function generateMetadata({ params }: PageProps<"/[lang]/services">): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  return {
    title: t(copy.title, lang),
    description: t(copy.description, lang),
    alternates: { canonical: `/${lang}/services`, languages: languageAlternates("/services") },
    // The image comes from the colocated opengraph-image.tsx
    openGraph: {
      type: "website",
      siteName: "Louis Bertrand",
      title: `${t(copy.title, lang)} · Louis Bertrand`,
      description: t(copy.description, lang),
      locale: ogLocale(lang),
      url: `/${lang}/services`,
    },
  };
}

export default async function ServicesPage({ params }: PageProps<"/[lang]/services">) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const mailto = `mailto:${contactEmail}?subject=${encodeURIComponent(t(copy.emailSubject, lang))}`;

  return (
    <>
      <ServicesJsonLd locale={lang} />
      <div className="gutter pt-28 md:pt-36">
        <header className="border-t-2 border-ink pb-[clamp(3rem,9vh,6rem)] pt-6">
          <p className="label !text-signal">{t(copy.kicker, lang)}</p>
          <h1 className="display mt-4 text-[clamp(2.75rem,12vw,11rem)]">{t(copy.title, lang)}</h1>
          <Reveal className="mt-10 grid gap-6 md:grid-cols-12 md:gap-8" delay={0.15}>
            <p className="max-w-[30ch] text-[clamp(1.35rem,2.2vw,1.85rem)] font-medium leading-[1.2] md:col-span-6">{t(copy.statement, lang)}</p>
            <p className="max-w-[44ch] text-lg leading-snug text-ink-soft md:col-span-5 md:col-start-8">{t(copy.intro, lang)}</p>
          </Reveal>
        </header>

        <section aria-labelledby="offers-title">
          <h2 id="offers-title" className="sr-only">
            {t(copy.offersLabel, lang)}
          </h2>
          <ol>
            {services.map((s, i) => (
              <li key={s.id} className="grid gap-8 border-t-2 border-ink py-10 md:grid-cols-12 md:gap-x-8 md:py-14">
                <div className="md:col-span-3">
                  <p className="font-mono text-xs tracking-[0.08em] text-signal">{String(i + 1).padStart(2, "0")}</p>
                  <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-mute" aria-label="Stack">
                    {s.stack.map((tech) => (
                      <li key={tech}>{tech}</li>
                    ))}
                  </ul>
                </div>

                <Reveal className="md:col-span-5">
                  <h3 className="display text-[clamp(1.75rem,3vw,3rem)]">{t(s.title, lang)}</h3>
                  <p className="mt-5 max-w-[44ch] text-lg leading-snug text-ink-soft">{t(s.lead, lang)}</p>
                  <p className="label mt-8">{t(copy.includesLabel, lang)}</p>
                  <ul className="mt-3 border-t rule">
                    {t(s.includes, lang).map((item) => (
                      <li key={item} className="flex gap-3 border-b rule py-3 text-[0.9375rem]">
                        <span className="text-signal" aria-hidden="true">
                          ·
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </Reveal>

                <Reveal className="md:col-span-4" delay={0.1}>
                  <p className="label">{t(copy.proofLabel, lang)}</p>
                  <ul className="mt-3 flex flex-col gap-3">
                    {s.proofs.map((proof) => {
                      const project = getProject(proof.slug)!;
                      return (
                        <li key={proof.slug}>
                          <Link
                            href={`/${lang}/work/${proof.slug}`}
                            className="group flex h-full flex-col gap-2 border border-ink p-4 transition-colors duration-300 hover:bg-ink hover:text-paper"
                          >
                            <span className="flex items-baseline justify-between gap-4 font-mono text-xs uppercase tracking-[0.08em]">
                              <span className="text-signal">{project.code}</span>
                              <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                              </span>
                            </span>
                            <span className="heading text-xl uppercase">{project.title}</span>
                            <span className="text-sm leading-snug text-ink-soft transition-colors duration-300 group-hover:text-paper/70">
                              {t(proof.note, lang)}
                            </span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </Reveal>
              </li>
            ))}
          </ol>
        </section>

        <section className="border-t-2 border-ink py-[clamp(4rem,12vh,8rem)]" aria-labelledby="method-title">
          <div className="grid gap-6 md:grid-cols-12">
            <p className="label md:col-span-3">{t(copy.methodLabel, lang)}</p>
            <h2 id="method-title" className="display text-[clamp(2.25rem,5vw,4.5rem)] md:col-span-9">
              {t(copy.methodTitle, lang)}
            </h2>
          </div>
          <ol className="mt-12 grid border-l border-t rule sm:grid-cols-2 lg:grid-cols-4">
            {method.map((step, i) => (
              <Reveal as="li" key={step.name.en} delay={i * 0.06} className="border-b border-r rule p-5 md:p-6">
                <p className="font-mono text-xs tracking-[0.08em] text-signal">{String(i + 1).padStart(2, "0")}</p>
                <h3 className="heading mt-6 text-xl uppercase">{t(step.name, lang)}</h3>
                <p className="mt-3 text-sm leading-snug text-ink-soft">{t(step.detail, lang)}</p>
              </Reveal>
            ))}
          </ol>
        </section>
      </div>

      <section className="gutter bg-night py-[clamp(5rem,14vh,9rem)] text-night-text" aria-labelledby="quote-title">
        <div className="grid gap-10 md:grid-cols-12">
          <p className="label !text-signal md:col-span-3">{t(copy.quoteLabel, lang)}</p>
          <div className="md:col-span-9">
            <h2 id="quote-title" className="display max-w-[16ch] text-[clamp(2.5rem,6.5vw,6rem)] text-paper">
              {t(copy.quoteTitle, lang)}
            </h2>
            <Reveal>
              <p className="mt-8 max-w-[46ch] text-lg leading-snug text-night-text/80">{t(copy.quoteBody, lang)}</p>
              <div className="mt-10 flex flex-wrap gap-3">
                <a
                  href={mailto}
                  className="inline-flex items-center gap-2 bg-paper px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] text-ink transition-colors hover:bg-signal hover:text-paper"
                >
                  {t(copy.email, lang)} <span aria-hidden="true">↗</span>
                </a>
                <Link
                  href={`/${lang}/work`}
                  className="inline-flex items-center gap-2 border border-night-rule px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-paper"
                >
                  {t(copy.projects, lang)} <span aria-hidden="true">→</span>
                </Link>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
