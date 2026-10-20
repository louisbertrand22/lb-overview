import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { fontVariables } from "./fonts";

export const metadata: Metadata = {
  title: "404 · Louis Bertrand",
};

export default function GlobalNotFound() {
  return (
    <html lang="fr" className={fontVariables}>
      <body className="gutter flex min-h-svh flex-col justify-end pb-16">
        <p className="label !text-signal">404</p>
        <h1 className="display mt-4 text-[clamp(2.75rem,10vw,9rem)]">Page introuvable</h1>
        <p className="mt-6 max-w-md text-ink-soft">This page doesn&apos;t exist or has moved.</p>
        <div className="mt-10 flex gap-8 font-mono text-xs uppercase tracking-[0.08em]">
          <Link href="/fr" className="link-line">Accueil</Link>
          <Link href="/en" className="link-line">Home</Link>
        </div>
      </body>
    </html>
  );
}
