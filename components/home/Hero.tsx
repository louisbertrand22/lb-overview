import Link from "next/link";
import Reveal from "@/components/motion/Reveal";
import SystemMap from "./SystemMap";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function Hero({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="gutter pb-[clamp(4rem,10vh,7rem)] pt-24 md:pt-28">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b rule pb-4">
        <p className="label !text-ink">{dict.hero.kicker}</p>
        <p className="label flex items-center gap-2">
          <span className="relative inline-flex size-2" aria-hidden="true">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-signal opacity-60 motion-reduce:hidden" />
            <span className="relative inline-flex size-2 rounded-full bg-signal" />
          </span>
          {dict.hero.availability}
        </p>
      </div>

      <div className="mt-8 grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-8">
        <h1 className="display text-[12.6vw] sm:text-[clamp(3rem,9.6vw,8.75rem)] lg:col-span-8 lg:text-[clamp(4rem,8.2vw,9.5rem)]">
          Louis
          <br />
          Bertrand
        </h1>
        <Reveal className="flex flex-col gap-8 lg:col-span-4 lg:pb-2">
          <div>
            <p className="max-w-[26ch] text-[clamp(1.3rem,1.9vw,1.7rem)] font-medium leading-[1.22]">{dict.hero.statement}</p>
            <p className="mt-3 text-sm text-ink-soft">{dict.hero.location}</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/${locale}/work`}
              className="inline-flex items-center gap-3 bg-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] text-paper transition-colors hover:bg-signal"
            >
              {dict.hero.cta} <span aria-hidden="true">→</span>
            </Link>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center border border-ink px-5 py-3 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:border-signal hover:text-signal"
            >
              {dict.hero.contact}
            </Link>
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-12 lg:mt-16" delay={0.15}>
        <SystemMap
          locale={locale}
          labels={{
            title: dict.hero.mapTitle,
            hint: dict.hero.mapHint,
            dependency: dict.hero.dependency,
          }}
        />
      </Reveal>
    </section>
  );
}
