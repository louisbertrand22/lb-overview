import type { Architecture } from "./types";

/**
 * Source: magic-cards.fr/architecture.html, read from the code (branch dev, 1276d4d, 28 September 2026),
 * cross-checked with magic-cards.fr/stack. Where the two differ (sign-in), the code-derived page wins.
 */
export const magiccardsArchitecture: Architecture = {
  source: {
    url: "https://magic-cards.fr/architecture.html",
    note: {
      fr: "Relevé dans le code, branche dev, 28 septembre 2026",
      en: "Read from the code, dev branch, 28 September 2026",
    },
  },
  intro: {
    fr: "Un seul backend Next.js hébergé sur Vercel sert les pages web et les routes API que le site et l'app Expo partagent. Firestore est l'unique base de données : les clients la lisent en direct et en temps réel, mais n'y écrivent jamais eux-mêmes. Toute écriture passe par une route API.",
    en: "A single Next.js backend hosted on Vercel serves the web pages and the API routes shared by the site and the Expo app. Firestore is the only database: clients read it directly and in real time, but never write to it themselves. Every write goes through an API route.",
  },
  facts: [
    { value: "145", label: { fr: "handlers API partagés web et mobile", en: "API handlers shared by web and mobile" } },
    { value: "83", label: { fr: "pages App Router, FR par défaut et /en", en: "App Router pages, FR by default and /en" } },
    { value: "1", label: { fr: "base de données : Cloud Firestore", en: "database: Cloud Firestore" } },
    { value: "4", label: { fr: "crons Vercel par jour", en: "Vercel crons a day" } },
    { value: "31", label: { fr: "fichiers de tests unitaires Vitest", en: "Vitest unit test files" } },
    { value: "3", label: { fr: "environnements : dev, staging, production", en: "environments: dev, staging, production" } },
  ],
  layers: [
    {
      id: "clients",
      label: { fr: "Clients", en: "Clients" },
      host: "",
      items: [
        { name: "Web · PWA", detail: { fr: "Next.js 16 · React 19 · Tailwind 4 · hors ligne via sw.js", en: "Next.js 16 · React 19 · Tailwind 4 · offline via sw.js" } },
        { name: "App iOS / Android", detail: { fr: "Expo 54 · React Native 0.81 · Expo Router 6", en: "Expo 54 · React Native 0.81 · Expo Router 6" } },
        { name: "Portail admin", detail: { fr: "Basic Auth + cookie HMAC · impersonation en lecture seule", en: "Basic Auth + HMAC cookie · read-only impersonation" } },
      ],
      link: { fr: "HTTPS · pages + /api · ID token en Bearer", en: "HTTPS · pages + /api · ID token as Bearer" },
    },
    {
      id: "edge",
      label: { fr: "Vercel · Edge", en: "Vercel · Edge" },
      host: "server",
      items: [
        { name: "Middleware proxy.ts", detail: { fr: "CSP à nonce · maintenance · Basic Auth /admin · rate limit admin", en: "Nonce CSP · maintenance · /admin Basic Auth · admin rate limit" } },
        { name: "Edge Config", detail: { fr: "Interrupteur de maintenance, sans redéploiement", en: "Maintenance switch, no redeploy" } },
      ],
      link: { fr: "Fonctions serverless", en: "Serverless functions" },
    },
    {
      id: "functions",
      label: { fr: "Vercel · Fonctions Node", en: "Vercel · Node functions" },
      host: "server",
      items: [
        { name: "Pages App Router", detail: { fr: "83 pages · RSC/SSR · next/og", en: "83 pages · RSC/SSR · next/og" } },
        { name: "Routes API", detail: { fr: "145 handlers · withAuth → verifyIdToken · transactions", en: "145 handlers · withAuth → verifyIdToken · transactions" } },
        { name: "Vercel Cron ×4", detail: { fr: "00 h · 08 h · 10 h · 18 h UTC", en: "00:00 · 08:00 · 10:00 · 18:00 UTC" } },
      ],
      link: { fr: "Écrit avec l'Admin SDK · vérifie les tokens · rate limit", en: "Writes with the Admin SDK · verifies tokens · rate limit" },
    },
    {
      id: "data",
      label: { fr: "Données", en: "Data" },
      host: "",
      items: [
        { name: "Cloud Firestore", detail: { fr: "Seule base · écriture client refusée · listeners onSnapshot", en: "Only database · client writes denied · onSnapshot listeners" } },
        { name: "Firebase Auth · Storage", detail: { fr: "Custom tokens, Google · avatars et images de cartes, 5 Mo", en: "Custom tokens, Google · avatars and card images, 5 MB" } },
        { name: "Upstash Redis", detail: { fr: "Rate limit en fenêtre glissante, rien d'autre", en: "Sliding-window rate limit, nothing else" } },
      ],
    },
  ],
  rail: {
    label: "SDK Firebase",
    caption: {
      fr: "SDK Firebase en direct : lectures, onSnapshot, connexion, uploads. Vercel n'est jamais sur ce chemin.",
      en: "Firebase SDK direct: reads, onSnapshot, sign-in, uploads. Vercel is never on this path.",
    },
  },
  services: [
    { name: "Gemini 2.5 Flash", detail: { fr: "Decks IA, distracteurs QCM", en: "AI decks, MCQ distractors" } },
    { name: "Stripe", detail: { fr: "Checkout, portail, webhook", en: "Checkout, portal, webhook" } },
    { name: "Resend", detail: { fr: "Emails transactionnels fr/en", en: "Transactional emails fr/en" } },
    { name: "Web Push · Expo Push", detail: { fr: "VAPID, exp.host, rappels", en: "VAPID, exp.host, reminders" } },
    { name: "Google OAuth · MySSO", detail: { fr: "Google en prod, MySSO en dev", en: "Google in prod, MySSO in dev" } },
    { name: "Sentry", detail: { fr: "Erreurs client, serveur, edge", en: "Client, server, edge errors" } },
    { name: "Vercel Analytics", detail: { fr: "Speed Insights, sans PII", en: "Speed Insights, no PII" } },
  ],
  principles: [
    {
      title: { fr: "Une seule base : Firestore", en: "One database: Firestore" },
      body: { fr: "Pas de SQL, pas de seconde base. Redis ne stocke aucune donnée métier.", en: "No SQL, no second database. Redis holds no business data." },
    },
    {
      title: { fr: "Lecture directe, écriture par l'API", en: "Direct reads, writes through the API" },
      body: {
        fr: "Les clients lisent Firestore via le SDK. Les règles refusent presque toutes les écritures client ; l'API écrit avec l'Admin SDK.",
        en: "Clients read Firestore through the SDK. Rules deny almost every client write; the API writes with the Admin SDK.",
      },
    },
    {
      title: { fr: "Une API pour deux clients", en: "One API for two clients" },
      body: {
        fr: "Le web et l'app mobile appellent les mêmes routes /api/* avec un ID token Firebase en Bearer.",
        en: "Web and mobile call the same /api/* routes with a Firebase ID token as Bearer.",
      },
    },
    {
      title: { fr: "Points et séries en transaction", en: "Points and streaks in transactions" },
      body: {
        fr: "Tout ce qui déplace des points, jetons ou séries tourne dans runTransaction côté serveur.",
        en: "Anything that moves points, tokens or streaks runs in a server-side runTransaction.",
      },
    },
    {
      title: { fr: "Quiz notés côté serveur", en: "Quizzes graded on the server" },
      body: {
        fr: "Les bonnes réponses des QCM restent dans des documents private/ que le client ne peut pas lire.",
        en: "Correct MCQ answers stay in private/ documents the client cannot read.",
      },
    },
    {
      title: { fr: "Temps réel sans serveur dédié", en: "Real time without a dedicated server" },
      body: {
        fr: "Pas de Socket.io ni de Pusher : les listeners Firestore poussent les changements, les fonctions Vercel restent sans état.",
        en: "No Socket.io or Pusher: Firestore listeners push changes, and Vercel functions stay stateless.",
      },
    },
  ],
  leitner: {
    title: { fr: "Moteur de révision · Leitner à 7 boîtes", en: "Review engine · 7-box Leitner" },
    intervals: {
      fr: ["+1 j", "+2 j", "+4 j", "+7 j", "+14 j", "+30 j", "+90 j"],
      en: ["+1 d", "+2 d", "+4 d", "+7 d", "+14 d", "+30 d", "+90 d"],
    },
    note: {
      fr: "Réussite : la carte monte d'une boîte. Échec : retour en boîte 1. Chaque réponse est une écriture serveur (POST /api/review/answer) ; hors ligne, elles attendent dans une file locale et repartent au retour du réseau.",
      en: "Correct: the card moves up one box. Wrong: back to box 1. Every answer is a server write (POST /api/review/answer); offline, answers wait in a local queue and are sent when the network returns.",
    },
  },
  notes: [
    {
      title: { fr: "Authentification", en: "Authentication" },
      body: {
        fr: "En production, la connexion se fait uniquement avec Google : popup Firebase sur le web, échange du code côté serveur puis custom token renvoyé par deep link sur mobile. MySSO, mon fournisseur OpenID Connect, est branché en dev et staging (PKCE, vérification JWKS avec jose). Toutes les portes aboutissent au même ID token Firebase, vérifié par chaque route API.",
        en: "In production, sign-in is Google only: Firebase popup on the web, server-side code exchange then a custom token returned by deep link on mobile. MySSO, my OpenID Connect provider, is wired in dev and staging (PKCE, JWKS verification with jose). Every door ends at the same Firebase ID token, verified by every API route.",
      },
    },
  ],
  tables: [
    {
      title: { fr: "Tâches planifiées", en: "Scheduled jobs" },
      head: [{ fr: "UTC", en: "UTC" }, { fr: "Route", en: "Route" }, { fr: "Rôle", en: "Job" }],
      mono: [0, 1],
      rows: [
        ["00:00", "/api/cron/daily", { fr: "Clôt les events, remet à zéro les séries, distribue les boucliers, rétrograde les Pro expirés si un webhook Stripe s'est perdu", en: "Closes events, resets streaks, hands out shields, downgrades expired Pro plans if a Stripe webhook was lost" }],
        ["08:00", "/api/cron/remind", { fr: "Push web et Expo aux utilisateurs qui ont des cartes à réviser", en: "Web and Expo push to users with cards due" }],
        ["10:00", "/api/cron/daily-quiz", { fr: "Clôt le quiz de la veille, génère le QCM du jour en un seul appel Gemini groupé", en: "Closes yesterday's quiz, builds today's MCQ in one batched Gemini call" }],
        ["18:00", "/api/cron/streak-reminder", { fr: "Rappel aux joueurs dont la série est en jeu", en: "Reminder to players whose streak is at stake" }],
      ],
    },
  ],
  pipeline: {
    stages: [
      { branch: "feature/*", target: { fr: "Émulateurs locaux", en: "Local emulators" } },
      { branch: "dev", target: { fr: "Vercel · Firebase staging", en: "Vercel · Firebase staging" } },
      { branch: "staging", target: { fr: "Pré-production", en: "Pre-production" } },
      { branch: "main", target: { fr: "Vercel Production · Firebase prod", en: "Vercel Production · Firebase prod" } },
    ],
    checks: {
      fr: "Chaque PR passe la CI GitHub Actions : lint, Vitest, build et Playwright E2E contre les émulateurs Firebase. Aucune branche ne saute d'étape, correctifs urgents compris. Mobile : EAS Build et EAS Submit. Renovate tient les dépendances à jour.",
      en: "Every PR runs GitHub Actions CI: lint, Vitest, build and Playwright E2E against the Firebase emulators. No branch skips a stage, hotfixes included. Mobile: EAS Build and EAS Submit. Renovate keeps dependencies current.",
    },
  },
  inventory: [
    {
      group: { fr: "Web", en: "Web" },
      rows: [
        { tech: "Next.js (App Router, Turbopack)", version: "16.3", role: { fr: "Pages RSC/SSR, routes API, middleware", en: "RSC/SSR pages, API routes, middleware" } },
        { tech: "React", version: "19", role: { fr: "Interface web", en: "Web UI" } },
        { tech: "TypeScript", version: "6.0", role: { fr: "Web, API et mobile", en: "Web, API and mobile" } },
        { tech: "Tailwind CSS", version: "4", role: { fr: "Styles, thème par variables CSS", en: "Styling, CSS-variable theming" } },
        { tech: "Firebase JS SDK", version: "12", role: { fr: "Auth, Firestore (IndexedDB), Storage", en: "Auth, Firestore (IndexedDB), Storage" } },
      ],
    },
    {
      group: { fr: "Mobile", en: "Mobile" },
      rows: [
        { tech: "Expo SDK · Expo Router", version: "54 · 6", role: { fr: "App iOS et Android", en: "iOS and Android app" } },
        { tech: "React Native", version: "0.81", role: { fr: "Runtime natif", en: "Native runtime" } },
        { tech: "expo-notifications", version: "0.32", role: { fr: "Push via Expo Push API", en: "Push via Expo Push API" } },
        { tech: "EAS Build · EAS Submit", version: "—", role: { fr: "Builds cloud et publication sur les stores", en: "Cloud builds and store submission" } },
      ],
    },
    {
      group: { fr: "Backend et données", en: "Backend and data" },
      rows: [
        { tech: "Vercel Functions + Edge", version: "—", role: { fr: "Routes API et middleware", en: "API routes and middleware" } },
        { tech: "firebase-admin", version: "13", role: { fr: "Écritures Firestore, tokens", en: "Firestore writes, tokens" } },
        { tech: "Cloud Firestore", version: "—", role: { fr: "Base unique, temps réel, règles", en: "Single database, real time, rules" } },
        { tech: "Upstash Redis · @upstash/ratelimit", version: "1.38 · 2.0", role: { fr: "Rate limiting global", en: "Global rate limiting" } },
        { tech: "sql.js · JSZip", version: "1.14 · 3.10", role: { fr: "Import Anki (SQLite en WebAssembly)", en: "Anki import (SQLite in WebAssembly)" } },
      ],
    },
    {
      group: { fr: "Services", en: "Services" },
      rows: [
        { tech: "Google Gemini 2.5 Flash", version: "2.9", role: { fr: "Génération de decks, distracteurs QCM", en: "Deck generation, MCQ distractors" } },
        { tech: "Stripe", version: "22", role: { fr: "Abonnements, boutique, portail", en: "Subscriptions, store, portal" } },
        { tech: "Resend", version: "6", role: { fr: "Emails transactionnels", en: "Transactional emails" } },
        { tech: "Sentry", version: "10", role: { fr: "Erreurs client, serveur, edge", en: "Client, server, edge errors" } },
      ],
    },
    {
      group: { fr: "Qualité", en: "Quality" },
      rows: [
        { tech: "Vitest", version: "4.1", role: { fr: "Tests unitaires et d'intégration", en: "Unit and integration tests" } },
        { tech: "Playwright", version: "1.59", role: { fr: "E2E contre les émulateurs", en: "E2E against emulators" } },
        { tech: "Firebase Emulator Suite", version: "15", role: { fr: "Dev hors ligne et E2E", en: "Offline dev and E2E" } },
        { tech: "GitHub Actions · Renovate", version: "—", role: { fr: "CI, release, dépendances", en: "CI, release, dependencies" } },
      ],
    },
  ],
};
