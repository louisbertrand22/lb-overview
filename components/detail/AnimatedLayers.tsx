"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "motion/react";
import type { Anchor, Architecture } from "@/content/architecture/types";
import type { Locale } from "@/lib/i18n";
import { FlowControls, PACKET_MS, stepDurations, useFlowPlayer, type Flow, type FlowLabels } from "./FlowControls";

type Rect = { x: number; y: number; w: number; h: number };

const nodeKey = (a: Anchor) => ("item" in a ? `item:${a.item}` : "layer" in a ? `layer:${a.layer}` : `service:${a.service}`);

/**
 * Connector between two blocks.
 * Side by side: a straight line between the facing edges. Otherwise an S-curve from the nearer edge of one
 * box to the nearer edge of the other.
 */
function route(a: Rect, b: Rect): string {
  const overlapsRow = a.y < b.y + b.h && b.y < a.y + a.h;
  if (overlapsRow) {
    const rightward = a.x < b.x;
    const x1 = rightward ? a.x + a.w : a.x;
    const x2 = rightward ? b.x : b.x + b.w;
    return `M${x1} ${a.y + a.h / 2} L${x2} ${b.y + b.h / 2}`;
  }
  const down = b.y > a.y;
  const x1 = a.x + a.w / 2;
  const x2 = b.x + b.w / 2;
  const y1 = down ? a.y + a.h : a.y;
  const y2 = down ? b.y : b.y + b.h;
  const mid = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${mid} ${x2} ${mid} ${x2} ${y2}`;
}

type Layer = Architecture["layers"][number];

/**
 * "Who talks to whom": the layered system diagram. When the flow comes with anchors, it plays the same steps as
 * the sequence diagram: the two blocks involved light up and a packet runs along a line between them, while
 * the connections already used stay as a faint trail behind the boxes. Without anchors it is the plain, static diagram.
 */
export default function AnimatedLayers({
  layers,
  services,
  rail,
  flow,
  locale,
  labels,
  texts,
}: {
  layers: Layer[];
  services?: Architecture["services"];
  rail?: Architecture["rail"];
  flow?: Flow;
  locale: Locale;
  labels: FlowLabels;
  texts: { direct: string; services: string };
}) {
  const anchors = flow?.anchors;
  const animated = Boolean(flow && anchors);
  const durations = useMemo(() => (flow ? stepDurations(flow, locale) : [1700]), [flow, locale]);
  const player = useFlowPlayer(durations);
  const { root, reduce, active, follow } = player;
  const box = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const [rects, setRects] = useState<Record<string, Rect>>({});
  const [size, setSize] = useState({ w: 0, h: 0 });

  // Measures the blocks the flow talks about, relative to the diagram, and again whenever it resizes
  useEffect(() => {
    const el = box.current;
    if (!el || !anchors) return;
    const measure = () => {
      const origin = el.getBoundingClientRect();
      const next: Record<string, Rect> = {};
      for (const a of anchors) {
        const key = nodeKey(a);
        const node = [...el.querySelectorAll<HTMLElement>("[data-node]")].find((n) => n.dataset.node === key);
        if (!node) continue;
        const r = node.getBoundingClientRect();
        next[key] = { x: r.left - origin.left, y: r.top - origin.top, w: r.width, h: r.height };
      }
      setRects(next);
      setSize({ w: origin.width, h: origin.height });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    document.fonts?.ready.then(measure);
    return () => ro.disconnect();
  }, [anchors]);

  // The caption names the blocks of this diagram, which is not always what the sequence diagram calls its actors
  const names = useMemo(
    () =>
      (anchors ?? []).map((a) =>
        "item" in a ? a.item : "service" in a ? a.service : (layers.find((l) => l.id === a.layer)?.label[locale] ?? a.layer),
      ),
    [anchors, layers, locale],
  );

  const step = flow && active >= 0 ? flow.steps[active] : null;
  const from = step && anchors ? nodeKey(anchors[step.from]) : null;
  const to = step && anchors ? nodeKey(anchors[step.to]) : null;
  const lit = (key: string) => key === from || key === to;

  // When the visitor drives the diagram, keep the block the packet is heading to on screen
  useEffect(() => {
    if (!to) return;
    follow([...(box.current?.querySelectorAll<HTMLElement>("[data-node]") ?? [])].find((n) => n.dataset.node === to));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  // Faint trail: every distinct connection already used, then the current one in front
  const trail: { id: string; d: string }[] = [];
  let activeD: string | null = null;
  if (flow && anchors && active >= 0) {
    const seen = new Set<string>();
    flow.steps.slice(0, active + 1).forEach((s, i) => {
      const a = nodeKey(anchors[s.from]);
      const b = nodeKey(anchors[s.to]);
      const ra = rects[a];
      const rb = rects[b];
      if (a === b || !ra || !rb) return;
      const d = route(ra, rb);
      if (i === active) activeD = d;
      const pair = [a, b].sort().join("|");
      if (i < active && !seen.has(pair)) {
        seen.add(pair);
        trail.push({ id: pair, d });
      }
    });
  }

  // The packet follows the active line, with the same easing as the line being drawn
  useEffect(() => {
    const path = pathRef.current;
    const dot = dotRef.current;
    if (!path || !dot || reduce || !activeD) return;
    const length = path.getTotalLength();
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / PACKET_MS);
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      const p = path.getPointAtLength(length * eased);
      dot.setAttribute("cx", String(p.x));
      dot.setAttribute("cy", String(p.y));
      dot.style.opacity = "1";
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, activeD, reduce]);

  const itemCols = (count: number) => (count === 2 ? "sm:grid-cols-2" : count === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-3");

  return (
    <figure ref={root} className="border border-ink">
      {animated && flow && <FlowControls flow={flow} locale={locale} labels={labels} player={player} names={names} title={flow.title[locale]} />}
      <div ref={box} className={`blueprint relative isolate grid gap-6 p-4 md:p-6 ${services ? "lg:grid-cols-[1fr_16rem]" : ""}`}>
        {animated && size.w > 0 && (
          <>
            {/* Connections already used: behind the boxes, as a faint trail */}
            <svg className="pointer-events-none absolute inset-0 z-0 hidden md:block" width={size.w} height={size.h} aria-hidden="true">
              {trail.map((t) => (
                <path key={t.id} d={t.d} fill="none" className="stroke-ink/25" strokeWidth={1} strokeDasharray="3 4" />
              ))}
            </svg>
            {/* The current exchange: in front, with a paper halo so it stays readable over text */}
            <svg className="pointer-events-none absolute inset-0 z-30 hidden md:block" width={size.w} height={size.h} aria-hidden="true">
              {activeD && (
                <>
                  <path d={activeD} fill="none" className="stroke-paper" strokeWidth={6} strokeLinecap="round" />
                  <motion.path
                    key={`line-${active}`}
                    ref={pathRef}
                    d={activeD}
                    fill="none"
                    className="stroke-signal"
                    strokeWidth={2}
                    strokeLinecap="round"
                    initial={{ pathLength: reduce ? 1 : 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: PACKET_MS / 1000, ease: [0.45, 0, 0.25, 1] }}
                  />
                  {!reduce && <circle key={`dot-${active}`} ref={dotRef} r={5} className="fill-signal stroke-paper" strokeWidth={2} style={{ opacity: 0 }} />}
                </>
              )}
            </svg>
          </>
        )}

        <div className={`relative ${rail ? "lg:pl-12" : ""}`}>
          {rail && (
            <div className="absolute bottom-10 left-3 top-10 hidden w-0.5 bg-signal lg:block" aria-hidden="true">
              <span className="absolute -left-[3px] top-0 size-2 rounded-full bg-signal" />
              <span className="absolute -left-[3px] bottom-0 size-2 rounded-full bg-signal" />
              <span className="absolute left-2 top-1/2 -translate-y-1/2 rotate-180 whitespace-nowrap bg-paper px-1 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-signal [writing-mode:vertical-rl]">
                {texts.direct} · {rail.label}
              </span>
            </div>
          )}
          <ol className="flex flex-col">
            {layers.map((layer) => (
              <li key={layer.id}>
                <div className="grid gap-3 md:grid-cols-[9rem_1fr] md:items-stretch">
                  <p className="flex flex-col justify-center font-mono text-xs uppercase tracking-[0.08em] text-ink">{layer.label[locale]}</p>
                  <ul
                    data-node={`layer:${layer.id}`}
                    className={`relative z-10 grid gap-2 transition-[background-color,box-shadow] duration-300 ${itemCols(layer.items.length)} ${
                      layer.host === "server" ? "border border-dashed border-ink/40 p-2" : ""
                    } ${lit(`layer:${layer.id}`) ? "bg-signal/10 ring-2 ring-signal" : ""}`}
                  >
                    {layer.items.map((item) => (
                      <li
                        key={item.name}
                        data-node={`item:${item.name}`}
                        className={`relative z-10 border bg-paper px-3 py-2.5 transition-[border-color,box-shadow] duration-300 ${
                          lit(`item:${item.name}`) ? "border-signal shadow-[0_0_0_2px_var(--color-signal)]" : "border-ink"
                        }`}
                      >
                        <p className="text-sm font-semibold">{item.name}</p>
                        <p className="mt-1 text-xs leading-snug text-ink-soft">{item.detail[locale]}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                {layer.link && (
                  <p className="flex items-center gap-2 py-2.5 font-mono text-[0.6875rem] text-mute md:pl-[9.75rem]">
                    <span className="text-ink" aria-hidden="true">
                      ↓
                    </span>
                    {layer.link[locale]}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>

        {services && (
          <div className="border-t border-ink pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.08em] text-ink">{texts.services}</p>
            <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
              {services.map((s) => (
                <li
                  key={s.name}
                  data-node={`service:${s.name}`}
                  className={`relative z-10 border bg-paper px-3 py-2 transition-[border-color,box-shadow] duration-300 ${
                    lit(`service:${s.name}`) ? "border-signal shadow-[0_0_0_2px_var(--color-signal)]" : "border-rule"
                  }`}
                >
                  <p className="text-sm font-semibold">{s.name}</p>
                  <p className="mt-0.5 text-xs text-ink-soft">{s.detail[locale]}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {rail && (
        <figcaption className="flex items-start gap-3 border-t border-ink px-4 py-3 text-sm text-ink-soft">
          <span className="mt-2 inline-block h-0.5 w-5 shrink-0 bg-signal" aria-hidden="true" />
          {rail.caption[locale]}
        </figcaption>
      )}
    </figure>
  );
}
