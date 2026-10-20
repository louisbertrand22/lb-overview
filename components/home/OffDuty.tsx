import Reveal from "@/components/motion/Reveal";
import { hobbies, t } from "@/content/projects";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function OffDuty({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="gutter border-t rule py-[clamp(4rem,12vh,8rem)]" aria-labelledby="offduty-title">
      <div className="grid gap-6 md:grid-cols-12">
        <p className="label md:col-span-3">{dict.offDuty.label}</p>
        <h2 id="offduty-title" className="heading text-[clamp(1.75rem,3.4vw,3rem)] md:col-span-9">
          {dict.offDuty.title}
        </h2>
      </div>
      <ul className="mt-10 grid gap-px border rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {hobbies.map((h, i) => (
          <Reveal as="li" key={h.title.en} delay={i * 0.05} className="flex flex-col gap-3 bg-paper p-6">
            <h3 className="heading text-lg">{t(h.title, locale)}</h3>
            <p className="text-sm leading-relaxed text-ink-soft">{t(h.body, locale)}</p>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
