import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "./site";

/** Shared Open Graph card: tracing-paper grid, the nav's LB mark, one signal-red accent. */
export const ogSize = { width: 1200, height: 630 };

const font = (file: string) => readFile(join(process.cwd(), "assets/fonts", file));
const fonts = Promise.all([font("archivo-expanded-800.ttf"), font("plex-mono-500.ttf"), font("plex-sans-400.ttf")]);

const ink = "#0b1f33";
const paper = "#f2f1ec";
const soft = "#4e5d6c";
const signal = "#e1251b";
const gridLine = "rgba(11, 31, 51, 0.07)";

export async function ogCard({ kicker, title, subtitle, footer }: { kicker: string; title: string; subtitle: string; footer: string }) {
  const [display, mono, sans] = await fonts;
  const titleSize = title.length > 16 ? 84 : title.length > 10 ? 104 : 128;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: paper,
          backgroundImage: `linear-gradient(to right, ${gridLine} 1px, transparent 1px), linear-gradient(to bottom, ${gridLine} 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
          color: ink,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 64,
              height: 64,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: ink,
              color: paper,
              fontFamily: "Archivo",
              fontSize: 30,
              letterSpacing: "-0.04em",
            }}
          >
            LB
          </div>
          <div style={{ display: "flex", fontFamily: "Plex Mono", fontSize: 22, letterSpacing: "0.08em", textTransform: "uppercase", color: soft }}>
            {kicker}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", width: 72, height: 6, background: signal }} />
          <div style={{ display: "flex", fontFamily: "Archivo", fontSize: titleSize, lineHeight: 0.95, textTransform: "uppercase", maxWidth: 1072 }}>
            {title}
          </div>
          <div style={{ display: "flex", fontFamily: "Plex Sans", fontSize: 34, lineHeight: 1.3, color: soft, maxWidth: 980 }}>{subtitle}</div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontFamily: "Plex Mono", fontSize: 20, color: soft }}>
          <span>{new URL(siteUrl).host}</span>
          <span>{footer}</span>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Archivo", data: display, weight: 800, style: "normal" },
        { name: "Plex Mono", data: mono, weight: 500, style: "normal" },
        { name: "Plex Sans", data: sans, weight: 400, style: "normal" },
      ],
    },
  );
}
