"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/** Nav link that stays underlined while its section is the current page. */
export default function NavLink({ href, children }: { href: string; children: ReactNode }) {
  const pathname = usePathname();
  const current = pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link href={href} className="link-line py-1" aria-current={current ? "page" : undefined}>
      {children}
    </Link>
  );
}
