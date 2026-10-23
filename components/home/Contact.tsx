import Reveal from "@/components/motion/Reveal";
import type { Dictionary } from "@/lib/i18n";
import { contactEmail as email } from "@/lib/site";

export default function Contact({ dict }: { dict: Dictionary }) {
  return (
    <section id="contact" className="gutter scroll-mt-20 border-t-2 border-ink py-[clamp(5rem,14vh,9rem)]" aria-labelledby="contact-title">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="label !text-signal md:col-span-3">{dict.contact.label}</p>
        <div className="md:col-span-9">
          <h2 id="contact-title" className="display max-w-[16ch] text-[clamp(2.5rem,6.5vw,6rem)]">
            {dict.contact.title}
          </h2>
          <Reveal>
            <p className="mt-8 max-w-[46ch] text-lg leading-snug text-ink-soft">{dict.contact.body}</p>
          </Reveal>
          <div className="mt-12 grid gap-px border rule bg-rule md:grid-cols-2">
            <a href={`mailto:${email}`} className="group flex flex-col gap-6 bg-paper p-6 transition-colors hover:bg-ink hover:text-paper">
              <span className="label group-hover:!text-paper/70">{dict.contact.email}</span>
              <span className="heading break-all text-[clamp(1.25rem,2.4vw,2rem)]">{email}</span>
            </a>
            <a
              href="https://louis-bertrand.fr/cv-louis-bertrand.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col gap-6 bg-paper p-6 transition-colors hover:bg-ink hover:text-paper"
            >
              <span className="label group-hover:!text-paper/70">PDF ↗</span>
              <span className="heading text-[clamp(1.25rem,2.4vw,2rem)]">{dict.contact.cv}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
