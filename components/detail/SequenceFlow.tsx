"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { Architecture } from "@/content/architecture/types";
import type { Locale } from "@/lib/i18n";

/** Time a step stays highlighted while playing; the packet crosses the arrow in the first part of it */
const STEP_MS = 1500;
const PACKET_S = 0.9;

export type FlowLabels = {
  controls: string;
  play: string;
  pause: string;
  replay: string;
  previous: string;
  next: string;
  /** "{n} steps", shown before playback starts */
  count: string;
};

const pad = (n: number) => String(n).padStart(2, "0");

function ControlButton({ label, onClick, disabled, children }: { label: string; onClick: () => void; disabled?: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={label}
      className="grid h-8 min-w-8 place-items-center border border-ink px-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors hover:bg-ink hover:text-paper disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink"
    >
      {children}
    </button>
  );
}

/**
 * Sequence diagram that plays itself: each step lights up in turn, a packet travels along its arrow, and the
 * two actors involved are highlighted. Steps are the same data as the static diagram, so nothing is redrawn by hand.
 * Without motion (reduced-motion preference) nothing autoplays and there is no packet; the step buttons still work.
 * Wide screens get lifelines and arrows, small screens a numbered list.
 */
export default function SequenceFlow({ flow, locale, labels }: { flow: NonNullable<Architecture["flow"]>; locale: Locale; labels: FlowLabels }) {
  const reduce = useReducedMotion();
  const steps = flow.steps;
  const last = steps.length - 1;
  // -1 = not started: every step is shown at full strength, as in a static diagram
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const autoplayed = useRef(false);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (active >= last) setPlaying(false);
      else setActive(active + 1);
    }, STEP_MS);
    return () => clearTimeout(id);
  }, [playing, active, last]);

  // Plays once, the first time the diagram comes into view
  useEffect(() => {
    const el = root.current;
    if (!el || reduce) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !autoplayed.current) {
          autoplayed.current = true;
          setActive(0);
          setPlaying(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -35% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [reduce]);

  const finished = active >= last && !playing;
  const play = () => {
    autoplayed.current = true;
    setActive(active >= last || active < 0 ? 0 : active);
    setPlaying(true);
  };
  const go = (to: number) => {
    autoplayed.current = true;
    setPlaying(false);
    setActive(Math.min(last, Math.max(0, to)));
  };

  const current = active >= 0 ? steps[active] : null;
  const grid = { gridTemplateColumns: `2.25rem repeat(${flow.actors.length}, minmax(0, 1fr))` };
  const stateOf = (i: number) => (active < 0 ? "idle" : i === active ? "on" : i < active ? "done" : "todo");

  return (
    <div ref={root} className="border border-ink">
      {/* Sticks under the header, so the current step stays readable while scrolling a tall diagram */}
      <div className="sticky top-16 z-20 bg-paper">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink px-4 py-2.5">
          <div role="group" aria-label={labels.controls} className="flex items-center gap-1.5">
            <ControlButton label={playing ? labels.pause : finished ? labels.replay : labels.play} onClick={playing ? () => setPlaying(false) : play}>
              <span aria-hidden="true">{playing ? "❚❚" : finished ? "↺" : "▶"}</span>
            </ControlButton>
            <ControlButton label={labels.previous} onClick={() => go(active - 1)} disabled={active <= 0}>
              <span aria-hidden="true">←</span>
            </ControlButton>
            <ControlButton label={labels.next} onClick={() => go(active + 1)} disabled={active >= last}>
              <span aria-hidden="true">→</span>
            </ControlButton>
          </div>
          {/* Announced only while paused: reading out a step every second and a half would be noise */}
          <p className="flex min-w-0 flex-1 basis-60 items-baseline gap-3 text-sm" aria-live={playing ? "off" : "polite"}>
            {current ? (
              <>
                <span className="shrink-0 font-mono text-xs text-signal">
                  {pad(active + 1)} / {pad(steps.length)}
                </span>
                <span className="min-w-0">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-mute">
                    {flow.actors[current.from]} → {flow.actors[current.to]}
                  </span>{" "}
                  {current.label[locale]}
                </span>
              </>
            ) : (
              <span className="font-mono text-xs text-mute">{labels.count.replace("{n}", String(steps.length))}</span>
            )}
          </p>
        </div>
        <div className="h-0.5 bg-rule" aria-hidden="true">
          <div className="h-full bg-signal transition-[width] duration-500" style={{ width: `${((active + 1) / steps.length) * 100}%` }} />
        </div>
      </div>

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
                        transition={{ duration: PACKET_S, ease: [0.45, 0, 0.25, 1] }}
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
