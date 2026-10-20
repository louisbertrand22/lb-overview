# lb-overview

Bilingual (FR/EN) showcase of Louis Bertrand's products and projects, compiled from
[louis-bertrand.fr](https://louis-bertrand.fr) and the live products themselves. Quarto is the only
product linked on another domain (quarto.lucho-dev.xyz), by request.

Art direction "Schéma directeur": tracing paper, navy ink and one signal red, Archivo Expanded with
IBM Plex. The hero is an interactive system map of real projects across business needs,
architecture and delivery (`components/home/SystemMap.tsx`).

Next.js 16 (App Router, Cache Components) · TypeScript · Tailwind CSS 4 · Motion · GSAP · Lenis

## Develop

```bash
npm ci
npm run dev        # http://localhost:3000 → redirects to /fr or /en from Accept-Language
npm run lint
npm run typecheck
npm run build
```

## Structure

| Path | Role |
| --- | --- |
| `content/projects.ts` | Single source of truth: 16 projects, worlds, system map, experience, hobbies, all copy in FR and EN |
| `lib/i18n.ts` | Locales and UI dictionary |
| `proxy.ts` | Redirects locale-less URLs to `/fr` or `/en` |
| `app/[lang]/` | Home, `/work` showcase, `/work/[slug]` detail template (all prerendered) |
| `components/react-bits/` | React Bits components installed via `premium-frontend-skill`, adapted (each change is marked `Adapted:`) |
| `.premium-frontend/` | Provenance manifest and licence for the React Bits sources |
| `.claude/skills/premium-frontend-skill/` | The design skill, not committed: install it with `npx premium-frontend-skill@latest install --dest .claude/skills/premium-frontend-skill` |

## Adding a project

Add an entry to `projects` in `content/projects.ts` (FR and EN copy), and drop any screenshots in
`public/work/`. The home index, showcase grid, detail page and sitemap pick it up automatically.

## Deploy

Import the repository in Vercel. No environment variables are required; `vercel.json` pins the
framework, install and build commands and adds security and asset caching headers.
