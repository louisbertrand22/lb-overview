import type { Locale, Localized } from "@/lib/i18n";
import type { Architecture } from "./architecture/types";
import { magiccardsArchitecture } from "./architecture/magiccards";
import { myssoArchitecture } from "./architecture/mysso";
import { sudokuOcrArchitecture } from "./architecture/sudoku-ocr";
import { arclArchitecture } from "./architecture/arcl";

/**
 * Every entry is sourced from louis-bertrand.fr and the live products themselves (checked October 2026).
 * Quarto is the one product hosted on lucho-dev.xyz, kept on request.
 * Copy is kept as close as possible to the original wording.
 */

export type WorldId = "products" | "platform" | "strategy" | "systems";

export type Shot = { src: string; width: number; height: number; alt: Localized; device?: "phone" };

export type Project = {
  slug: string;
  /** Short identifier. UBSI, ARCL, MOAE, SDSI and CNP are the codes used on louis-bertrand.fr */
  code: string;
  title: string;
  world: WorldId;
  tagline: Localized;
  summary: Localized;
  highlights: Localized<string[]>;
  role: Localized;
  context: Localized;
  stack: string[];
  stat?: { value: Localized; label: Localized };
  site?: string;
  repo?: string;
  privateCode?: boolean;
  coldStart?: boolean;
  shots?: Shot[];
  architecture?: Architecture;
};

export const worlds: { id: WorldId; label: Localized; blurb: Localized }[] = [
  {
    id: "products",
    label: { fr: "Produits", en: "Products" },
    blurb: {
      fr: "Applications en ligne, web et mobile, avec leurs propres utilisateurs",
      en: "Live web and mobile apps with their own users",
    },
  },
  {
    id: "platform",
    label: { fr: "Plateforme & Cloud", en: "Platform & Cloud" },
    blurb: {
      fr: "Infrastructures, plateformes internes et chaînes de livraison",
      en: "Infrastructure, internal platforms and delivery pipelines",
    },
  },
  {
    id: "strategy",
    label: { fr: "Stratégie SI", en: "IS Strategy" },
    blurb: {
      fr: "Missions de conseil, schémas directeurs et pilotage",
      en: "Consulting engagements, master plans and project leadership",
    },
  },
  {
    id: "systems",
    label: { fr: "Systèmes & Logiciel", en: "Systems & Software" },
    blurb: {
      fr: "Shells, compilateur et backends écrits au plus près de la machine",
      en: "Shells, a compiler and backends written close to the machine",
    },
  },
];

const shot = (src: string, width: number, height: number, fr: string, en: string): Shot => ({
  src,
  width,
  height,
  alt: { fr, en },
});

export const projects: Project[] = [
  {
    slug: "magiccards",
    code: "MAGIC",
    title: "MagicCards",
    world: "products",
    tagline: {
      fr: "Une app de répétition espacée en production, avec web, mobile et son propre SSO",
      en: "A spaced repetition app in production, with web, mobile and its own SSO",
    },
    summary: {
      fr: "Application de flashcards en production sur magic-cards.fr, fondée sur la répétition espacée (système Leitner à 7 boîtes) : révisions avec cartes 3D, duels en temps réel, quiz chronométrés, séries entre amis, classement, génération de decks par IA (Gemini) et import Anki. Abonnement Pro via Stripe, notifications push, et une application mobile Expo qui partage les 145 routes API du site. Connexion Google en production, et mon propre SSO (MySSO, OIDC/PKCE) en dev et staging.",
      en: "Flashcard app live at magic-cards.fr, built on spaced repetition (7-box Leitner system): 3D card reviews, real-time duels, timed quizzes, friend streaks, a leaderboard, AI deck generation (Gemini) and Anki import. Pro subscription through Stripe, push notifications, and an Expo mobile app sharing the site's 145 API routes. Google sign-in in production, and my own SSO (MySSO, OIDC/PKCE) in dev and staging.",
    },
    highlights: {
      fr: [
        "Système Leitner à 7 boîtes et révisions en cartes 3D",
        "Duels en temps réel, quiz chronométrés, séries entre amis et classement",
        "Génération de decks par IA (Gemini) et import Anki",
        "Firestore comme base unique : lecture directe, écriture uniquement par l'API",
        "Application mobile Expo partageant les routes API du web",
        "Chaîne dev → staging → main avec CI lint, tests et E2E à chaque PR",
      ],
      en: [
        "7-box Leitner system with 3D card reviews",
        "Real-time duels, timed quizzes, friend streaks and a leaderboard",
        "AI deck generation (Gemini) and Anki import",
        "Firestore as the only database: direct reads, writes only through the API",
        "Expo mobile app sharing the web API routes",
        "dev → staging → main pipeline with lint, tests and E2E CI on every PR",
      ],
    },
    role: { fr: "Conception et développement de bout en bout", en: "End-to-end design and development" },
    context: { fr: "Produit personnel en production", en: "Personal product in production" },
    stack: ["Next.js 16", "TypeScript", "Firestore", "Vercel", "Upstash Redis", "Stripe", "Gemini", "Expo"],
    architecture: magiccardsArchitecture,
    site: "https://magic-cards.fr",
    privateCode: true,
    shots: [
      { ...shot("/work/magiccards_m_home.png", 780, 1688, "Accueil mobile de MagicCards : « Apprenez plus vite, oubliez moins »", "MagicCards mobile home: “Learn faster, forget less”"), device: "phone" },
      { ...shot("/work/magiccards_m_dashboard.png", 780, 1688, "Tableau de bord MagicCards sur mobile : révision Leitner, modes de jeu et classement entre amis", "MagicCards dashboard on mobile: Leitner review, game modes and friends leaderboard"), device: "phone" },
      { ...shot("/work/magiccards_m_review.png", 780, 1688, "Révision sur mobile : carte retournée en boîte 5, boutons Raté et Réussi", "Mobile review: flipped card in box 5, Missed and Got it buttons"), device: "phone" },
      { ...shot("/work/magiccards_m_decks.png", 780, 1688, "« Mes Decks » sur mobile : génération IA, import et cartes à réviser par deck", "“My decks” on mobile: AI generation, import and cards due per deck"), device: "phone" },
      { ...shot("/work/magiccards_m_progress.png", 780, 1688, "Progression sur mobile : série, révisions à venir et activité de la semaine", "Progress on mobile: streak, upcoming reviews and weekly activity"), device: "phone" },
      { ...shot("/work/magiccards_m_explore.png", 780, 1688, "Catalogue « Explorer les decks » sur mobile, avec filtres par langue et catégorie", "“Explore decks” catalog on mobile, with language and category filters"), device: "phone" },
    ],
  },
  {
    slug: "mysso",
    code: "MYSSO",
    title: "MySSO",
    world: "products",
    tagline: {
      fr: "Un fournisseur d'identité maison, branché sur mes propres applications",
      en: "A home-built identity provider, wired into my own applications",
    },
    summary: {
      fr: "Implémentation SSO personnalisée avec support OpenID Connect et OAuth2, PKCE, gestion du consentement utilisateur et signature JWT RSA. Il sert de fournisseur OpenID Connect à mes applications : Quarto en production, MagicCards en dev et staging.",
      en: "Custom Single Sign-On implementation with OpenID Connect and OAuth2 support, PKCE, user consent management and RSA JWT signing. It acts as the OpenID Connect provider for my applications: Quarto in production, MagicCards in dev and staging.",
    },
    highlights: {
      fr: [
        "OpenID Connect et OAuth2 avec PKCE",
        "Écran de consentement listant les permissions demandées",
        "Jetons JWT signés en RS256, clé publique sur /jwks.json, refresh tokens en rotation",
        "Tableau de bord : sessions actives, applications autorisées et révocation",
        "Clients réels : Quarto en production, MagicCards en dev et staging",
      ],
      en: [
        "OpenID Connect and OAuth2 with PKCE",
        "Consent screen listing the requested permissions",
        "RS256-signed JWTs, public key on /jwks.json, rotating refresh tokens",
        "Dashboard: active sessions, authorized applications and revocation",
        "Real clients: Quarto in production, MagicCards in dev and staging",
      ],
    },
    role: { fr: "Conception et développement", en: "Design and development" },
    context: { fr: "Projet personnel en production", en: "Personal project in production" },
    stack: ["Express", "TypeScript", "Next.js 16", "PostgreSQL", "Prisma", "OIDC · RS256"],
    architecture: myssoArchitecture,
    site: "https://my-sso.louis-bertrand.fr",
    repo: "https://github.com/louisbertrand22/MySSO",
    shots: [
      shot("/work/mysso_landingpage.png", 1393, 898, "Page d'accueil de MySSO, le système d'authentification unique", "MySSO single sign-on landing page"),
      shot("/work/consent.png", 772, 603, "Écran de consentement de MySSO : Quarto Game demande l'accès au compte (email, openid, profile)", "MySSO consent screen: Quarto Game requests access to the account (email, openid, profile)"),
      shot("/work/sso_1.png", 1496, 912, "Tableau de bord MySSO : informations utilisateur et sessions actives", "MySSO dashboard: user details and active sessions"),
      shot("/work/sso_2.png", 1476, 908, "Tableau de bord MySSO : applications autorisées et révocation des accès", "MySSO dashboard: authorized applications and access revocation"),
    ],
  },
  {
    slug: "sudoku-ocr",
    code: "OCR",
    title: "Sudoku OCR",
    world: "products",
    tagline: {
      fr: "Une photo de grille en entrée, la solution réincrustée en sortie",
      en: "A photo of a grid in, the solution drawn back on it out",
    },
    summary: {
      fr: "Application de vision par ordinateur qui détecte une grille de sudoku dans une photo, la redresse avec OpenCV, lit les chiffres avec un CNN Keras entraîné sur mon propre jeu de données (repli sur Tesseract), résout la grille par backtracking et réincruste la solution sur l'image. Interface Streamlit déployée pour vérifier et corriger la lecture case par case, signaler les conflits et télécharger le résultat, avec tests de bout en bout sur des grilles réelles.",
      en: "Computer vision app that finds a sudoku grid in a photo, straightens it with OpenCV, reads the digits with a Keras CNN trained on my own dataset (Tesseract as fallback), solves the grid by backtracking and draws the solution back onto the image. Deployed Streamlit interface to review and fix the reading cell by cell, flag conflicts and download the result, with end-to-end tests on real grids.",
    },
    highlights: {
      fr: [
        "Détection et redressement de la grille avec OpenCV",
        "CNN Keras entraîné sur un jeu de données maison, repli sur Tesseract",
        "Résolution par backtracking et réincrustation sur la photo",
        "Correction case par case et détection des conflits dans Streamlit",
        "Tests de bout en bout sur des grilles réelles",
      ],
      en: [
        "Grid detection and perspective correction with OpenCV",
        "Keras CNN trained on a custom dataset, Tesseract as fallback",
        "Backtracking solver, solution drawn back onto the photo",
        "Cell-by-cell correction and conflict detection in Streamlit",
        "End-to-end tests on real grids",
      ],
    },
    role: { fr: "Conception et développement", en: "Design and development" },
    context: { fr: "Projet personnel déployé", en: "Deployed personal project" },
    stack: ["Python", "OpenCV", "TensorFlow / Keras", "Streamlit", "pytest"],
    architecture: sudokuOcrArchitecture,
    site: "https://sudoku-ocr.streamlit.app/",
    repo: "https://github.com/louisbertrand22/sudoku-ocr",
    coldStart: true,
    shots: [
      shot("/work/sudokuocr_read.jpg", 1600, 1000, "Interface Streamlit de Sudoku OCR : grille lue par le CNN, modifiable case par case, à côté de la grille redressée annotée", "Sudoku OCR Streamlit interface: grid read by the CNN, editable cell by cell, next to the annotated straightened grid"),
      shot("/work/sudokuocr_conflict.jpg", 1600, 1000, "Sudoku OCR signalant un conflit après une correction manuelle, cases en conflit surlignées en rouge", "Sudoku OCR flagging a conflict after a manual fix, conflicting cells highlighted in red"),
      shot("/work/sudokuocr_solution.jpg", 1600, 1000, "Solution de Sudoku OCR réincrustée sur l'image d'origine, chiffres trouvés en contour", "Sudoku OCR solution drawn back onto the original image, found digits in outline"),
      shot("/work/sudokuocr_detect.jpg", 1600, 1000, "Vue « Détection » de Sudoku OCR : contour de la grille détecté dans l'image d'origine", 'Sudoku OCR "Detection" view: grid outline found in the original image'),
    ],
  },
  {
    slug: "quarto",
    code: "QRTO",
    title: "Quarto",
    world: "products",
    tagline: {
      fr: "Le jeu de stratégie à deux, en ligne, avec connexion via MySSO",
      en: "The two-player strategy game, online, with sign-in through MySSO",
    },
    summary: {
      fr: "Jeu de stratégie abstrait pour deux joueurs : alignez 4 pièces partageant au moins une caractéristique (couleur, forme, taille, surface) pour gagner. Jouable dans le navigateur en local, contre l'IA ou en ligne avec un code de salle. La connexion passe par MySSO en production : un flux OpenID Connect Authorization Code géré côté serveur, du bouton Connexion jusqu'au callback.",
      en: "An abstract strategy game for two players: align 4 pieces sharing at least one attribute (colour, shape, height, surface) to win. Playable in the browser locally, against the AI or online with a room code. Sign-in goes through MySSO in production: a server-side OpenID Connect Authorization Code flow, from the sign-in button to the callback.",
    },
    highlights: {
      fr: [
        "Trois modes : deux joueurs en local, contre l'IA, en ligne avec un code de salle à 6 caractères",
        "Deux règles de victoire : lignes classiques ou carrés 2×2",
        "Parties en ligne synchronisées par Firebase Realtime Database",
        "Connexion via MySSO en production : OpenID Connect, client quarto-app, scopes openid email profile",
        "Open source sous licence MIT",
      ],
      en: [
        "Three modes: two players locally, against the AI, online with a 6-character room code",
        "Two win rules: classic lines or 2×2 squares",
        "Online games synced through Firebase Realtime Database",
        "Sign-in through MySSO in production: OpenID Connect, quarto-app client, openid email profile scopes",
        "Open source under the MIT licence",
      ],
    },
    role: { fr: "Conception et développement", en: "Design and development" },
    context: { fr: "Produit open source en ligne", en: "Live open-source product" },
    stack: ["React", "TypeScript", "Vite", "Tailwind CSS", "Firebase", "MySSO (OIDC)"],
    site: "https://quarto.lucho-dev.xyz",
    repo: "https://github.com/louisbertrand22/Quarto",
    shots: [
      shot("/work/quarto_board.png", 1440, 900, "Partie de Quarto contre l'IA : plateau 4×4 et pièces disponibles", "Quarto game against the AI: 4×4 board and available pieces"),
      shot("/work/quarto_home.png", 1440, 900, "Accueil de Quarto : choix du mode de jeu", "Quarto home: choosing a game mode"),
      shot("/work/quarto_sso.png", 1440, 900, "Page de connexion MySSO ouverte depuis le bouton Connexion de Quarto", "MySSO sign-in page opened from Quarto's sign-in button"),
    ],
  },
  {
    slug: "chickenstude",
    code: "CHKN",
    title: "ChickenStude",
    world: "products",
    tagline: {
      fr: "Le fast-food maison de la famille, en ligne sur web et mobile",
      en: "The family's home-made fast food, online on web and mobile",
    },
    summary: {
      fr: "Application mobile et web de commande de menus poulet, construite avec Expo et Firebase. Les utilisateurs parcourent les menus disponibles, passent commande et gèrent leur profil, tandis que les administrateurs créent et gèrent l'offre de menus.",
      en: "A mobile and web application for ordering chicken menus, built with Expo and Firebase. Users browse available menus, place orders and manage their profiles, while administrators create and manage menu offerings.",
    },
    highlights: {
      fr: [
        "Une base de code pour le mobile et le web avec Expo",
        "Parcours client en trois étapes : choisir son menu, le personnaliser, suivre sa commande",
        "Suivi des commandes en temps réel, en cours et historique",
        "Le chef ouvre et ferme ses menus du jour, avec heure de clôture des commandes",
        "Espace administrateur pour créer et gérer les menus",
      ],
      en: [
        "One codebase for mobile and web with Expo",
        "Three-step customer flow: pick a menu, customise it, track the order",
        "Real-time order tracking, current and history",
        "The chef opens and closes daily menus, with an order cut-off time",
        "Admin area to create and manage menus",
      ],
    },
    role: { fr: "Conception et développement", en: "Design and development" },
    context: { fr: "Produit personnel déployé", en: "Deployed personal product" },
    stack: ["Expo", "React Native", "Firebase"],
    site: "https://chickenstude.louis-bertrand.fr",
    shots: [
      { ...shot("/work/chickenstude_menu.png", 780, 1688, "Fiche d'un menu de ChickenStude : Menu Premium, Burger XXL, commandes fermées par le chef", "ChickenStude menu sheet: Menu Premium, Burger XXL, orders closed by the chef"), device: "phone" },
      { ...shot("/work/chickenstude_carte.png", 780, 1688, "La carte de ChickenStude : menus du jour, filtres ouverts ou tous", "ChickenStude menu board: daily menus, open or all filter"), device: "phone" },
      { ...shot("/work/chickenstude_home.png", 780, 1688, "Accueil connecté de ChickenStude : « On mange quoi ? », cuisine fermée", "ChickenStude signed-in home: “On mange quoi ?”, kitchen closed"), device: "phone" },
      { ...shot("/work/chickenstude_orders.png", 780, 1688, "Suivi des commandes en temps réel dans ChickenStude", "Real-time order tracking in ChickenStude"), device: "phone" },
      { ...shot("/work/chickenstude_login.png", 780, 1688, "Écran de connexion de ChickenStude : « Le fast-food maison de la famille »", "ChickenStude sign-in screen: “Le fast-food maison de la famille”"), device: "phone" },
    ],
  },
  {
    slug: "cloud-native-platform",
    code: "CNP",
    title: "Cloud Native Platform",
    world: "platform",
    tagline: {
      fr: "Une Internal Developer Platform multi-cloud, du namespace à la refacturation FinOps",
      en: "A multi-cloud Internal Developer Platform, from namespace to FinOps chargeback",
    },
    summary: {
      fr: "Conception sur deux semestres d'une Internal Developer Platform : un portail self-service (interface web, CLI et documentation) qui permet aux équipes de créer un projet isolé dans un namespace Kubernetes, de provisionner des services (bases de données, queues, buckets), de déployer en continu avec suivi et rollback via ArgoCD, et de surveiller logs, alertes et coûts. Le socle couvre l'infrastructure multi-cloud (2 clouds publics et 1 cloud privé IaaS), l'identité et les accès (Keycloak, RBAC par namespace), l'observabilité (Prometheus, Grafana) et l'intégration d'agents IA encadrés par une gouvernance dédiée.",
      en: "Two-semester design of an Internal Developer Platform: a self-service portal (web UI, CLI and documentation) that lets teams create an isolated project in a dedicated Kubernetes namespace, provision services (databases, queues, buckets), deploy continuously with tracking and rollback through ArgoCD, and monitor logs, alerts and costs. The foundation spans multi-cloud infrastructure (2 public clouds and 1 private IaaS cloud), identity and access (Keycloak, per-namespace RBAC), observability (Prometheus, Grafana) and AI agents integrated under a dedicated governance model.",
    },
    highlights: {
      fr: [
        "Portail self-service : interface web, CLI et documentation",
        "Un namespace Kubernetes par projet, RBAC via Keycloak",
        "Déploiement continu avec suivi et rollback via ArgoCD",
        "Premier jalon livré sur AWS EKS (Paris), provisionné en Terraform",
        "Modèle FinOps à 3 couches (Base Fixe / Variable Partagé / Variable Dédié) mesuré par namespace",
      ],
      en: [
        "Self-service portal: web UI, CLI and documentation",
        "One Kubernetes namespace per project, RBAC through Keycloak",
        "Continuous deployment with tracking and rollback via ArgoCD",
        "First milestone delivered on AWS EKS (Paris), provisioned with Terraform",
        "3-layer FinOps chargeback model (Fixed Base / Shared Variable / Dedicated Variable) measured per namespace",
      ],
    },
    role: { fr: "Conception et livraison du premier jalon", en: "Design and first milestone delivery" },
    context: { fr: "EPITA, majeure SIGL, projet sur deux semestres", en: "EPITA, SIGL major, two-semester project" },
    stack: ["Platform Engineering", "AWS EKS", "Terraform", "Kubernetes", "Keycloak", "ArgoCD", "Prometheus", "Grafana", "FinOps"],
  },
  {
    slug: "hybrid-cloud",
    code: "ARCL",
    title: "Hybrid Cloud",
    world: "platform",
    tagline: {
      fr: "Les données sur un OpenStack privé, les applis sur AWS, un seul appel pour déployer les deux",
      en: "Data on a private OpenStack, apps on AWS, one call to deploy both",
    },
    summary: {
      fr: "Un cloud privé OpenStack, déployé par Kolla-Ansible sur trois VM Google Cloud, porte les bases PostgreSQL en haute disponibilité avec Patroni. AWS expose les applications derrière un load balancer. Une gateway relie les deux : HAProxy envoie le SQL vers la primaire, et une API FastAPI déploie chaque application des deux côtés avec Terraform, en un appel.",
      en: "An OpenStack private cloud, deployed with Kolla-Ansible on three Google Cloud VMs, holds the PostgreSQL databases, made highly available with Patroni. AWS exposes the applications behind a load balancer. A gateway links the two: HAProxy sends SQL to the primary, and a FastAPI service deploys each application on both sides with Terraform, in one call.",
    },
    highlights: {
      fr: ["OpenStack par Kolla-Ansible sur GCP, applis exposées sur AWS", "PostgreSQL en haute disponibilité : Patroni, etcd, HAProxy sur la primaire", "Terraform sur trois providers, piloté par une API de déploiement"],
      en: ["OpenStack via Kolla-Ansible on GCP, apps exposed on AWS", "Highly available PostgreSQL: Patroni, etcd, HAProxy on the primary", "Terraform across three providers, driven by a deployment API"],
    },
    role: { fr: "Infrastructure et automatisation", en: "Infrastructure and automation" },
    context: { fr: "EPITA, majeure SIGL", en: "EPITA, SIGL major" },
    stack: ["OpenStack", "Kolla-Ansible", "GCP", "AWS", "Terraform", "Patroni", "HAProxy", "WireGuard", "FastAPI"],
    architecture: arclArchitecture,
  },
  {
    slug: "is-urbanisation",
    code: "UBSI",
    title: "IS Urbanisation",
    world: "platform",
    tagline: {
      fr: "Le SI d'une compagnie aérienne reconstruit par 50 personnes, outillé par l'équipe DevOps",
      en: "An airline's information system rebuilt by 50 people, tooled by the DevOps team",
    },
    summary: {
      fr: "Refonte complète du système d'information d'une compagnie aérienne, menée à environ 50 étudiants organisés en équipes applicatives (SAV, Enregistrement, Booking, E-commerce, Fidélité, Suivi de vol et Planification), appuyées par une équipe Socle (infrastructure) et une équipe DevOps, dont je faisais partie. Au sein de l'équipe DevOps, j'ai contribué à l'outillage, aux chaînes CI/CD et aux environnements de déploiement au service de l'ensemble des équipes applicatives.",
      en: "Complete rebuild of an airline's information system, carried out by around 50 students organized into application teams (After-Sales, Check-in, Booking, E-commerce, Loyalty, Flight Tracking and Planning), supported by a Core Infrastructure team and a DevOps team, which I was part of. Within the DevOps team, I contributed to the tooling, CI/CD pipelines and deployment environments serving all the application teams.",
    },
    highlights: {
      fr: ["Sept équipes applicatives, une équipe Socle et une équipe DevOps", "Outillage et templates partagés par toutes les équipes", "Chaînes CI/CD et environnements de déploiement"],
      en: ["Seven application teams, a core infrastructure team and a DevOps team", "Tooling and templates shared by every team", "CI/CD pipelines and deployment environments"],
    },
    role: { fr: "Membre de l'équipe DevOps", en: "DevOps team member" },
    context: { fr: "EPITA, majeure SIGL, simulation d'urbanisation", en: "EPITA, SIGL major, urbanisation simulation" },
    stack: ["DevOps", "CI/CD", "UML", "Template", "Deployment"],
    stat: { value: { fr: "50", en: "50" }, label: { fr: "étudiants mobilisés sur 7 équipes", en: "students across 7 teams" } },
  },
  {
    slug: "devopstest",
    code: "DVOP",
    title: "DevOpsTest",
    world: "platform",
    tagline: {
      fr: "Une application Flask comme banc d'essai de la chaîne DevOps complète",
      en: "A Flask app as a test bench for a complete DevOps chain",
    },
    summary: {
      fr: "Application web Flask démontrant les pratiques DevOps avec la conteneurisation Docker, l'orchestration Kubernetes et un pipeline CI/CD automatisé utilisant GitHub Actions.",
      en: "Flask web application demonstrating DevOps practices with Docker containerization, Kubernetes orchestration, and an automated CI/CD pipeline using GitHub Actions.",
    },
    highlights: {
      fr: ["Conteneurisation Docker", "Orchestration Kubernetes", "Pipeline CI/CD automatisé avec GitHub Actions"],
      en: ["Docker containerization", "Kubernetes orchestration", "Automated CI/CD pipeline with GitHub Actions"],
    },
    role: { fr: "Développement et industrialisation", en: "Development and delivery pipeline" },
    context: { fr: "Projet personnel", en: "Personal project" },
    stack: ["Flask", "Docker", "Kubernetes", "CI/CD"],
    repo: "https://github.com/louisbertrand22/DevOpsTest",
  },
  {
    slug: "hris-transformation",
    code: "MOAE",
    title: "HRIS Transformation",
    world: "strategy",
    tagline: {
      fr: "Une stratégie SIRH sur 3 ans pour un groupe de 12 000 collaborateurs",
      en: "A 3-year HRIS strategy for a 12,000-employee group",
    },
    summary: {
      fr: "Chef de projet d'une équipe de 6 étudiants sur une mission de conseil MOA pour BeBlood, groupe de biologie médicale de 12 000 collaborateurs dans 5 pays européens : élaboration d'une stratégie de transformation du SIRH sur 3 ans, articulée autour d'Oracle HCM, incluant l'analyse des besoins et la modélisation financière (ROI). Ce projet m'a permis de développer mes compétences en pilotage d'équipe projet, en gestion des parties prenantes et en communication avec un décideur DSI en contexte réel.",
      en: "Led a team of 6 students as project manager on a business analysis (MOA) consulting engagement for BeBlood, a medical biology group with 12,000 employees across 5 European countries: a 3-year HRIS transformation strategy built around Oracle HCM, including needs analysis and financial modeling (ROI). This project strengthened my skills in project team leadership, stakeholder management, and communication with a CIO-level decision-maker in a real-world context.",
    },
    highlights: {
      fr: ["Pilotage d'une équipe de 6", "Analyse des besoins et benchmark", "Business case et modélisation du ROI", "Feuille de route sur 3 ans autour d'Oracle HCM", "Échanges avec un décideur DSI"],
      en: ["Led a team of 6", "Needs analysis and benchmark", "Business case and ROI modeling", "3-year roadmap built around Oracle HCM", "Worked with a CIO-level decision-maker"],
    },
    role: { fr: "Chef de projet", en: "Project manager" },
    context: { fr: "EPITA, majeure SIGL, mission pour BeBlood", en: "EPITA, SIGL major, engagement for BeBlood" },
    stack: ["MOA", "Oracle HCM", "Benchmark", "Business Case", "Roadmap"],
    stat: { value: { fr: "12 000", en: "12,000" }, label: { fr: "collaborateurs concernés, 5 pays", en: "employees affected, 5 countries" } },
  },
  {
    slug: "it-master-plan",
    code: "SDSI",
    title: "IT Master Plan",
    world: "strategy",
    tagline: {
      fr: "Le schéma directeur SI d'un groupe logistique en pleine fusion",
      en: "The IT master plan of a logistics group going through a merger",
    },
    summary: {
      fr: "Élaboration du schéma directeur du système d'information d'un groupe logistique dans le cadre d'une fusion : cartographie de l'existant, définition de la cible et estimation des budgets. Le projet a aussi couvert la gestion des risques, avec l'élaboration de plans de continuité d'activité et la mise en conformité avec les standards de cybersécurité et de protection des données (NIS2).",
      en: "Developed the information system master plan for a logistics group as part of a merger: mapping the existing landscape, defining the target architecture, and estimating budgets. The project also covered risk management, with business continuity planning and compliance with cybersecurity and data protection standards (NIS2).",
    },
    highlights: {
      fr: ["Cartographie de l'existant", "Architecture cible et estimation budgétaire", "Plans de continuité d'activité", "Conformité NIS2"],
      en: ["Current landscape mapping", "Target architecture and budget estimates", "Business continuity planning", "NIS2 compliance"],
    },
    role: { fr: "Conseil en architecture SI", en: "IS architecture consulting" },
    context: { fr: "EPITA, majeure SIGL", en: "EPITA, SIGL major" },
    stack: ["Cartographie SI", "Schéma directeur", "Continuité d'activité", "NIS2", "M&A"],
  },
  {
    slug: "tiger-compiler",
    code: "TIGR",
    title: "Tiger Compiler",
    world: "systems",
    tagline: {
      fr: "Une chaîne de compilation modulaire en C++, du lexer à l'AST désucré",
      en: "A modular C++ compiler pipeline, from lexer to desugared AST",
    },
    summary: {
      fr: "Chaîne de compilation modulaire pour le langage Tiger, réalisée en C++ : lexer (Flex), parser (Bison) avec suivi des positions, construction d'un AST typé et désucrage des constructions de haut niveau en formes noyau. L'AST désucré sert de représentation intermédiaire pour les passes suivantes, avec des utilitaires d'affichage de debug et de dumps structurés.",
      en: "Modular compiler pipeline for the Tiger language, built in C++: lexer (Flex), parser (Bison) with tracked locations, typed AST construction, and desugaring of high-level constructs into core forms. The desugared AST doubles as an intermediate representation for further passes, with utilities for debug printing and structured dumps.",
    },
    highlights: {
      fr: ["Lexer Flex et parser Bison avec suivi des positions", "AST typé", "Désucrage en formes noyau, utilisé comme représentation intermédiaire", "Affichage de debug et dumps structurés"],
      en: ["Flex lexer and Bison parser with tracked locations", "Typed AST", "Desugaring into core forms, reused as an intermediate representation", "Debug printing and structured dumps"],
    },
    role: { fr: "Développement", en: "Development" },
    context: { fr: "EPITA, cursus systèmes", en: "EPITA, systems curriculum" },
    stack: ["C++", "Flex", "Bison", "AST", "IR", "Autotools"],
    privateCode: true,
  },
  {
    slug: "42sh",
    code: "42SH",
    title: "42sh",
    world: "systems",
    tagline: {
      fr: "Un shell conforme POSIX écrit en C99",
      en: "A POSIX-compliant shell written in C99",
    },
    summary: {
      fr: "Réimplémentation d'un shell conforme POSIX en C99 dans le cadre du cursus systèmes d'EPITA, avec builtins personnalisés exécutés sans fork/exec, build Autotools et suite de tests complète.",
      en: "POSIX-compliant shell reimplementation in C99 for EPITA's systems programming course, with custom builtins executed without fork/exec, an Autotools build system, and a full test suite.",
    },
    highlights: {
      fr: ["Conformité POSIX", "Builtins exécutés sans fork/exec", "Build Autotools et suite de tests complète"],
      en: ["POSIX compliance", "Builtins executed without fork/exec", "Autotools build and full test suite"],
    },
    role: { fr: "Développement", en: "Development" },
    context: { fr: "EPITA, cursus systèmes", en: "EPITA, systems curriculum" },
    stack: ["C", "Autotools", "POSIX"],
    privateCode: true,
  },
  {
    slug: "minishell-rust",
    code: "MSH",
    title: "MiniShell Rust",
    world: "systems",
    tagline: {
      fr: "Un shell Unix en Rust, pensé pour la sécurité mémoire",
      en: "A Unix shell in Rust, built around memory safety",
    },
    summary: {
      fr: "Réimplémentation d'un shell Unix en Rust, avec pipes, redirections d'entrées/sorties, contrôle des jobs et commandes intégrées, développée en mettant l'accent sur la sécurité mémoire et une gestion d'erreurs idiomatique.",
      en: "Unix shell reimplementation in Rust, featuring pipes, I/O redirections, job control and built-in commands, built with a focus on memory safety and idiomatic error handling.",
    },
    highlights: {
      fr: ["Pipes et redirections d'entrées/sorties", "Contrôle des jobs", "Gestion d'erreurs idiomatique en Rust"],
      en: ["Pipes and I/O redirections", "Job control", "Idiomatic Rust error handling"],
    },
    role: { fr: "Développement", en: "Development" },
    context: { fr: "Projet personnel", en: "Personal project" },
    stack: ["Rust", "POSIX"],
    repo: "https://github.com/louisbertrand22/MiniShell_Rust",
  },
  {
    slug: "footysim",
    code: "FSIM",
    title: "FootySim",
    world: "systems",
    tagline: {
      fr: "Un simulateur de championnat de football en ligne de commande",
      en: "A command-line football championship simulator",
    },
    summary: {
      fr: "Simulateur de championnat de football avec ORM SQLAlchemy et opérations de base de données asynchrones : calendrier, simulation de saison, classement et meilleurs buteurs depuis la ligne de commande.",
      en: "Football championship simulator with SQLAlchemy ORM and async database operations: schedule, season simulation, standings and top scorers from the command line.",
    },
    highlights: {
      fr: ["ORM SQLAlchemy et accès base asynchrone", "Migrations Alembic", "CLI : calendrier, saison, classement, buteurs"],
      en: ["SQLAlchemy ORM with async database access", "Alembic migrations", "CLI: schedule, season, table, top scorers"],
    },
    role: { fr: "Développement", en: "Development" },
    context: { fr: "Projet personnel", en: "Personal project" },
    stack: ["Python", "SQLAlchemy", "Alembic", "CLI"],
    repo: "https://github.com/louisbertrand22/FootySim",
  },
  {
    slug: "footysim-backend",
    code: "FAPI",
    title: "FootySim API",
    world: "systems",
    tagline: {
      fr: "L'API REST asynchrone derrière le simulateur",
      en: "The async REST API behind the simulator",
    },
    summary: {
      fr: "API REST backend construite avec FastAPI et SQLAlchemy asynchrone pour la simulation de championnat de football.",
      en: "REST API backend built with FastAPI and async SQLAlchemy for football championship simulation.",
    },
    highlights: {
      fr: ["FastAPI et SQLAlchemy asynchrone", "Endpoints de classement et de simulation"],
      en: ["FastAPI with async SQLAlchemy", "Standings and simulation endpoints"],
    },
    role: { fr: "Développement", en: "Development" },
    context: { fr: "Projet personnel", en: "Personal project" },
    stack: ["FastAPI", "SQLAlchemy", "Python", "REST API"],
    repo: "https://github.com/louisbertrand22/FootySim-backend",
  },
];

export const featuredSlugs = ["magiccards", "mysso", "quarto", "chickenstude", "sudoku-ocr"] as const;

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);

export const getWorld = (id: WorldId) => worlds.find((w) => w.id === id)!;


export const nextProject = (slug: string) => {
  const i = projects.findIndex((p) => p.slug === slug);
  return projects[(i + 1) % projects.length];
};

export const t = <T,>(value: Localized<T>, locale: Locale): T => value[locale];

export const experiences: {
  company: string;
  role: Localized;
  period: Localized;
  summary: Localized;
}[] = [
  {
    company: "Ministère de l'Éducation nationale",
    role: { fr: "Responsable Sécurité Infrastructure · temps partiel", en: "Infrastructure Security Lead · part-time" },
    period: { fr: "Fév. 2026 – Jan. 2027", en: "Feb. 2026 – Jan. 2027" },
    summary: {
      fr: "Architecture Zero Trust avec Cilium, règles « Default Deny » déployées depuis les templates. GitOps (ArgoCD) et Renovate sur 4 dépôts majeurs : les équipes passent d'audits manuels ponctuels à un contrôle continu de la dette de sécurité.",
      en: 'Zero Trust architecture with Cilium, "Default Deny" rules rolled out from templates. GitOps (ArgoCD) and Renovate on 4 major repositories: teams moved from one-off manual audits to continuous monitoring of security debt.',
    },
  },
  {
    company: "Quanteam · Groupe Rainbow Partners",
    role: { fr: "Développeur Full-Stack · stage", en: "Full-Stack Developer · internship" },
    period: { fr: "Sept. 2025 – Jan. 2026", en: "Sept. 2025 – Jan. 2026" },
    summary: {
      fr: "Conception et développement de bout en bout de Leonard-AI, chatbot interne pour plus de 200 collaborateurs qui automatise les demandes adressées à la paie, aux RH et aux business managers. APIs asynchrones FastAPI et Django, déploiement industrialisé sur Kubernetes.",
      en: "Designed and built Leonard-AI end-to-end, an internal chatbot for 200+ employees that automates requests to payroll, HR and business managers. Async APIs with FastAPI and Django, deployment industrialized on Kubernetes.",
    },
  },
  {
    company: "EPITA",
    role: { fr: "Diplôme d'ingénieur · majeure SIGL", en: "Engineering degree · SIGL major" },
    period: { fr: "Sept. 2022 – Juil. 2027", en: "Sept. 2022 – Jul. 2027" },
    summary: {
      fr: "Systèmes d'Information et Génie Logiciel. Semestre Erasmus à l'Univerzita Hradec Králové (2024). TOEIC 845.",
      en: "Information Systems & Software Engineering. Erasmus semester at Univerzita Hradec Králové (2024). TOEIC 845.",
    },
  },
];

export const stackLoop = [
  "Kubernetes", "Terraform", "ArgoCD", "AWS", "OpenStack", "Cilium", "Keycloak", "Docker", "Helm",
  "TypeScript", "Next.js", "React", "Node.js", "Python", "FastAPI", "Django", "PostgreSQL", "Rust", "C++", "Expo", "Firebase",
];

export type { Locale };

type MapPlatform = { name: string; kind: string; role: Localized };

/**
 * Hero diagram of what actually runs in production. Every wire is checkable:
 * `auth` edges are live OIDC clients of MySSO, `host` edges come from response
 * headers and the architecture docs. Platforms are not projects, so they carry their own copy.
 */
export const systemMap: {
  lanes: { id: string; label: Localized; nodes: string[] }[];
  platforms: Record<string, MapPlatform>;
  /** Hosting of nodes whose platforms are not drawn, to keep wires from crossing a lane */
  hostedOn: Record<string, string>;
  edges: { from: string; to: string; kind: "auth" | "host"; label: string }[];
} = {
  lanes: [
    { id: "identity", label: { fr: "Identité", en: "Identity" }, nodes: ["mysso"] },
    { id: "products", label: { fr: "Produits en ligne", en: "Live products" }, nodes: ["magiccards", "quarto", "chickenstude", "sudoku-ocr"] },
    { id: "platforms", label: { fr: "Hébergement et données", en: "Hosting and data" }, nodes: ["vercel", "firebase", "streamlit"] },
  ],
  platforms: {
    vercel: {
      name: "Vercel",
      kind: "PaaS",
      role: {
        fr: "Héberge MagicCards et Quarto, ainsi que le front de MySSO",
        en: "Hosts MagicCards and Quarto, plus the MySSO frontend",
      },
    },
    firebase: {
      name: "Firebase",
      kind: "BaaS",
      role: {
        fr: "Firestore pour MagicCards, Realtime Database pour Quarto, hébergement et données de ChickenStude",
        en: "Firestore for MagicCards, Realtime Database for Quarto, hosting and data for ChickenStude",
      },
    },
    streamlit: {
      name: "Streamlit Community Cloud",
      kind: "PaaS",
      role: { fr: "Héberge la démo de Sudoku OCR", en: "Hosts the Sudoku OCR demo" },
    },
  },
  hostedOn: { mysso: "Vercel · Render · Supabase" },
  edges: [
    { from: "mysso", to: "magiccards", kind: "auth", label: "OIDC · PKCE · dev/staging" },
    { from: "mysso", to: "quarto", kind: "auth", label: "OIDC · prod" },
    { from: "magiccards", to: "vercel", kind: "host", label: "Next.js" },
    { from: "magiccards", to: "firebase", kind: "host", label: "Firestore" },
    { from: "quarto", to: "vercel", kind: "host", label: "Vite" },
    { from: "quarto", to: "firebase", kind: "host", label: "Realtime Database" },
    { from: "chickenstude", to: "firebase", kind: "host", label: "Hosting" },
    { from: "sudoku-ocr", to: "streamlit", kind: "host", label: "Streamlit" },
  ],
};

export const hobbies: { title: Localized; body: Localized }[] = [
  {
    title: { fr: "Guitare", en: "Guitar" },
    body: {
      fr: "Près de 10 ans de cours au conservatoire : la musique fait partie de mon quotidien.",
      en: "Nearly 10 years of conservatory training: music is part of my daily life.",
    },
  },
  {
    title: { fr: "Course à pied", en: "Running" },
    body: {
      fr: "Je cours régulièrement : un bon moyen de garder le rythme et de me vider la tête.",
      en: "I run regularly: a great way to stay on pace and clear my mind.",
    },
  },
  {
    title: { fr: "Football", en: "Football" },
    body: {
      fr: "Je joue régulièrement entre amis, avec le même esprit d'équipe sur le terrain qu'au travail.",
      en: "I play regularly with friends, with the same team spirit on the pitch as at work.",
    },
  },
  {
    title: { fr: "Formule 1", en: "Formula 1" },
    body: {
      fr: "Grand fan de Red Bull Racing : je ne rate aucun Grand Prix, entre stratégie de course et passion pour la vitesse.",
      en: "A die-hard Red Bull Racing fan: I never miss a Grand Prix, drawn in by race strategy as much as speed.",
    },
  },
];
