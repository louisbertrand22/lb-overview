import Reveal from "@/components/motion/Reveal";
import SequenceFlow from "@/components/detail/SequenceFlow";
import type { ArchTable, Architecture as ArchitectureData, Cell } from "@/content/architecture/types";
import { t } from "@/content/projects";
import type { Dictionary, Locale } from "@/lib/i18n";

function SubHeading({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="label mb-5 flex items-center gap-3 !text-ink">
      <span className="inline-block h-px w-6 bg-signal" aria-hidden="true" />
      {children}
    </h3>
  );
}

const cell = (c: Cell, locale: Locale) => (typeof c === "string" ? c : t(c, locale));

function DataTable({ table, locale }: { table: ArchTable; locale: Locale }) {
  return (
    <div className="min-w-0">
      <SubHeading>{t(table.title, locale)}</SubHeading>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[30rem] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b-2 border-ink font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mute">
              {table.head.map((h) => (
                <th key={h.en} scope="col" className="py-2 pr-4 font-normal">
                  {t(h, locale)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, ri) => (
              <tr key={ri} className="border-b rule align-top">
                {row.map((c, ci) => {
                  const mono = table.mono?.includes(ci);
                  const tone = ci === 0 ? (mono ? "font-medium text-signal" : "font-semibold") : "text-ink-soft";
                  const className = `py-2.5 pr-4 ${mono ? "font-mono text-xs" : ""} ${tone}`;
                  return ci === 0 ? (
                    <th key={ci} scope="row" className={className}>
                      {cell(c, locale)}
                    </th>
                  ) : (
                    <td key={ci} className={className}>
                      {cell(c, locale)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.note && <p className="mt-3 max-w-[80ch] text-sm leading-relaxed text-ink-soft">{t(table.note, locale)}</p>}
    </div>
  );
}

/** Technical case study: figures, layered system diagram, principles, flows, tables, delivery and inventory. */
export default function Architecture({ data, locale, dict }: { data: ArchitectureData; locale: Locale; dict: Dictionary }) {
  const a = dict.arch;
  const itemCols = (count: number) =>
    count === 2 ? "sm:grid-cols-2" : count === 4 ? "sm:grid-cols-2 xl:grid-cols-4" : "sm:grid-cols-3";

  return (
    <section id="architecture" className="gutter scroll-mt-20 pb-[clamp(4rem,12vh,8rem)]" aria-labelledby="arch-title">
      <div className="grid gap-6 border-t-2 border-ink pt-6 md:grid-cols-12">
        <p className="label !text-signal md:col-span-3">{a.label}</p>
        <div className="md:col-span-9">
          <h2 id="arch-title" className="display text-[clamp(2.5rem,6vw,5.5rem)]">
            {a.title}
          </h2>
          <p className="mt-6 max-w-[62ch] text-[clamp(1.05rem,1.4vw,1.25rem)] leading-[1.6]">{t(data.intro, locale)}</p>
        </div>
      </div>

      {/* Key figures */}
      <dl className="mt-12 grid grid-cols-2 border-l border-t rule md:grid-cols-3 xl:grid-cols-6">
        {data.facts.map((f) => {
          const value = cell(f.value, locale);
          const [figure, ...unit] = value.split(" ");
          return (
            <div key={value + f.label.en} className="border-b border-r rule p-5">
              <dt className="sr-only">{t(f.label, locale)}</dt>
              <dd className="@container">
                {/* A trailing unit ("15 min", "60 s") is set smaller; long figures shrink to fit their cell */}
                <span
                  className="display block whitespace-nowrap !normal-case"
                  style={{ fontSize: `min(3.5rem, ${(100 / (figure.length * 0.86 + (unit.length ? 1 : 0))).toFixed(1)}cqw)` }}
                >
                  {figure}
                  {unit.length > 0 && <span className="ml-1 text-[0.45em] tracking-normal">{unit.join(" ")}</span>}
                </span>
                <span className="mt-2 block text-sm leading-snug text-ink-soft">{t(f.label, locale)}</span>
              </dd>
            </div>
          );
        })}
      </dl>

      {/* System diagram */}
      <div className="mt-16">
        <SubHeading>{a.diagram}</SubHeading>
        <figure className="border border-ink">
          <div className={`blueprint grid gap-6 p-4 md:p-6 ${data.services ? "lg:grid-cols-[1fr_16rem]" : ""}`}>
            <div className={`relative ${data.rail ? "lg:pl-12" : ""}`}>
              {data.rail && (
                <div className="absolute bottom-10 left-3 top-10 hidden w-0.5 bg-signal lg:block" aria-hidden="true">
                  <span className="absolute -left-[3px] top-0 size-2 rounded-full bg-signal" />
                  <span className="absolute -left-[3px] bottom-0 size-2 rounded-full bg-signal" />
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 rotate-180 whitespace-nowrap bg-paper px-1 font-mono text-[0.625rem] uppercase tracking-[0.08em] text-signal [writing-mode:vertical-rl]">
                    {a.direct} · {data.rail.label}
                  </span>
                </div>
              )}
              <ol className="flex flex-col">
                {data.layers.map((layer) => (
                  <li key={layer.id}>
                    <div className="grid gap-3 md:grid-cols-[9rem_1fr] md:items-stretch">
                      <p className="flex flex-col justify-center font-mono text-xs uppercase tracking-[0.08em] text-ink">
                        {t(layer.label, locale)}
                      </p>
                      <ul
                        className={`grid gap-2 ${itemCols(layer.items.length)} ${
                          layer.host === "server" ? "border border-dashed border-ink/40 p-2" : ""
                        }`}
                      >
                        {layer.items.map((item) => (
                          <li key={item.name} className="border border-ink bg-paper px-3 py-2.5">
                            <p className="text-sm font-semibold">{item.name}</p>
                            <p className="mt-1 text-xs leading-snug text-ink-soft">{t(item.detail, locale)}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {layer.link && (
                      <p className="flex items-center gap-2 py-2.5 font-mono text-[0.6875rem] text-mute md:pl-[9.75rem]">
                        <span className="text-ink" aria-hidden="true">↓</span>
                        {t(layer.link, locale)}
                      </p>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {data.services && (
              <div className="border-t border-ink pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                <p className="mb-3 font-mono text-xs uppercase tracking-[0.08em] text-ink">{a.services}</p>
                <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1">
                  {data.services.map((s) => (
                    <li key={s.name} className="border border-rule bg-paper px-3 py-2">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="mt-0.5 text-xs text-ink-soft">{t(s.detail, locale)}</p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          {data.rail && (
            <figcaption className="flex items-start gap-3 border-t border-ink px-4 py-3 text-sm text-ink-soft">
              <span className="mt-2 inline-block h-0.5 w-5 shrink-0 bg-signal" aria-hidden="true" />
              {t(data.rail.caption, locale)}
            </figcaption>
          )}
        </figure>
      </div>

      {/* Principles */}
      <div className="mt-16">
        <SubHeading>{a.principles}</SubHeading>
        <ol className="grid border-l border-t rule sm:grid-cols-2 lg:grid-cols-3">
          {data.principles.map((p, i) => (
            <Reveal as="li" key={p.title.en} delay={i * 0.04} className="border-b border-r rule p-5">
              <p className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</p>
              <p className="heading mt-3 text-lg">{t(p.title, locale)}</p>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{t(p.body, locale)}</p>
            </Reveal>
          ))}
        </ol>
      </div>

      {data.steps && (
        <div className="mt-16">
          <SubHeading>{t(data.steps.title, locale)}</SubHeading>
          <ol className="grid grid-cols-1 border-l border-t border-ink sm:grid-cols-2 lg:grid-cols-5">
            {data.steps.items.map((step, i) => (
              <li key={step.code} className="flex flex-col gap-2 border-b border-r border-ink bg-paper p-4">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
                  <span className="truncate font-mono text-[0.625rem] text-mute">{step.code}</span>
                </span>
                <span className="heading text-lg">{t(step.name, locale)}</span>
                <span className="text-xs leading-snug text-ink-soft">{t(step.detail, locale)}</span>
              </li>
            ))}
          </ol>
          {data.steps.outcomes && (
            <div className="mt-2 grid gap-2 md:grid-cols-2">
              {data.steps.outcomes.map((o, i) => (
                <div key={o.title.en} className={`border p-4 ${i === data.steps!.outcomes!.length - 1 ? "border-ink bg-ink text-paper" : "border-ink"}`}>
                  <p className="font-mono text-xs uppercase tracking-[0.08em]">↳ {t(o.title, locale)}</p>
                  <ul className="mt-3 flex flex-col gap-1.5 text-sm">
                    {o.points.map((pt) => (
                      <li key={pt.en} className="flex gap-2">
                        <span className="text-signal" aria-hidden="true">·</span>
                        {t(pt, locale)}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {data.steps.note && <p className="mt-4 max-w-[80ch] text-sm leading-relaxed text-ink-soft">{t(data.steps.note, locale)}</p>}
        </div>
      )}

      {data.flow && (
        <div className="mt-16">
          <SubHeading>{t(data.flow.title, locale)}</SubHeading>
          <SequenceFlow
            flow={data.flow}
            locale={locale}
            labels={{
              controls: a.flowControls,
              play: a.flowPlay,
              pause: a.flowPause,
              replay: a.flowReplay,
              previous: a.flowPrevious,
              next: a.flowNext,
              count: a.flowCount,
            }}
          />
        </div>
      )}

      {data.leitner && (
        <div className="mt-16">
          <SubHeading>{t(data.leitner.title, locale)}</SubHeading>
          <div className="border border-ink p-4 md:p-6">
            <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-8">
              {t(data.leitner.intervals, locale).map((interval, i) => (
                <li key={interval} className="flex flex-col border border-ink bg-paper p-3">
                  <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mute">
                    {a.box} {i + 1}
                  </span>
                  <span className="heading mt-2 whitespace-nowrap text-xl">{interval}</span>
                </li>
              ))}
              <li className="flex flex-col justify-between bg-ink p-3 text-paper">
                <span className="font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-paper/70">{a.box} &gt; 7</span>
                <span className="heading mt-2 text-xl">{a.learned}</span>
              </li>
            </ol>
            <div className="mt-3 hidden items-center gap-2 font-mono text-[0.6875rem] text-signal lg:flex" aria-hidden="true">
              <span className="h-3 w-px bg-signal" />
              <span className="h-px flex-1 border-t border-dashed border-signal" />
              <span>↺ {a.box} 1</span>
            </div>
            <p className="mt-4 max-w-[80ch] text-sm leading-relaxed text-ink-soft">{t(data.leitner.note, locale)}</p>
          </div>
        </div>
      )}

      {(data.notes || data.tables) && (
        <div className="mt-16 grid gap-x-8 gap-y-14 lg:grid-cols-2">
          {data.notes?.map((n) => (
            <div key={n.title.en} className="min-w-0">
              <SubHeading>{t(n.title, locale)}</SubHeading>
              <p className="leading-relaxed">{t(n.body, locale)}</p>
            </div>
          ))}
          {data.tables?.map((table) => (
            <DataTable key={table.title.en} table={table} locale={locale} />
          ))}
        </div>
      )}

      {data.pipeline && (
        <div className="mt-16">
          <SubHeading>{a.pipeline}</SubHeading>
          <ol className={`grid gap-2 ${data.pipeline.stages.length === 3 ? "md:grid-cols-3" : "md:grid-cols-4"}`}>
            {data.pipeline.stages.map((s, i, all) => {
              const last = i === all.length - 1;
              return (
                <li key={s.branch} className="relative">
                  <div className={`h-full border p-4 ${last ? "border-ink bg-ink text-paper" : "border-ink bg-paper"}`}>
                    <p className="font-mono text-sm font-medium">{s.branch}</p>
                    <p className={`mt-1 text-xs ${last ? "text-paper/70" : "text-ink-soft"}`}>{t(s.target, locale)}</p>
                  </div>
                  {!last && (
                    <span
                      className="absolute -bottom-2 left-1/2 z-10 -translate-x-1/2 bg-paper px-1 font-mono text-[0.625rem] text-signal md:-right-[0.9rem] md:bottom-auto md:left-auto md:top-1/2 md:-translate-y-1/2 md:translate-x-0"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  )}
                </li>
              );
            })}
          </ol>
          <p className="mt-5 max-w-[80ch] text-sm leading-relaxed text-ink-soft">{t(data.pipeline.checks, locale)}</p>
        </div>
      )}

      {/* Inventory */}
      <div className="mt-16">
        <SubHeading>{a.inventory}</SubHeading>
        <div className="grid gap-x-8 gap-y-10 lg:grid-cols-2">
          {data.inventory.map((g) => (
            <div key={g.group.en} className="overflow-x-auto">
              <table className="w-full min-w-[26rem] border-collapse text-left text-sm">
                <caption className="pb-2 text-left font-mono text-xs uppercase tracking-[0.08em] text-signal">{t(g.group, locale)}</caption>
                <thead>
                  <tr className="border-b-2 border-ink font-mono text-[0.6875rem] uppercase tracking-[0.08em] text-mute">
                    {a.inventoryHead.map((h) => (
                      <th key={h} scope="col" className="py-2 pr-4 font-normal">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {g.rows.map((r) => (
                    <tr key={r.tech} className="border-b rule align-top">
                      <th scope="row" className="py-2.5 pr-4 font-semibold">
                        {r.tech}
                      </th>
                      <td className="py-2.5 pr-4 font-mono text-xs">{r.version}</td>
                      <td className="py-2.5 text-ink-soft">{t(r.role, locale)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-mute">
        {data.source.url && (
          <a href={data.source.url} target="_blank" rel="noopener noreferrer" className="link-line font-medium text-ink">
            {a.source} ↗
          </a>
        )}
        <span>{t(data.source.note, locale)}</span>
      </p>
    </section>
  );
}
