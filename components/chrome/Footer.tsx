import type { Dictionary } from "@/lib/i18n";

const links = [
  { href: "https://louis-bertrand.fr", label: "louis-bertrand.fr" },
  { href: "https://github.com/louisbertrand22", label: "GitHub" },
  { href: "https://www.linkedin.com/in/louis-bertrand222", label: "LinkedIn" },
];

export default function Footer({ dict }: { dict: Dictionary }) {
  return (
    <footer className="gutter bg-night py-8 text-night-text">
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.08em]">
          {links.map((l) => (
            <li key={l.href}>
              <a href={l.href} target="_blank" rel="noopener noreferrer" className="link-line py-1">
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs uppercase tracking-[0.08em] text-night-text/60">
          <p>© 2026 {dict.footer.rights}</p>
          <a href="#top" className="link-line py-1 text-night-text">
            {dict.footer.top} ↑
          </a>
        </div>
      </div>
    </footer>
  );
}
