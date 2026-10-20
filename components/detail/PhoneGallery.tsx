import Image from "next/image";
import type { Shot } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

/** Mobile captures side by side in device outlines; a snap-scrolling strip on small screens. */
export default function PhoneGallery({ shots, locale, label }: { shots: Shot[]; locale: Locale; label: string }) {
  return (
    <ul
      aria-label={label}
      className="blueprint -mx-[clamp(1rem,4vw,3.5rem)] flex snap-x snap-mandatory gap-5 overflow-x-auto border-y rule bg-paper-2 px-[clamp(1rem,4vw,3.5rem)] py-8 [scrollbar-width:thin] md:mx-0 md:grid md:grid-cols-3 md:overflow-visible md:border md:px-8 lg:grid-cols-5"
    >
      {shots.map((s) => (
        <li key={s.src} className="w-[62vw] max-w-[15rem] shrink-0 snap-center md:w-auto md:max-w-none">
          <figure>
            <div
              className="relative overflow-hidden rounded-[1.4rem] border-[5px] border-ink bg-ink shadow-[0_24px_48px_-28px_rgba(11,31,51,0.55)]"
              style={{ aspectRatio: `${s.width} / ${s.height}` }}
            >
              <Image src={s.src} alt={s.alt[locale]} fill sizes="(min-width: 1024px) 18vw, (min-width: 768px) 30vw, 62vw" className="object-cover object-top" />
            </div>
            <figcaption className="mt-3 text-xs leading-snug text-ink-soft">{s.alt[locale]}</figcaption>
          </figure>
        </li>
      ))}
    </ul>
  );
}
