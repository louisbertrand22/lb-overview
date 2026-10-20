import type { Localized } from "@/lib/i18n";

type Item = { name: string; detail: Localized };

/** A table cell: plain text (code, numbers, names) or localized prose */
export type Cell = string | Localized;

export type ArchTable = {
  title: Localized;
  head: Localized[];
  rows: Cell[][];
  /** Column indexes rendered in monospace */
  mono?: number[];
  note?: Localized;
};

/** Technical case study attached to a project, rendered by components/detail/Architecture.tsx */
export type Architecture = {
  /** `url` only when the source document is public */
  source: { url?: string; note: Localized };
  intro: Localized;
  /** A trailing unit after a regular space ("15 min") is set smaller; use narrow no-break spaces inside numbers */
  facts: { value: Cell; label: Localized }[];
  /** Request path from top to bottom; `link` labels the hop to the next layer */
  layers: { id: string; label: Localized; host: "server" | ""; items: Item[]; link?: Localized }[];
  /** A path drawn as a red rail beside the layers, with its legend */
  rail?: { label: string; caption: Localized };
  services?: Item[];
  principles: { title: Localized; body: Localized }[];
  /** Numbered sequence, e.g. a protocol exchange */
  flow?: { title: Localized; actors: string[]; steps: { from: number; to: number; label: Localized }[]; note: Localized };
  /** Linear processing chain, shown as numbered cards; `outcomes` are the branches after the last step */
  steps?: {
    title: Localized;
    items: { name: Localized; code: string; detail: Localized }[];
    outcomes?: { title: Localized; points: Localized[] }[];
    note?: Localized;
  };
  /** Review interval per Leitner box */
  leitner?: { title: Localized; intervals: Localized<string[]>; note: Localized };
  notes?: { title: Localized; body: Localized }[];
  tables?: ArchTable[];
  pipeline?: { stages: { branch: string; target: Localized }[]; checks: Localized };
  inventory: { group: Localized; rows: { tech: string; version: string; role: Localized }[] }[];
};
