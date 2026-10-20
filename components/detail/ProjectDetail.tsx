import Link from "next/link";
import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/i18n";
import { getProject, getWorld, nextProject, t } from "@/content/projects";
import ShotFrame from "@/components/motion/ShotFrame";
import Reveal from "@/components/motion/Reveal";
import Gallery from "@/components/detail/Gallery";
import PhoneGallery from "@/components/detail/PhoneGallery";
import Cover from "@/components/work/Cover";
import Architecture from "@/components/detail/Architecture";

/** Everything that depends on the URL lives here, behind the page's Suspense boundary. */
export default async function ProjectDetail({ params }: Pick<PageProps<"/[lang]/work/[slug]">, "params">) {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) notFound();
  const dict = getDictionary(lang);
  const world = getWorld(project.world);
  const next = nextProject(slug);
  const cover = project.shots?.[0];
  const hasLinks = Boolean(project.site || project.repo || project.privateCode);

  return (
    <article className="pt-28 md:pt-32">
      <header className="gutter">
        <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.08em] text-mute">
          <Link href={`/${lang}/work`} className="link-line py-1 text-ink">
            {dict.detail.back}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-signal">{project.code}</span>
        </nav>

        <div className="mt-8 grid gap-10 border-t-2 border-ink pt-6 lg:grid-cols-12 lg:gap-8">
          <div className="lg:col-span-7">
            <p className="label">{t(world.label, lang)}</p>
            <h1 className="display mt-4 text-[clamp(2.75rem,8.5vw,8rem)] [overflow-wrap:anywhere]">{project.title}</h1>
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-[30ch] text-[clamp(1.25rem,2.2vw,1.85rem)] font-medium leading-[1.2]">
                {t(project.tagline, lang)}
              </p>
            </Reveal>
          </div>

          {/* Title block, as on a technical drawing */}
          <dl className="self-end border border-ink lg:col-span-5" aria-label={dict.detail.sheet}>
            <div className="flex items-center justify-between border-b border-ink bg-ink px-4 py-2 text-paper">
              <span className="font-mono text-xs uppercase tracking-[0.08em]">{dict.detail.sheet}</span>
              <span className="font-mono text-xs tracking-[0.08em] text-signal">{project.code}</span>
            </div>
            {[
              [dict.detail.role, t(project.role, lang)],
              [dict.detail.context, t(project.context, lang)],
              [dict.detail.stack, project.stack.join(", ")],
            ].map(([k, v]) => (
              <div key={k} className="grid grid-cols-[7rem_1fr] border-b rule last:border-b-0">
                <dt className="border-r rule px-4 py-3 font-mono text-xs uppercase tracking-[0.08em] text-mute">{k}</dt>
                <dd className="px-4 py-3 text-sm">{v}</dd>
              </div>
            ))}
            {hasLinks && (
              <div className="grid grid-cols-[7rem_1fr]">
                <dt className="border-r rule px-4 py-3 font-mono text-xs uppercase tracking-[0.08em] text-mute">{dict.detail.links}</dt>
                <dd className="flex flex-col gap-1.5 px-4 py-3 text-sm">
                  {project.site && (
                    <a href={project.site} target="_blank" rel="noopener noreferrer" className="link-line w-fit font-medium">
                      {dict.detail.site} · {new URL(project.site).host} ↗
                    </a>
                  )}
                  {project.repo && (
                    <a href={project.repo} target="_blank" rel="noopener noreferrer" className="link-line w-fit font-medium">
                      {dict.detail.code} ↗
                    </a>
                  )}
                  {project.privateCode && <span className="text-ink-soft">{dict.detail.privateCode}</span>}
                  {project.architecture && (
                    <a href="#architecture" className="link-line w-fit font-medium">
                      {dict.arch.label} ↓
                    </a>
                  )}
                </dd>
              </div>
            )}
          </dl>
        </div>
        {project.coldStart && <p className="mt-4 text-sm text-mute">{dict.detail.coldStart}</p>}
      </header>

      <div className="gutter mt-12 md:mt-16">
        {cover ? (
          <ShotFrame shot={cover} locale={lang} sizes="100vw" eager tone="paper" />
        ) : (
          <Cover project={project} worldLabel={t(world.label, lang)} className="aspect-[16/7] max-md:aspect-[4/3]" />
        )}
      </div>

      <section className="gutter grid gap-8 py-[clamp(4rem,12vh,8rem)] md:grid-cols-12">
        <h2 className="label md:col-span-3">{dict.detail.overview}</h2>
        <Reveal className="md:col-span-6">
          <p className="text-[clamp(1.1rem,1.5vw,1.35rem)] leading-[1.6]">{t(project.summary, lang)}</p>
        </Reveal>
        {project.stat && (
          <Reveal className="border-l-2 border-signal pl-5 md:col-span-3" delay={0.1}>
            <p className="display text-[clamp(3rem,6vw,5rem)]">{t(project.stat.value, lang)}</p>
            <p className="mt-2 text-sm text-ink-soft">{t(project.stat.label, lang)}</p>
          </Reveal>
        )}
      </section>

      <section className="gutter grid gap-6 pb-[clamp(4rem,12vh,8rem)] md:grid-cols-12">
        <h2 className="label md:col-span-3">{dict.detail.highlights}</h2>
        <ul className="border-t-2 border-ink md:col-span-9">
          {t(project.highlights, lang).map((h, i) => (
            <Reveal as="li" key={h} delay={i * 0.04} className="grid grid-cols-[3rem_1fr] border-b rule py-4">
              <span className="font-mono text-xs text-signal">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-[clamp(1.05rem,1.4vw,1.25rem)]">{h}</span>
            </Reveal>
          ))}
        </ul>
      </section>

      {project.architecture && <Architecture data={project.architecture} locale={lang} dict={dict} />}

      {project.shots && project.shots.length > 1 && (
        <section className="gutter pb-[clamp(4rem,12vh,8rem)]" aria-labelledby="gallery-title">
          <div className="mb-6 flex flex-wrap items-baseline justify-between gap-4 border-t-2 border-ink pt-4">
            <h2 id="gallery-title" className="label !text-ink">
              {dict.detail.gallery}
            </h2>
            {!project.shots.every((shot) => shot.device === "phone") && (
              <p className="label max-md:hidden">{dict.detail.galleryHint}</p>
            )}
          </div>
          {project.shots.every((shot) => shot.device === "phone") ? (
            <PhoneGallery shots={project.shots} locale={lang} label={`${project.title} · ${dict.detail.gallery}`} />
          ) : (
            <Gallery shots={project.shots} locale={lang} label={`${project.title} · ${dict.detail.gallery}`} />
          )}
        </section>
      )}

      <Link href={`/${lang}/work/${next.slug}`} className="group gutter block bg-ink py-[clamp(3rem,10vh,6rem)] text-paper">
        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.08em] text-paper/60">
          {dict.detail.next} <span className="text-signal">{next.code}</span>
        </p>
        <p className="display mt-4 text-[clamp(2rem,8vw,7.5rem)] transition-colors duration-300 [overflow-wrap:anywhere] group-hover:text-signal">
          {next.title} →
        </p>
      </Link>
    </article>
  );
}
