"use client";

import Link from "next/link";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { getProject, systemMap, t } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

type Point = { x: number; y: number };
type Wire = { id: string; from: string; to: string; a: Point; b: Point; kind: "auth" | "host" };

const curve = (a: Point, b: Point) => {
  const dx = (b.x - a.x) * 0.5;
  return `M ${a.x} ${a.y} C ${a.x + dx} ${a.y}, ${b.x - dx} ${b.y}, ${b.x} ${b.y}`;
};

type Labels = { title: string; hint: string; auth: string; host: string };

/**
 * What runs in production: the identity provider, the live products and the platforms
 * they sit on. Only real links are drawn: red for OIDC, ink for hosting and data.
 */
export default function SystemMap({ locale, labels }: { locale: Locale; labels: Labels }) {
  const reduce = useReducedMotion();
  const boardRef = useRef<HTMLDivElement>(null);
  const nodeRefs = useRef(new Map<string, HTMLElement>());
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

    const next: Wire[] = systemMap.edges.map((e) => ({
      id: `${e.from}>${e.to}`,
      from: e.from,
      to: e.to,
      a: right(e.from),
      b: left(e.to),
      kind: e.kind,
    }));
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
  const caption = active
    ? (systemMap.platforms[active]
        ? { code: systemMap.platforms[active].name, text: t(systemMap.platforms[active].role, locale) }
        : { code: getProject(active)!.code, text: t(getProject(active)!.tagline, locale) })
    : null;
  const incoming = (slug: string) => systemMap.edges.filter((e) => e.to === slug);
  const bind = (slug: string) => ({
    ref: (el: HTMLElement | null) => {
      if (el) nodeRefs.current.set(slug, el);
      else nodeRefs.current.delete(slug);
    },
    onPointerEnter: () => setActive(slug),
    onPointerLeave: () => setActive(null),
  });

  return (
    <div className="border rule bg-paper">
      <div className="flex items-center justify-between gap-4 border-b rule px-4 py-2.5">
        <span className="label !text-ink">{labels.title}</span>
        <span className="flex flex-wrap items-center justify-end gap-x-4 gap-y-1">
          <span className="label flex items-center gap-2">
            <span className="inline-block h-0.5 w-5 bg-signal" aria-hidden="true" />
            {labels.auth}
          </span>
          <span className="label flex items-center gap-2">
            <span className="inline-block h-px w-5 bg-ink" aria-hidden="true" />
            {labels.host}
          </span>
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
              const auth = w.kind === "auth";
              return (
                <g key={w.id}>
                  <motion.path
                    d={curve(w.a, w.b)}
                    fill="none"
                    stroke={auth ? "var(--color-signal)" : "var(--color-ink)"}
                    strokeWidth={auth ? 2 : lit ? 1.5 : 1}
                    initial={reduce ? false : { pathLength: 0 }}
                    animate={{ pathLength: 1, opacity: dim ? 0.08 : auth || lit ? 1 : 0.35 }}
                    transition={{
                      pathLength: { duration: 1.1, delay: 0.5 + i * 0.08, ease: [0.16, 1, 0.3, 1] },
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
            <li key={lane.id} className="flex flex-col">
              <p className="label mb-3 flex items-center gap-2">
                <span className="text-signal">{String(li + 1).padStart(2, "0")}</span>
                {t(lane.label, locale)}
              </p>
              <ul className="flex flex-1 flex-col justify-center gap-3">
                {lane.nodes.map((slug) => {
                  const on = active === slug;
                  const box = `block border px-3 py-2.5 transition-colors duration-300 ${
                    on ? "border-ink bg-ink text-paper" : "border-rule bg-paper hover:border-ink"
                  }`;
                  const meta = `mt-1.5 block font-mono text-[0.625rem] uppercase tracking-[0.06em] ${on ? "text-paper/70" : "text-ink-soft"}`;
                  const platform = systemMap.platforms[slug];
                  if (platform) {
                    const users = incoming(slug).map((e) => getProject(e.from)!.code);
                    return (
                      <li key={slug}>
                        <div {...bind(slug)} className={box}>
                          <span className={`block font-mono text-[0.6875rem] tracking-[0.08em] ${on ? "text-paper/70" : "text-ink-soft"}`}>
                            {platform.kind}
                          </span>
                          <span className="heading mt-1 block text-[1.05rem]">{platform.name}</span>
                          <span className={meta}>← {users.join(" · ")}</span>
                        </div>
                      </li>
                    );
                  }
                  const p = getProject(slug)!;
                  return (
                    <li key={slug}>
                      <Link
                        href={`/${locale}/work/${slug}`}
                        {...bind(slug)}
                        onFocus={() => setActive(slug)}
                        onBlur={() => setActive(null)}
                        aria-describedby="system-map-caption"
                        className={box}
                      >
                        <span className={`block font-mono text-[0.6875rem] tracking-[0.08em] ${on ? "text-paper/70" : "text-signal"}`}>
                          {p.code}
                        </span>
                        <span className="heading mt-1 block text-[1.05rem]">{p.title}</span>
                        {incoming(slug)
                          .filter((d) => d.kind === "auth")
                          .map((d) => (
                            <span key={d.from} className={`${meta} ${on ? "" : "!text-signal"}`}>
                              ← {getProject(d.from)!.code} · {d.label}
                            </span>
                          ))}
                        {systemMap.hostedOn[slug] && <span className={meta}>{systemMap.hostedOn[slug]}</span>}
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
        {caption ? (
          <>
            <span className="font-mono text-xs text-signal">{caption.code}</span> {caption.text}
          </>
        ) : (
          labels.hint
        )}
      </p>
    </div>
  );
}
