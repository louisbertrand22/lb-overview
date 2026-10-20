import Reveal from "@/components/motion/Reveal";
import { experiences, t } from "@/content/projects";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function Path({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="gutter py-[clamp(5rem,14vh,9rem)]" aria-labelledby="path-title">
      <div className="grid gap-6 md:grid-cols-12">
        <p className="label md:col-span-3">{dict.path.label}</p>
        <h2 id="path-title" className="display text-[clamp(2.5rem,6.5vw,6rem)] md:col-span-9">
          {dict.path.title}
        </h2>
      </div>
      <ol className="mt-12 border-t-2 border-ink">
        {experiences.map((e, i) => (
          <Reveal as="li" key={e.company} delay={i * 0.06} className="grid gap-3 border-b rule py-8 md:grid-cols-12 md:gap-x-8">
            <p className="font-mono text-xs uppercase tracking-[0.08em] text-signal md:col-span-3">{t(e.period, locale)}</p>
            <div className="md:col-span-4">
              <h3 className="heading text-xl">{e.company}</h3>
              <p className="mt-1.5 text-sm text-ink-soft">{t(e.role, locale)}</p>
            </div>
            <p className="max-w-[62ch] leading-relaxed text-ink-soft md:col-span-5">{t(e.summary, locale)}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
