import Image from "next/image";
import ParallaxImage from "./ParallaxImage";
import type { Shot } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

/**
 * Desktop captures drift with the scroll; phone captures sit in a device
 * outline on a panel of the same 16:10 proportion, so rows stay aligned.
 */
export default function ShotFrame({
  shot,
  locale,
  sizes,
  eager,
  tone = "night",
  companions = [],
}: {
  shot: Shot;
  locale: Locale;
  sizes: string;
  eager?: boolean;
  tone?: "night" | "paper";
  /** Extra phone captures shown either side of the main one */
  companions?: Shot[];
}) {
  if (shot.device === "phone") {
    const [left, right] = companions.filter((c) => c.device === "phone");
    const phone = (s: Shot, main: boolean) => (
      <div
        key={s.src}
        className={`relative shrink-0 overflow-hidden rounded-[1.6rem] border-[6px] border-night shadow-[0_30px_60px_-30px_rgba(0,0,0,0.6)] ${
          main ? "z-10 h-[86%]" : "h-[72%] opacity-90 max-sm:hidden"
        }`}
        style={{ aspectRatio: `${s.width} / ${s.height}` }}
      >
        <Image
          src={s.src}
          alt={s.alt[locale]}
          fill
          sizes="(min-width: 768px) 20vw, 45vw"
          preload={main ? eager : undefined}
          loading={main && eager ? "eager" : undefined}
          className="object-cover object-top"
        />
      </div>
    );
    return (
      <div
        className={`relative flex aspect-[16/10] items-center justify-center gap-[3%] overflow-hidden ${
          tone === "night" ? "bg-ink-2" : "blueprint bg-paper-2"
        }`}
      >
        {left && phone(left, false)}
        {phone(shot, true)}
        {right && phone(right, false)}
      </div>
    );
  }
  return (
    <ParallaxImage
      src={shot.src}
      alt={shot.alt[locale]}
      width={shot.width}
      height={shot.height}
      sizes={sizes}
      eager={eager}
      amount={5}
    />
  );
}
