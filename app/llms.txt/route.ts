import { getDictionary, locales } from "@/lib/i18n";
import { getWorld, projects, t } from "@/content/projects";
import { services, servicesCopy } from "@/content/services";
import { author, siteUrl } from "@/lib/site";

/** llms.txt (llmstxt.org): a plain-text map of the site for AI assistants and crawlers */
export function GET() {
  const dict = getDictionary("en");
  const lines = [
    `# ${author.name}`,
    "",
    `> ${dict.meta.description}`,
    "",
    `${dict.hero.kicker} · ${dict.hero.location}. Every page exists in ${locales.join(" and ")}; English URLs are listed, French ones swap /en for /fr.`,
    "",
    "## Pages",
    "",
    `- [Home](${siteUrl}/en): overview, featured products, path and contact`,
    `- [Work](${siteUrl}/en/work): ${dict.work.intro}`,
    `- [Services](${siteUrl}/en/services): ${servicesCopy.statement.en}`,
    "",
    "## Services",
    "",
    ...services.map((s) => `- ${s.title.en}: ${s.lead.en}`),
    "",
    "## Projects",
    "",
    ...projects.map(
      (p) => `- [${p.title}](${siteUrl}/en/work/${p.slug}): ${t(p.tagline, "en")} (${t(getWorld(p.world).label, "en")}; ${p.stack.join(", ")})`,
    ),
    "",
    "## Elsewhere",
    "",
    ...author.sameAs.map((url) => `- ${url}`),
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
