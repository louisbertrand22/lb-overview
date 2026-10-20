"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import Cover from "./Cover";
import { projects, worlds, type Project, type WorldId } from "@/content/projects";
import { getDictionary, type Locale } from "@/lib/i18n";

/** Desktop captures earn a wide cell; everything else takes one column. */
const isWide = (p: Project) => Boolean(p.shots?.[0] && p.shots[0].device !== "phone");

export default function WorkGrid({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const [world, setWorld] = useState<WorldId | "all">("all");
  const reduce = useReducedMotion();
  const visible = world === "all" ? projects : projects.filter((p) => p.world === world);
  const filters: { id: WorldId | "all"; label: string; count: number }[] = [
    { id: "all", label: dict.work.all, count: projects.length },
    ...worlds.map((w) => ({ id: w.id, label: w.label[locale], count: projects.filter((p) => p.world === w.id).length })),
  ];

  return (
    <LayoutGroup>
      <div
        role="group"
        aria-label={dict.work.filterLabel}
        className="sticky top-16 z-40 -mx-[clamp(1rem,4vw,3.5rem)] flex gap-2 overflow-x-auto border-b rule bg-paper/90 px-[clamp(1rem,4vw,3.5rem)] py-3 backdrop-blur-md [scrollbar-width:none]"
      >
        {filters.map((f) => {
          const active = world === f.id;
          return (
            <button
              key={f.id}
              type="button"
              aria-pressed={active}
              onClick={() => setWorld(f.id)}
              className={`relative shrink-0 border px-3.5 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors duration-300 ${
                active ? "border-ink text-paper" : "border-rule text-ink-soft hover:border-ink hover:text-ink"
              }`}
            >
              {active && (
                <motion.span
                  layoutId="filter-fill"
                  className="absolute inset-0 bg-ink"
                  transition={{ type: "spring", stiffness: 420, damping: 36 }}
                />
              )}
              <span className="relative">
                {f.label} <span className={active ? "text-signal" : "text-mute"}>{f.count}</span>
              </span>
            </button>
          );
        })}
      </div>

      <p className="label mt-6" aria-live="polite">
        {dict.work.count(visible.length)}
      </p>

      <motion.ul layout className="mt-6 grid grid-flow-dense grid-cols-1 border-l border-t rule md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout" initial={false}>
          {visible.map((p, i) => {
            const shot = p.shots?.[0];
            const wide = isWide(p);
            const worldLabel = worlds.find((w) => w.id === p.world)!.label[locale];
            return (
              <motion.li
                key={p.slug}
                layout={!reduce}
                initial={reduce ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reduce ? undefined : { opacity: 0 }}
                transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                className={`border-b border-r rule bg-paper ${wide ? "md:col-span-2" : ""}`}
              >
                <Link href={`/${locale}/work/${p.slug}`} className="group flex h-full flex-col p-4 transition-colors hover:bg-paper-2 md:p-5">
                  <div className="flex items-baseline justify-between gap-4 font-mono text-xs uppercase tracking-[0.08em]">
                    <span className="text-signal">{p.code}</span>
                    <span className="text-mute">{worldLabel}</span>
                  </div>
                  <div className="relative mt-4 aspect-[16/10] overflow-hidden border rule">
                    {shot && shot.device === "phone" ? (
                      <div className="blueprint grid h-full place-items-center bg-paper-2">
                        <div className="relative h-[86%] overflow-hidden rounded-[1.2rem] border-[5px] border-ink" style={{ aspectRatio: `${shot.width} / ${shot.height}` }}>
                          <Image src={shot.src} alt={shot.alt[locale]} fill sizes="20vw" className="object-cover object-top" />
                        </div>
                      </div>
                    ) : shot ? (
                      <Image
                        src={shot.src}
                        alt={shot.alt[locale]}
                        fill
                        sizes="(min-width: 1024px) 66vw, (min-width: 768px) 100vw, 100vw"
                        loading={i === 0 ? "eager" : undefined}
                        className="object-cover object-[left_top] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.03]"
                      />
                    ) : (
                      <Cover project={p} worldLabel={worldLabel} className="absolute inset-0" />
                    )}
                  </div>
                  <h2 className="heading mt-5 text-[clamp(1.4rem,2.2vw,2rem)] uppercase [font-stretch:125%]">{p.title}</h2>
                  <p className="mt-2 max-w-[52ch] text-sm leading-snug text-ink-soft">{p.tagline[locale]}</p>
                  <p className="mt-auto flex items-center justify-between pt-5 font-mono text-xs text-mute">
                    <span>{p.stack.slice(0, 3).join(" · ")}</span>
                    <span className="text-ink transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">→</span>
                  </p>
                </Link>
              </motion.li>
            );
          })}
        </AnimatePresence>
      </motion.ul>
    </LayoutGroup>
  );
}
