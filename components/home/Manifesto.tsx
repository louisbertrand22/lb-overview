import ScrollReveal from "@/components/react-bits/ScrollReveal/ScrollReveal";
import type { Dictionary } from "@/lib/i18n";

export default function Manifesto({ dict }: { dict: Dictionary }) {
  return (
    <section className="gutter grid gap-6 border-t rule py-[clamp(5rem,14vh,9rem)] md:grid-cols-12">
      <p className="label md:col-span-3">{dict.manifestoLabel}</p>
      <ScrollReveal
        baseOpacity={0.12}
        baseRotation={0}
        enableBlur={false}
        containerClassName="md:col-span-9 !my-0"
        textClassName="heading text-[clamp(1.75rem,3.6vw,3.4rem)] !leading-[1.12] text-ink"
        wordAnimationEnd="center center"
      >
        {dict.manifesto}
      </ScrollReveal>
    </section>
  );
}
