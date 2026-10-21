import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import ShotFrame from "@/components/motion/ShotFrame";
import { featuredSlugs, getProject, t } from "@/content/projects";
import type { Dictionary, Locale } from "@/lib/i18n";

const host = (url: string) => new URL(url).host;

/** The first projects get a full-width row; the rest share a row in pairs. */
const LEAD = 3;

type Item = NonNullable<ReturnType<typeof getProject>>;

function Live({ p, dict }: { p: Item; dict: Dictionary }) {
  return (
    <p className="flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-xs uppercase tracking-[0.08em]">
      <span className="text-signal">{p.code}</span>
      {p.site && (
        <span className="flex items-center gap-2 text-night-text/70">
          <span className="inline-block size-1.5 rounded-full bg-live" aria-hidden="true" />
          {dict.featured.live} · {host(p.site)}
        </span>
      )}
    </p>
  );
}

function Stack({ p }: { p: Item }) {
  return (
    <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs text-night-text/60" aria-label="Stack">
      {p.stack.map((s) => (
        <li key={s}>{s}</li>
      ))}
    </ul>
  );
}

function Actions({ p, locale, dict }: { p: Item; locale: Locale; dict: Dictionary }) {
  return (
    <div className="mt-auto flex flex-wrap gap-3 pt-8">
      {p.site && (
        <a
          href={p.site}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-paper px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] text-ink transition-colors hover:bg-signal hover:text-paper"
        >
          {dict.featured.visit} <span aria-hidden="true">↗</span>
        </a>
      )}
      <Link
        href={`/${locale}/work/${p.slug}`}
        className="inline-flex items-center gap-2 border border-night-rule px-4 py-2.5 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-paper"
      >
        {dict.featured.details} <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}

export default function Featured({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = featuredSlugs.map((slug) => getProject(slug)!);

  return (
    <section className="bg-night py-[clamp(5rem,14vh,9rem)] text-night-text" aria-labelledby="featured-title">
      <div className="gutter grid gap-6 md:grid-cols-12">
        <p className="label !text-signal md:col-span-3">{dict.featured.label}</p>
        <div className="md:col-span-9">
          <h2 id="featured-title" className="display text-[clamp(2.5rem,6.5vw,6rem)] text-paper">
            {dict.featured.title}
          </h2>
          <p className="mt-5 max-w-[48ch] text-lg text-night-text/75">{dict.featured.intro}</p>
        </div>
      </div>

      <ol className="gutter mt-[clamp(3rem,9vh,6rem)]">
        {items.slice(0, LEAD).map((p) => (
          <li key={p.slug} className="grid gap-8 border-t border-night-rule py-10 md:grid-cols-12 md:gap-x-8 md:py-14">
            <Reveal className="flex flex-col md:col-span-5">
              <Live p={p} dict={dict} />
              <h3 className="display mt-5 text-[clamp(2rem,3.5vw,3.6rem)] text-paper [overflow-wrap:anywhere]">{p.title}</h3>
              <p className="mt-4 max-w-[38ch] text-lg leading-snug text-night-text/85">{t(p.tagline, locale)}</p>
              <Stack p={p} />
              <Actions p={p} locale={locale} dict={dict} />
            </Reveal>
            <Link href={`/${locale}/work/${p.slug}`} className="group block md:col-span-7" tabIndex={-1} aria-hidden="true">
              <ShotFrame shot={p.shots![0]} companions={p.shots!.slice(1, 3)} locale={locale} sizes="(min-width: 768px) 55vw, 100vw" />
            </Link>
          </li>
        ))}
      </ol>

      <ul className="gutter grid gap-x-8 md:grid-cols-2">
        {items.slice(LEAD).map((p) => (
          <li key={p.slug} className="flex flex-col border-t border-night-rule py-10 md:py-14">
            <Link href={`/${locale}/work/${p.slug}`} className="group block" tabIndex={-1} aria-hidden="true">
              <ShotFrame shot={p.shots![0]} companions={p.shots!.slice(1, 3)} locale={locale} sizes="(min-width: 768px) 45vw, 100vw" />
            </Link>
            <Reveal className="mt-8 flex flex-1 flex-col">
              <Live p={p} dict={dict} />
              <h3 className="display mt-4 text-[clamp(1.75rem,2.6vw,2.6rem)] text-paper [overflow-wrap:anywhere]">{p.title}</h3>
              <p className="mt-3 max-w-[38ch] text-lg leading-snug text-night-text/85">{t(p.tagline, locale)}</p>
              <Stack p={p} />
              <Actions p={p} locale={locale} dict={dict} />
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}
