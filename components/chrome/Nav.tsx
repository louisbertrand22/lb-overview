import Link from "next/link";
import type { Dictionary, Locale } from "@/lib/i18n";
import LocaleSwitch from "./LocaleSwitch";

export default function Nav({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  return (
    <header className="gutter fixed inset-x-0 top-0 z-50 border-b rule bg-paper/85 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between gap-3 sm:gap-6">
        <Link href={`/${locale}`} className="flex items-center gap-3" aria-label={dict.nav.home}>
          <span
            aria-hidden="true"
            className="grid size-8 place-items-center bg-ink font-[family-name:var(--font-display)] text-[0.8rem] font-extrabold tracking-tight text-paper [font-stretch:125%]"
          >
            LB
          </span>
          <span className="leading-tight max-sm:hidden">
            <span className="block text-sm font-semibold">Louis Bertrand</span>
            <span className="block text-xs text-mute max-sm:hidden">{dict.hero.kicker}</span>
          </span>
        </Link>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.04em] sm:gap-5 sm:tracking-[0.08em] md:gap-8">
            <li>
              <Link href={`/${locale}/work`} className="link-line py-1">
                {dict.nav.work}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}/services`} className="link-line py-1">
                {dict.nav.services}
              </Link>
            </li>
            <li>
              <Link href={`/${locale}#contact`} className="link-line py-1">
                {dict.nav.contact}
              </Link>
            </li>
            <li className="border-l rule pl-3 sm:pl-5 md:pl-8">
              <LocaleSwitch locale={locale} label={dict.nav.switchTo} />
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
