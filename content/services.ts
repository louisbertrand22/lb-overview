import type { Localized } from "@/lib/i18n";

/**
 * Services offered, as freelance work. No prices: each project is quoted after a first call.
 * Every `proofs` entry points to a project of this site, and its note only states what that project's page already says.
 */

export type Service = {
  id: string;
  title: Localized;
  lead: Localized;
  includes: Localized<string[]>;
  stack: string[];
  proofs: { slug: string; note: Localized }[];
};

export const services: Service[] = [
  {
    id: "web",
    title: { fr: "Application web", en: "Web application" },
    lead: {
      fr: "Un produit web complet, de la conception à la mise en ligne : interface, API et base de données, hébergé et utilisable.",
      en: "A complete web product, from design to going live: interface, API and database, hosted and ready to use.",
    },
    includes: {
      fr: [
        "Interface en Next.js et TypeScript",
        "API et base de données, Firestore ou PostgreSQL",
        "Déploiement sur Vercel, chaîne dev → staging → production",
        "CI avec lint, tests et E2E à chaque pull request",
      ],
      en: [
        "Interface in Next.js and TypeScript",
        "API and database, Firestore or PostgreSQL",
        "Deployment on Vercel, dev → staging → production pipeline",
        "CI with lint, tests and E2E on every pull request",
      ],
    },
    stack: ["Next.js", "TypeScript", "Firestore", "PostgreSQL", "Vercel"],
    proofs: [
      {
        slug: "magiccards",
        note: { fr: "En production sur magic-cards.fr, avec web, mobile et abonnement Stripe", en: "Live at magic-cards.fr, with web, mobile and a Stripe subscription" },
      },
      {
        slug: "quarto",
        note: { fr: "Jeu en ligne en React et Vite, parties synchronisées par Firebase", en: "Online game in React and Vite, games synced through Firebase" },
      },
    ],
  },
  {
    id: "mobile",
    title: { fr: "Application mobile", en: "Mobile application" },
    lead: {
      fr: "Une application mobile en Expo et React Native, avec une seule base de code pour le mobile et le web.",
      en: "A mobile app in Expo and React Native, with one codebase for mobile and web.",
    },
    includes: {
      fr: [
        "Une base de code pour le mobile et le web avec Expo",
        "Notifications push",
        "Suivi en temps réel : commandes, scores, état d'un service",
        "Espace administrateur pour gérer le contenu",
      ],
      en: [
        "One codebase for mobile and web with Expo",
        "Push notifications",
        "Real-time tracking: orders, scores, the state of a service",
        "Admin area to manage content",
      ],
    },
    stack: ["Expo", "React Native", "Firebase"],
    proofs: [
      {
        slug: "chickenstude",
        note: { fr: "Commande de menus : parcours client, suivi en temps réel, espace administrateur", en: "Menu ordering: customer flow, real-time tracking, admin area" },
      },
      {
        slug: "magiccards",
        note: { fr: "Application Expo qui partage les 145 routes API du site", en: "Expo app sharing the site's 145 API routes" },
      },
    ],
  },
  {
    id: "accounts",
    title: { fr: "Connexion, paiement et temps réel", en: "Sign-in, payments and real time" },
    lead: {
      fr: "Les briques qui font d'un site un produit : comptes utilisateurs, abonnement payant, données qui se mettent à jour en direct.",
      en: "The pieces that turn a site into a product: user accounts, a paid subscription, data that updates live.",
    },
    includes: {
      fr: [
        "Connexion Google ou OpenID Connect avec PKCE",
        "Abonnement payant avec Stripe : checkout, portail client et webhook",
        "Données en temps réel avec Firestore ou Realtime Database",
        "Limitation de débit des API avec Upstash Redis",
      ],
      en: [
        "Google sign-in or OpenID Connect with PKCE",
        "Paid subscription with Stripe: checkout, customer portal and webhook",
        "Real-time data with Firestore or Realtime Database",
        "API rate limiting with Upstash Redis",
      ],
    },
    stack: ["OIDC", "Stripe", "Firebase", "Upstash Redis"],
    proofs: [
      {
        slug: "mysso",
        note: { fr: "Un fournisseur OpenID Connect complet, utilisé par mes propres applications", en: "A full OpenID Connect provider, used by my own applications" },
      },
      {
        slug: "magiccards",
        note: { fr: "Abonnement Pro Stripe, duels en temps réel, notifications push", en: "Stripe Pro subscription, real-time duels, push notifications" },
      },
    ],
  },
];

export const method: { name: Localized; detail: Localized }[] = [
  {
    name: { fr: "Cadrage", en: "Scoping" },
    detail: {
      fr: "On précise le besoin, les utilisateurs et ce que doit faire la première version.",
      en: "We pin down the need, the users and what the first version must do.",
    },
  },
  {
    name: { fr: "Conception", en: "Design" },
    detail: {
      fr: "Les choix d'architecture sont écrits : qui parle à qui, où vivent les données. Chaque produit de ce site a sa fiche Architecture.",
      en: "Architecture choices are written down: who talks to whom, where the data lives. Each product on this site has an Architecture sheet.",
    },
  },
  {
    name: { fr: "Réalisation", en: "Build" },
    detail: {
      fr: "Développement sur une branche dev, validé sur un environnement de staging avant la production, comme sur MagicCards.",
      en: "Development on a dev branch, checked on a staging environment before production, as on MagicCards.",
    },
  },
  {
    name: { fr: "Mise en production", en: "Going live" },
    detail: {
      fr: "Déploiement sur Vercel, avec une CI qui lance lint, tests et E2E à chaque pull request.",
      en: "Deployment on Vercel, with CI running lint, tests and E2E on every pull request.",
    },
  },
];

export const servicesCopy = {
  navLabel: { fr: "Services", en: "Services" },
  title: { fr: "Services", en: "Services" },
  kicker: { fr: "Freelance · micro-entreprise", en: "Freelance · sole proprietorship" },
  statement: {
    fr: "Je conçois et livre des produits web et mobile, de l'architecture à la mise en production",
    en: "I design and ship web and mobile products, from architecture to production",
  },
  intro: {
    fr: "Je prends un produit en charge de bout en bout : conception, développement, déploiement. Chaque prestation ci-dessous s'appuie sur des produits que j'ai déjà mis en ligne.",
    en: "I take a product on end to end: design, development, deployment. Each service below rests on products I have already put online.",
  },
  offersLabel: { fr: "Prestations", en: "Services" },
  includesLabel: { fr: "Inclus", en: "Included" },
  proofLabel: { fr: "Déjà livré", en: "Already shipped" },
  methodLabel: { fr: "Méthode", en: "Method" },
  methodTitle: { fr: "Comment ça se passe", en: "How it works" },
  quoteLabel: { fr: "Devis", en: "Quote" },
  quoteTitle: { fr: "Parlons de votre produit", en: "Let's talk about your product" },
  quoteBody: {
    fr: "Pas de grille de tarifs : chaque projet est chiffré sur devis, après un premier échange pour cerner le besoin.",
    en: "No rate card: each project is quoted after a first call to understand the need.",
  },
  email: { fr: "Demander un devis", en: "Ask for a quote" },
  emailSubject: { fr: "Demande de devis", en: "Quote request" },
  projects: { fr: "Voir les projets", en: "See the projects" },
  description: {
    fr: "Louis Bertrand, développeur freelance : applications web et mobile, connexion, paiement et temps réel, de la conception à la mise en production.",
    en: "Louis Bertrand, freelance developer: web and mobile applications, sign-in, payments and real time, from design to production.",
  },
};
