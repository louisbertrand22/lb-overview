import { hasLocale, locales } from "@/lib/i18n";
import { getProject, getWorld, projects, t } from "@/content/projects";
import { ogCard, ogSize } from "@/lib/og";

export const generateStaticParams = () => locales.flatMap((lang) => projects.map((p) => ({ lang, slug: p.slug })));

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Louis Bertrand · Project";

export default async function Image({ params }: { params: Promise<{ lang: string; slug: string }> }) {
  const { lang: raw, slug } = await params;
  const lang = hasLocale(raw) ? raw : "fr";
  const project = getProject(slug);
  if (!project) return new Response(null, { status: 404 });
  return ogCard({
    kicker: `${project.code} · ${t(getWorld(project.world).label, lang)}`,
    title: project.title,
    subtitle: t(project.tagline, lang),
    footer: project.stack.slice(0, 4).join(" · "),
  });
}
