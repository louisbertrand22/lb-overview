"use client";

import LogoLoop from "@/components/react-bits/LogoLoop/LogoLoop";
import { stackLoop } from "@/content/projects";

export default function StackLoop({ label }: { label: string }) {
  const logos = stackLoop.map((name) => ({
    node: <span className="heading text-[clamp(1.5rem,3vw,2.5rem)] text-ink">{name}</span>,
    title: name,
  }));

  return (
    <section className="border-y rule bg-paper-2 py-6" aria-label={label}>
      <p className="label gutter mb-4">{label}</p>
      <LogoLoop
        logos={logos}
        speed={60}
        direction="left"
        logoHeight={44}
        gap={48}
        pauseOnHover
        fadeOut
        fadeOutColor="#e9e7e0"
        ariaLabel={label}
      />
    </section>
  );
}
