"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { otherLocale, type Locale } from "@/lib/i18n";

export default function LocaleSwitch({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname();
  const target = otherLocale(locale);
  const href = pathname.replace(new RegExp(`^/${locale}(?=/|$)`), `/${target}`) || `/${target}`;
  return (
    <Link href={href} hrefLang={target} lang={target} aria-label={label} className="link-line py-1 uppercase">
      {target}
    </Link>
  );
}
