import type { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/i18n";
import { t, type Project } from "@/content/projects";
import { author, siteUrl } from "@/lib/site";

/** schema.org data for search engines; `<` is escaped so copy can never close the script tag */
function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c") }}
    />
  );
}

const personId = `${siteUrl}/#person`;

export function SiteJsonLd({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  return (
    <JsonLd
      data={{
        "@graph": [
          {
            "@type": "Person",
            "@id": personId,
            name: author.name,
            url: author.url,
            jobTitle: dict.hero.kicker,
            sameAs: author.sameAs,
            alumniOf: { "@type": "CollegeOrUniversity", name: "EPITA" },
          },
          {
            "@type": "WebSite",
            "@id": `${siteUrl}/#website`,
            url: `${siteUrl}/${locale}`,
            name: author.name,
            description: dict.meta.description,
            inLanguage: locale,
            author: { "@id": personId },
          },
        ],
      }}
    />
  );
}

export function ProjectJsonLd({ project, locale }: { project: Project; locale: Locale }) {
  const dict = getDictionary(locale);
  const url = `${siteUrl}/${locale}/work/${project.slug}`;
  return (
    <JsonLd
      data={{
        "@graph": [
          {
            "@type": project.repo ? "SoftwareSourceCode" : "CreativeWork",
            "@id": `${url}#work`,
            name: project.title,
            headline: t(project.tagline, locale),
            description: t(project.summary, locale),
            url,
            inLanguage: locale,
            keywords: project.stack.join(", "),
            author: { "@id": personId, "@type": "Person", name: author.name, url: author.url },
            ...(project.repo && { codeRepository: project.repo }),
            ...(project.site && { sameAs: project.site }),
            ...(project.shots && { image: project.shots.map((s) => `${siteUrl}${s.src}`) }),
          },
          {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: author.name, item: `${siteUrl}/${locale}` },
              { "@type": "ListItem", position: 2, name: dict.work.title, item: `${siteUrl}/${locale}/work` },
              { "@type": "ListItem", position: 3, name: project.title, item: url },
            ],
          },
        ],
      }}
    />
  );
}
