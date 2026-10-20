export const locales = ["fr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "fr";

export type Localized<T = string> = Record<Locale, T>;

export const hasLocale = (value: string): value is Locale =>
  (locales as readonly string[]).includes(value);

export const otherLocale = (locale: Locale): Locale => (locale === "fr" ? "en" : "fr");

const dictionaries = {
  fr: {
    meta: {
      title: "Louis Bertrand · Chef de projet IT & Architecte SI",
      description:
        "Produits, plateformes et missions de Louis Bertrand, élève ingénieur EPITA (SIGL) : MagicCards, MySSO, ChickenStude, Cloud Native Platform et plus.",
    },
    nav: { home: "Accueil", work: "Projets", contact: "Contact", switchTo: "English", skip: "Aller au contenu" },
    hero: {
      kicker: "Chef de projet IT · Architecte SI",
      statement: "Je relie besoins métier, choix d'architecture et équipes qui livrent",
      location: "Paris · EPITA SIGL",
      availability: "Stage de fin d'études à partir de février 2027",
      cta: "Voir les projets",
      contact: "Me contacter",
      mapTitle: "Schéma directeur",
      mapHint: "Survolez un bloc pour suivre ses liens",
      dependency: "Dépendance réelle",
    },
    manifestoLabel: "Approche",
    manifesto:
      "Du schéma directeur au cluster Kubernetes, je conçois des systèmes que les équipes peuvent exploiter et que les métiers comprennent. Je mène des produits jusqu'en production, et je pilote les projets qui les rendent possibles",
    featured: {
      label: "En production",
      title: "Produits livrés",
      intro: "Hébergés et ouverts au public, de l'authentification maison à l'abonnement Stripe",
      visit: "Ouvrir le produit",
      details: "Fiche projet",
      live: "En ligne",
    },
    index: { label: "Registre", title: "Tous les projets", all: "Parcourir le registre complet", code: "Code", name: "Projet", world: "Univers" },
    path: { label: "Parcours", title: "Expériences" },
    stack: { label: "Outils du quotidien" },
    offDuty: { label: "Hors production", title: "Quand je ne livre pas" },
    contact: {
      label: "Contact",
      title: "Parlons de votre prochain projet",
      body: "Je recherche un stage de fin d'études à partir de février 2027 comme chef de projet IT ou architecte SI.",
      email: "Écrire un email",
      cv: "CV (PDF)",
    },
    work: {
      title: "Projets",
      intro: "Seize réalisations : produits en ligne, plateformes cloud, missions de conseil et logiciels système",
      filterLabel: "Filtrer par univers",
      all: "Tout",
      count: (n: number) => `${n} projet${n > 1 ? "s" : ""}`,
    },
    detail: {
      back: "Tous les projets",
      sheet: "Fiche projet",
      role: "Rôle",
      context: "Contexte",
      stack: "Stack",
      links: "Liens",
      overview: "Vue d'ensemble",
      highlights: "Points clés",
      gallery: "Captures",
      galleryHint: "Survolez ou parcourez au clavier pour agrandir une capture",
      next: "Projet suivant",
      privateCode: "Code source privé, démonstration possible sur demande",
      site: "Produit en ligne",
      code: "Code source",
      coldStart: "Hébergée sur Streamlit Community Cloud : le premier chargement peut prendre jusqu'à une minute",
    },
    arch: {
      label: "Architecture",
      title: "Sous le capot",
      diagram: "Qui parle à qui",
      direct: "Chemin direct",
      services: "Services externes",
      principles: "Principes de conception",
      box: "Boîte",
      learned: "Apprise",
      pipeline: "CI/CD et environnements",
      inventory: "Stack complète",
      inventoryHead: ["Techno", "Version", "Rôle"],
      source: "Document d'architecture complet",
    },
    footer: { rights: "Louis Bertrand", top: "Haut de page" },
    notFound: { title: "Page introuvable", body: "Cette page n'existe pas ou a été déplacée.", back: "Retour à l'accueil" },
  },
  en: {
    meta: {
      title: "Louis Bertrand · IT Project Manager & IS Architect",
      description:
        "Products, platforms and engagements by Louis Bertrand, EPITA engineering student (SIGL): MagicCards, MySSO, ChickenStude, Cloud Native Platform and more.",
    },
    nav: { home: "Home", work: "Work", contact: "Contact", switchTo: "Français", skip: "Skip to content" },
    hero: {
      kicker: "IT Project Manager · IS Architect",
      statement: "I connect business needs, architecture decisions and the teams who deliver them",
      location: "Paris · EPITA SIGL",
      availability: "Final-year internship from February 2027",
      cta: "See the work",
      contact: "Get in touch",
      mapTitle: "System map",
      mapHint: "Hover a block to follow its links",
      dependency: "Real dependency",
    },
    manifestoLabel: "Approach",
    manifesto:
      "From IT master plans to Kubernetes clusters, I design systems that teams can operate and the business can understand. I take products all the way to production, and I lead the projects that make them possible",
    featured: {
      label: "In production",
      title: "Shipped products",
      intro: "Hosted and open to the public, from home-built authentication to Stripe subscriptions",
      visit: "Open the product",
      details: "Project sheet",
      live: "Live",
    },
    index: { label: "Register", title: "Every project", all: "Browse the full register", code: "Code", name: "Project", world: "World" },
    path: { label: "Path", title: "Experience" },
    stack: { label: "Everyday tools" },
    offDuty: { label: "Off duty", title: "When I'm not shipping" },
    contact: {
      label: "Contact",
      title: "Let's talk about your next project",
      body: "I'm looking for a final-year internship starting February 2027 as an IT project manager or information systems architect.",
      email: "Send an email",
      cv: "Resume (PDF)",
    },
    work: {
      title: "Work",
      intro: "Sixteen pieces: live products, cloud platforms, consulting engagements and systems software",
      filterLabel: "Filter by world",
      all: "All",
      count: (n: number) => `${n} project${n > 1 ? "s" : ""}`,
    },
    detail: {
      back: "All work",
      sheet: "Project sheet",
      role: "Role",
      context: "Context",
      stack: "Stack",
      links: "Links",
      overview: "Overview",
      highlights: "Highlights",
      gallery: "Screens",
      galleryHint: "Hover or use the keyboard to enlarge a screen",
      next: "Next project",
      privateCode: "Private source code, demo available on request",
      site: "Live product",
      code: "Source code",
      coldStart: "Hosted on Streamlit Community Cloud: the first load can take up to a minute",
    },
    arch: {
      label: "Architecture",
      title: "Under the hood",
      diagram: "Who talks to whom",
      direct: "Direct path",
      services: "External services",
      principles: "Design principles",
      box: "Box",
      learned: "Learned",
      pipeline: "CI/CD and environments",
      inventory: "Full stack",
      inventoryHead: ["Tech", "Version", "Role"],
      source: "Full architecture document",
    },
    footer: { rights: "Louis Bertrand", top: "Back to top" },
    notFound: { title: "Page not found", body: "This page doesn't exist or has moved.", back: "Back home" },
  },
};

export type Dictionary = (typeof dictionaries)["fr"];

export const getDictionary = (locale: Locale): Dictionary => dictionaries[locale];
