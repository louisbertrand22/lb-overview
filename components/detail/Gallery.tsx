"use client";

import AccordionGallery from "@/components/react-bits/AccordionGallery/AccordionGallery";
import type { Shot } from "@/content/projects";
import type { Locale } from "@/lib/i18n";

export default function Gallery({ shots, locale, label }: { shots: Shot[]; locale: Locale; label: string }) {
  return (
    <AccordionGallery
      items={shots.map((s) => ({ image: s.src, alt: s.alt[locale], label: s.alt[locale] }))}
      defaultIndex={0}
      accentColor="#e1251b"
      overlayColor="#0b1f33"
      textColor="#f2f1ec"
      height={560}
      gap={8}
      radius={0}
      expandRatio={0.64}
      tilt={4}
      parallax={0.6}
      grayscale={false}
      showLabels
      ariaLabel={label}
      className="max-md:!h-auto"
    />
  );
}
