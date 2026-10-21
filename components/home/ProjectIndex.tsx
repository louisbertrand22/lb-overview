import Link from "next/link";
import { featuredSlugs, projects, t, worlds } from "@/content/projects";
import type { Dictionary, Locale } from "@/lib/i18n";

/** Compact register of the projects not already featured above: one block per world, one line per project. */
const featured: readonly string[] = featuredSlugs;
const others = projects.filter((p) => !featured.includes(p.slug));
const groups = worlds.map((world) => ({ world, items: others.filter((p) => p.world === world.id) })).filter((g) => g.items.length > 0);

export default function ProjectIndex({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <section className="py-[clamp(5rem,14vh,9rem)]" aria-labelledby="index-title">
      <div className="gutter grid gap-6 pb-12 md:grid-cols-12">
        <p className="label md:col-span-3">{dict.index.label}</p>
        <h2 id="index-title" className="display text-[clamp(2.5rem,6.5vw,6rem)] md:col-span-9">
          {dict.index.title}
        </h2>
      </div>

      <div className="gutter grid gap-x-10 gap-y-14 lg:grid-cols-3">
        {groups.map(({ world, items }, i) => {
          return (
            <div key={world.id}>
              <div className="border-b-2 border-ink pb-3">
                <h3 className="heading flex items-baseline gap-3 text-[clamp(1.25rem,1.8vw,1.6rem)] uppercase">
                  <span className="font-mono text-xs font-normal tracking-[0.08em] text-signal">{String(i + 1).padStart(2, "0")}</span>
                  {t(world.label, locale)}
                  <span className="ml-auto font-mono text-xs font-normal tracking-[0.08em] text-mute">{items.length}</span>
                </h3>
                <p className="mt-2 text-sm text-ink-soft max-md:hidden">{t(world.blurb, locale)}</p>
              </div>
              <ul>
                {items.map((p) => (
                  <li key={p.slug} className="border-b rule">
                    <Link
                      href={`/${locale}/work/${p.slug}`}
                      className="group -mx-2 grid grid-cols-[3.75rem_1fr_auto] items-baseline gap-x-4 px-2 py-3.5 md:py-4 transition-colors duration-300 hover:bg-ink hover:text-paper"
                    >
                      <span className="font-mono text-xs tracking-[0.08em] text-signal">{p.code}</span>
                      <span className="min-w-0">
                        <span className="heading block text-[clamp(1.1rem,1.5vw,1.35rem)] uppercase">{p.title}</span>
                        <span className="mt-1 line-clamp-2 text-sm text-ink-soft transition-colors duration-300 group-hover:text-paper/70 max-md:hidden">
                          {t(p.tagline, locale)}
                        </span>
                      </span>
                      <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>

      <div className="gutter mt-12 flex justify-end">
        <Link href={`/${locale}/work`} className="link-line py-1 font-mono text-xs uppercase tracking-[0.08em]">
          {dict.index.all} →
        </Link>
      </div>
    </section>
  );
}
