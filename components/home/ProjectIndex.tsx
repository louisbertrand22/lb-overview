import Link from "next/link";
import FlowingMenu from "@/components/react-bits/FlowingMenu/FlowingMenu";
import { getWorld, projects, t } from "@/content/projects";
import type { Dictionary, Locale } from "@/lib/i18n";

export default function ProjectIndex({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const items = projects.map((p) => ({
    link: `/${locale}/work/${p.slug}`,
    text: p.title,
    image: p.shots?.[0]?.src,
    chip: p.stack.slice(0, 3).join(" · "),
    meta: t(getWorld(p.world).label, locale),
    index: p.code,
  }));

  return (
    <section className="py-[clamp(5rem,14vh,9rem)]" aria-labelledby="index-title">
      <div className="gutter grid gap-6 pb-10 md:grid-cols-12">
        <p className="label md:col-span-3">{dict.index.label}</p>
        <h2 id="index-title" className="display text-[clamp(2.5rem,6.5vw,6rem)] md:col-span-9">
          {dict.index.title}
        </h2>
      </div>
      <div className="gutter">
        <div className="grid grid-cols-[3.5rem_1fr] gap-x-4 border-t-2 border-ink pt-2 font-mono text-xs uppercase tracking-[0.08em] text-mute md:grid-cols-[6rem_1fr_minmax(0,16rem)]" aria-hidden="true">
          <span>{dict.index.code}</span>
          <span>{dict.index.name}</span>
          <span className="text-right max-md:hidden">{dict.index.world}</span>
        </div>
        <FlowingMenu
          items={items}
          speed={20}
          textColor="#0b1f33"
          marqueeBgColor="#0b1f33"
          marqueeTextColor="#f2f1ec"
          borderColor="#cfccc2"
        />
      </div>
      <div className="gutter mt-10 flex justify-end">
        <Link href={`/${locale}/work`} className="link-line py-1 font-mono text-xs uppercase tracking-[0.08em]">
          {dict.index.all} →
        </Link>
      </div>
    </section>
  );
}
