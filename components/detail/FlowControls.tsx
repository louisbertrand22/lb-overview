"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import type { Architecture } from "@/content/architecture/types";
import type { Locale } from "@/lib/i18n";

/** The packet crosses a line in the first part of a step */
export const PACKET_MS = 900;

/** Time each step stays on screen while playing: long enough to read its label */
export const stepDurations = (flow: Flow, locale: Locale) =>
  flow.steps.map((s) => Math.min(3200, Math.max(1700, 1000 + 30 * s.label[locale].length)));

export type Flow = NonNullable<Architecture["flow"]>;

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

export const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Playback state for one view of a flow. The sequence diagram and the layered diagram each own one,
 * so each plays itself the first time it scrolls into view. `active` is -1 until playback starts,
 * which shows every step at full strength, as in a static diagram.
 */
export function useFlowPlayer(durations: number[]) {
  const reduce = useReducedMotion();
  const last = durations.length - 1;
  const [active, setActive] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const autoplayed = useRef(false);
  // Set once the visitor presses a button: from then on the view follows the active step on screen
  const interacted = useRef(false);

  useEffect(() => {
    if (!playing) return;
    const id = setTimeout(() => {
      if (active >= last) setPlaying(false);
      else setActive(active + 1);
    }, durations[Math.max(0, active)] ?? 1700);
    return () => clearTimeout(id);
  }, [playing, active, last, durations]);

  // Plays once, the first time the diagram comes into view. Not on small screens, where the lit block is
  // usually far off screen: there the visitor presses play, and the view then scrolls along.
  useEffect(() => {
    const el = root.current;
    if (!el || reduce || window.matchMedia("(max-width: 767px)").matches) return;
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

  const play = () => {
    autoplayed.current = true;
    interacted.current = true;
    setActive(active >= last || active < 0 ? 0 : active);
    setPlaying(true);
  };
  const pause = () => setPlaying(false);
  const go = (to: number) => {
    autoplayed.current = true;
    interacted.current = true;
    setPlaying(false);
    setActive(Math.min(last, Math.max(0, to)));
  };

  /** Scrolls an element to the middle of the screen when it is hidden behind the header or below the fold */
  const follow = (el: Element | null | undefined) => {
    if (!el || !interacted.current) return;
    const r = el.getBoundingClientRect();
    if (r.top >= 180 && r.bottom <= window.innerHeight - 24) return;
    window.scrollTo({ top: window.scrollY + r.top + r.height / 2 - window.innerHeight / 2 + 60, behavior: reduce ? "auto" : "smooth" });
  };

  return { root, reduce: Boolean(reduce), active, playing, finished: active >= last && !playing, last, play, pause, go, follow };
}

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

/** Play / previous / next, a progress line and the current step. Sticks under the header on tall diagrams. */
export function FlowControls({
  flow,
  locale,
  labels,
  player,
  names = flow.actors,
  title,
}: {
  flow: Flow;
  locale: Locale;
  labels: FlowLabels;
  player: ReturnType<typeof useFlowPlayer>;
  /** What to call each actor in the caption; the layered diagram uses the names of its own blocks */
  names?: string[];
  /** Shown above the caption, to say which scenario is playing */
  title?: string;
}) {
  const { active, playing, finished, last, play, pause, go } = player;
  const steps = flow.steps;
  const current = active >= 0 ? steps[active] : null;

  return (
    <div className="sticky top-16 z-20 bg-paper">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-ink px-4 py-2.5">
        <div role="group" aria-label={labels.controls} className="flex items-center gap-1.5">
          <ControlButton label={playing ? labels.pause : finished ? labels.replay : labels.play} onClick={playing ? pause : play}>
            <span className="flex items-center gap-2">
              <span aria-hidden="true">{playing ? "❚❚" : finished ? "↺" : "▶"}</span>
              <span>{playing ? labels.pause : finished ? labels.replay : labels.play}</span>
            </span>
          </ControlButton>
          <ControlButton label={labels.previous} onClick={() => go(active - 1)} disabled={active <= 0}>
            <span aria-hidden="true">←</span>
          </ControlButton>
          <ControlButton label={labels.next} onClick={() => go(active + 1)} disabled={active >= last}>
            <span aria-hidden="true">→</span>
          </ControlButton>
        </div>
        {title && <p className="basis-full font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-ink">{title}</p>}
        {/* Announced only while paused: reading out a step every second and a half would be noise */}
        <p className="flex min-w-0 flex-1 basis-60 items-baseline gap-3 text-sm" aria-live={playing ? "off" : "polite"}>
          {current ? (
            <>
              <span className="shrink-0 font-mono text-xs text-signal">
                {pad(active + 1)} / {pad(steps.length)}
              </span>
              <span className="min-w-0">
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.06em] text-mute">
                  {names[current.from] === names[current.to] ? names[current.from] : `${names[current.from]} → ${names[current.to]}`}
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
  );
}
