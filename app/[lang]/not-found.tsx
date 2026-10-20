import Link from "next/link";

export default function NotFound() {
  return (
    <section className="gutter flex min-h-svh flex-col justify-end pb-16">
      <p className="label !text-signal">404</p>
      <h1 className="display mt-4 text-[clamp(2.75rem,10vw,9rem)]">Page introuvable</h1>
      <p className="mt-6 max-w-md text-ink-soft">Page not found · This page doesn&apos;t exist or has moved.</p>
      <Link href="/" className="link-line mt-10 w-fit py-1 font-mono text-xs uppercase tracking-[0.08em]">
        ← Louis Bertrand
      </Link>
    </section>
  );
}
