import type { Metadata } from "next";
import { Suspense } from "react";
import { hasLocale, locales } from "@/lib/i18n";
import { getProject, projects, t } from "@/content/projects";
import ProjectDetail from "@/components/detail/ProjectDetail";

export function generateStaticParams() {
  return locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));
}

export async function generateMetadata({ params }: PageProps<"/[lang]/work/[slug]">): Promise<Metadata> {
  const { lang, slug } = await params;
  const project = getProject(slug);
  if (!hasLocale(lang) || !project) return {};
  return {
    title: project.title,
    description: t(project.tagline, lang),
    alternates: {
      canonical: `/${lang}/work/${slug}`,
      languages: { fr: `/fr/work/${slug}`, en: `/en/work/${slug}` },
    },
    openGraph: project.shots ? { images: [{ url: project.shots[0].src }] } : undefined,
  };
}

function DetailSkeleton() {
  return (
    <div className="gutter min-h-svh pt-28 md:pt-32" aria-hidden="true">
      <div className="h-3 w-40 bg-paper-2" />
      <div className="mt-14 h-[clamp(3rem,8.5vw,8rem)] w-2/3 bg-paper-2" />
    </div>
  );
}

export default function ProjectPage({ params }: PageProps<"/[lang]/work/[slug]">) {
  return (
    <Suspense fallback={<DetailSkeleton />}>
      <ProjectDetail params={params} />
    </Suspense>
  );
}
