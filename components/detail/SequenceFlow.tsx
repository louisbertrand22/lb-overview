"use client";

import { motion } from "motion/react";
import type { Locale } from "@/lib/i18n";
import { useMemo } from "react";
import { useEffect } from "react";
import { FlowControls, PACKET_MS, pad, stepDurations, useFlowPlayer, type Flow, type FlowLabels } from "./FlowControls";

/**
 * Sequence diagram that plays itself: each step lights up in turn, a packet travels along its arrow, and the
 * two actors involved are highlighted. Steps are the same data as the static diagram, so nothing is redrawn by hand.
 * Without motion (reduced-motion preference) nothing autoplays and there is no packet; the step buttons still work.
 * Wide screens get lifelines and arrows, small screens a numbered list.
 */
export default function SequenceFlow({ flow, locale, labels }: { flow: Flow; locale: Locale; labels: FlowLabels }) {
  const durations = useMemo(() => stepDurations(flow, locale), [flow, locale]);
  const player = useFlowPlayer(durations);
  const { root, reduce, active, follow } = player;

  // When the visitor drives the diagram, keep the current step on screen
  useEffect(() => {
    if (active < 0) return;
    const rows = [...(root.current?.querySelectorAll<HTMLElement>(`[data-step="${active}"]`) ?? [])];
    follow(rows.find((r) => r.offsetParent !== null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  const steps = flow.steps;
  const current = active >= 0 ? steps[active] : null;
  const grid = { gridTemplateColumns: `2.25rem repeat(${flow.actors.length}, minmax(0, 1fr))` };
  const stateOf = (i: number) => (active < 0 ? "idle" : i === active ? "on" : i < active ? "done" : "todo");

  return (
    <div ref={root} className="border border-ink">
      <FlowControls flow={flow} locale={locale} labels={labels} player={player} />

      <div className="relative hidden p-6 md:block">
        <div className="pointer-events-none absolute inset-x-6 bottom-6 top-6 grid" style={grid} aria-hidden="true">
          <span />
          {flow.actors.map((a) => (
            <span key={a} className="mx-auto h-full w-px border-l border-dashed border-ink/30" />
          ))}
        </div>
        <div className="relative grid" style={grid}>
          {flow.actors.map((a, i) => {
            const lit = current !== null && (current.from === i || current.to === i);
            return (
              <span
                key={a}
                className={`mx-1 mb-3 border px-2 py-2 text-center font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-paper transition-colors duration-300 ${
                  lit ? "border-signal bg-signal" : "border-ink bg-ink"
                }`}
                style={{ gridRow: 1, gridColumn: i + 2 }}
              >
                {a}
              </span>
            );
          })}
          {steps.map((s, i) => {
            const lo = Math.min(s.from, s.to);
            const span = Math.abs(s.to - s.from) + 1;
            const inset = `calc(100% / ${span * 2})`;
            const rightward = s.to > s.from;
            const row = i + 2;
            const state = stateOf(i);
            const on = state === "on";
            return [
              <span
                key={`n${i}`}
                className={`self-end pb-0.5 font-mono text-[0.6875rem] text-signal transition-opacity duration-300 ${on ? "font-bold" : ""} ${state === "todo" ? "opacity-40" : ""}`}
                style={{ gridRow: row, gridColumn: 1 }}
              >
                {pad(i + 1)}
              </span>,
              <div
                key={`a${i}`}
                data-step={i}
                className={`relative h-11 transition-opacity duration-300 ${state === "todo" ? "opacity-40" : ""}`}
                style={{ gridRow: row, gridColumn: `${lo + 2} / span ${span}` }}
              >
                <div className="absolute bottom-1.5" style={{ left: inset, right: inset }}>
                  <p
                    className={`mb-1 truncate px-2 text-center text-xs transition-colors duration-300 ${on ? "font-medium text-signal" : "text-ink"}`}
                    title={s.label[locale]}
                  >
                    {s.label[locale]}
                  </p>
                  <div className={`relative h-px transition-colors duration-300 ${on ? "bg-signal" : "bg-ink"}`}>
                    <span
                      className={`absolute -top-[4px] size-0 border-y-[4.5px] border-y-transparent ${
                        rightward
                          ? `right-0 border-l-[7px] ${on ? "border-l-signal" : "border-l-ink"}`
                          : `left-0 border-r-[7px] ${on ? "border-r-signal" : "border-r-ink"}`
                      }`}
                    />
                    {on && !reduce && (
                      <motion.span
                        key={`packet-${i}`}
                        aria-hidden="true"
                        className="absolute -top-[3.5px] -ml-1 size-2 rounded-full bg-signal shadow-[0_0_0_4px_rgba(225,37,27,0.22)]"
                        initial={{ left: rightward ? "0%" : "100%" }}
                        animate={{ left: rightward ? "100%" : "0%" }}
                        transition={{ duration: PACKET_MS / 1000, ease: [0.45, 0, 0.25, 1] }}
                      />
                    )}
                  </div>
                </div>
              </div>,
            ];
          })}
        </div>
      </div>

      <ol className="divide-y divide-rule md:hidden">
        {steps.map((s, i) => {
          const state = stateOf(i);
          return (
            <li
              key={i}
              data-step={i}
              className={`grid grid-cols-[2rem_1fr] gap-x-2 px-4 py-2.5 text-sm transition-[opacity,background-color] duration-300 ${
                state === "on" ? "bg-paper-2 shadow-[inset_3px_0_0_var(--color-signal)]" : ""
              } ${state === "todo" ? "opacity-40" : ""}`}
            >
              <span className="font-mono text-xs text-signal">{pad(i + 1)}</span>
              <span>
                <span className="block font-mono text-[0.625rem] uppercase tracking-[0.06em] text-mute">
                  {flow.actors[s.from]} → {flow.actors[s.to]}
                </span>
                {s.label[locale]}
              </span>
            </li>
          );
        })}
      </ol>
      <p className="border-t border-ink px-4 py-3 text-sm leading-relaxed text-ink-soft">{flow.note[locale]}</p>
    </div>
  );
}
