"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { getProject, systemMap, t } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

type Point = { x: number; y: number };
type Wire = { id: string; from: string; to: string; a: Point; b: Point; dependency?: string };

const curve = (a: Point, b: Point) => {
  const dx = (b.x - a.x) * 0.5;
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
};

type Labels = { title: string; hint: string; dependency: string };

/**
 * The positioning statement drawn as a system: business needs, architecture,
 * teams who deliver. Every block is a real project; red wires are real runtime dependencies.
 */
export default function SystemMap({ locale, labels }: { locale: Locale; labels: Labels }) {
  const reduce = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLAnchorElement>());
  const [wires, setWires] = useState<Wire[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [active, setActive] = useState<string | null>(null);

  const measure = useCallback(() => {
    const board = boardRef.current;
    if (!board) return;
    const origin = board.getBoundingClientRect();
    // Lanes sit side by side only on wide screens; the stacked layout has no wires.
    if (!window.matchMedia("(min-width: 1024px)").matches) {
      setWires([]);
      return;
    }
    const rect = (slug: string) => nodeRefs.current.get(slug)?.getBoundingClientRect();
    const right = (slug: string): Point => {
      const r = rect(slug)!;
      return { x: r.right - origin.left, y: r.top + r.height / 2 - origin.top };
    };
    const left = (slug: string): Point => {
      const r = rect(slug)!;
      return { x: r.left - origin.left, y: r.top + r.height / 2 - origin.top };
    };

    const next: Wire[] = [];
    const lanes = systemMap.lanes;
    for (let i = 0; i < lanes.length - 1; i++) {
      for (const from of lanes[i].nodes) {
        for (const to of lanes[i + 1].nodes) {
          next.push({ id: `${from}>${to}`, from, to, a: right(from), b: left(to) });
        }
      }
    }
    for (const e of systemMap.edges) {
      const id = `${e.from}>${e.to}`;
      const existing = next.find((w) => w.id === id);
      if (existing) existing.dependency = e.label;
      else next.push({ id, from: e.from, to: e.to, a: right(e.from), b: left(e.to), dependency: e.label });
    }
    setSize({ w: origin.width, h: origin.height });
    setWires(next);
  }, []);

  useLayoutEffect(() => {
    const board = boardRef.current;
    if (!board) return;
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(board);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => ro.disconnect();
  }, [measure]);

  const touches = (w: Wire) => active !== null && (w.from === active || w.to === active);
  const activeProject = active ? getProject(active) : null;
  const incoming = (slug: string) => systemMap.edges.filter((e) => e.to === slug);

  return (
    <div className="border rule bg-paper">
      <div className="flex items-center justify-between gap-4 border-b rule px-4 py-2.5">
        <span className="label !text-ink">{labels.title}</span>
        <span className="label flex items-center gap-2">
          <span className="inline-block h-0.5 w-5 bg-signal" aria-hidden="true" />
          {labels.dependency}
        </span>
      </div>

      <div ref={boardRef} className="blueprint relative p-4 md:p-6">
        {wires.length > 0 && (
          <svg
            className="pointer-events-none absolute inset-0"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            aria-hidden="true"
          >
            {wires.map((w, i) => {
              const lit = touches(w);
              const dim = active !== null && !lit;
              const stroke = w.dependency ? "var(--color-signal)" : "var(--color-ink)";
              return (
                <g key={w.id}>
                  <motion.path
                    d={curve(w.a, w.b)}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={w.dependency ? 2 : lit ? 1.5 : 1}
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: dim ? 0.08 : w.dependency || lit ? 1 : 0.22 }}
                    transition={{
                      pathLength: { duration: 1.1, delay: 0.5 + i * 0.03, ease: [0.16, 1, 0.3, 1] },
                      opacity: { duration: 0.3 },
                    }}
                  />
                </g>
              );
            })}
          </svg>
        )}

        <ol className="relative grid gap-6 lg:grid-cols-3 lg:gap-[clamp(3rem,7vw,7rem)]">
          {systemMap.lanes.map((lane, li) => (
            <li key={lane.id}>
              <p className="label mb-3 flex items-center gap-2">
                <span className="text-signal">{String(li + 1).padStart(2, "0")}</span>
                {t(lane.label, locale)}
              </p>
              <ul className="flex flex-col gap-3">
                {lane.nodes.map((slug) => {
                  const p = getProject(slug)!;
                  const deps = incoming(slug);
                  const on = active === slug;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/${locale}/work/${slug}`}
                        ref={(el) => {
                          if (el) nodeRefs.current.set(slug, el);
                          else nodeRefs.current.delete(slug);
                        }}
                        onPointerEnter={() => setActive(slug)}
                        onPointerLeave={() => setActive(null)}
                        onFocus={() => setActive(slug)}
                        onBlur={() => setActive(null)}
                        aria-describedby="system-map-caption"
                        className={`group block border px-3 py-2.5 transition-colors duration-300 ${
                          on ? "border-ink bg-ink text-paper" : "border-rule bg-paper hover:border-ink"
                        }`}
                      >
                        <span className={`block font-mono text-[0.6875rem] tracking-[0.08em] ${on ? "text-paper/70" : "text-signal"}`}>
                          {p.code}
                        </span>
                        <span className="heading mt-1 block text-[1.05rem]">{p.title}</span>
                        {deps.map((d) => (
                          <span key={d.from} className={`mt-1.5 block font-mono text-[0.625rem] uppercase tracking-[0.06em] ${on ? "text-paper/70" : "text-signal"}`}>
                            ← {getProject(d.from)!.code} · {d.label}
                          </span>
                        ))}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </li>
          ))}
        </ol>
      </div>

      <p
        id="system-map-caption"
        aria-live="polite"
        className="min-h-[3.25rem] border-t rule px-4 py-3 text-sm leading-snug text-ink-soft"
      >
        {activeProject ? (
          <>
            <span className="font-mono text-xs text-signal">{activeProject.code}</span>{" "}
            {t(activeProject.tagline, locale)}
          </>
        ) : (
          labels.hint
        )}
      </p>
    </div>
  );
}
