import type { Architecture } from "./types";

/**
 * Source: MySSO architecture.html, read from the code (main, 71fbb42, v3.4.0, 20 October 2026). Not published.
 * Quarto as a production client was verified on the live login flow. The document's "points d'attention"
 * (known weaknesses of the live service) are deliberately left out of this public page.
 */
export const myssoArchitecture: Architecture = {
  source: {
    note: {
      fr: "Relevé dans le code, branche main, v3.4.0, 20 octobre 2026",
      en: "Read from the code, main branch, v3.4.0, 20 October 2026",
    },
  },
  intro: {
    fr: "Un fournisseur d'identité OAuth 2.0 / OpenID Connect maison. Un backend Express unique émet et vérifie tous les jetons, signés en RS256 avec une clé RSA. Un frontend Next.js porte les écrans que l'utilisateur voit : connexion, consentement, tableau de bord et console d'administration. PostgreSQL, via Prisma, est la seule source de vérité : sessions, codes d'autorisation, consentements et journal d'audit y vivent tous.",
    en: "A home-built OAuth 2.0 / OpenID Connect identity provider. A single Express backend issues and verifies every token, signed RS256 with an RSA key. A Next.js frontend carries the screens users see: sign-in, consent, dashboard and admin console. PostgreSQL, through Prisma, is the only source of truth: sessions, authorization codes, consents and the audit log all live there.",
  },
  facts: [
    { value: "16", label: { fr: "étapes dans le flux code + PKCE", en: "steps in the code + PKCE flow" } },
    { value: "44", label: { fr: "routes API en quatre routeurs", en: "API routes across four routers" } },
    { value: "11", label: { fr: "tables PostgreSQL, toutes autour de User", en: "PostgreSQL tables, all around User" } },
    { value: "16", label: { fr: "pages Next.js, dont 6 d'administration", en: "Next.js pages, 6 of them for admin" } },
    { value: "15 min", label: { fr: "durée de vie d'un access token", en: "access token lifetime" } },
    { value: "60 s", label: { fr: "durée de vie d'un code, usage unique", en: "code lifetime, single use" } },
  ],
  layers: [
    {
      id: "clients",
      label: { fr: "Clients", en: "Clients" },
      host: "",
      items: [
        { name: "Applis clientes OIDC", detail: { fr: "Quarto en production, MagicCards en dev · client_id, PKCE, redirect_uri déclarée", en: "Quarto in production, MagicCards in dev · client_id, PKCE, declared redirect_uri" } },
        { name: "Navigateur", detail: { fr: "Suit les redirections de /authorize · cookies HttpOnly", en: "Follows /authorize redirects · HttpOnly cookies" } },
        { name: "Frontend MySSO", detail: { fr: "Next.js 16 · React 19 · login, consentement, dashboard, admin", en: "Next.js 16 · React 19 · sign-in, consent, dashboard, admin" } },
      ],
      link: { fr: "GET /authorize · POST /token · GET /userinfo · fetch en Bearer ou cookie", en: "GET /authorize · POST /token · GET /userinfo · fetch with Bearer or cookie" },
    },
    {
      id: "middleware",
      label: { fr: "Express · middlewares", en: "Express · middleware" },
      host: "server",
      items: [
        { name: "helmet", detail: { fr: "CSP, HSTS, X-Frame-Options DENY", en: "CSP, HSTS, X-Frame-Options DENY" } },
        { name: "CORS", detail: { fr: "Liste blanche ALLOWED_ORIGINS", en: "ALLOWED_ORIGINS allowlist" } },
        { name: "Rate limit", detail: { fr: "120 req/min, puis limites par route", en: "120 req/min, then per-route limits" } },
        { name: "Parsers", detail: { fr: "Cookies, corps JSON limité à 10 kB", en: "Cookies, JSON body capped at 10 kB" } },
      ],
      link: { fr: "authMiddleware ajouté route par route, requireScope('admin') pour l'admin", en: "authMiddleware added per route, requireScope('admin') for admin" },
    },
    {
      id: "routers",
      label: { fr: "Express · routeurs", en: "Express · routers" },
      host: "server",
      items: [
        { name: "authRoutes", detail: { fr: "/auth/* · /authorize · /token · /userinfo · /jwks.json · découverte", en: "/auth/* · /authorize · /token · /userinfo · /jwks.json · discovery" } },
        { name: "userRoutes", detail: { fr: "Profil, mot de passe, sessions, consentements", en: "Profile, password, sessions, consents" } },
        { name: "adminRoutes", detail: { fr: "Scope admin · comptes, applis, scopes, audit, réglages", en: "Admin scope · accounts, apps, scopes, audit, settings" } },
        { name: "Outils", detail: { fr: "/health avec latence base · Swagger sur /api-docs", en: "/health with DB latency · Swagger on /api-docs" } },
      ],
      link: { fr: "Prisma · JwtService · SecurityLogger · EmailService", en: "Prisma · JwtService · SecurityLogger · EmailService" },
    },
    {
      id: "data",
      label: { fr: "Données et services", en: "Data and services" },
      host: "",
      items: [
        { name: "PostgreSQL", detail: { fr: "Supabase en production · Docker en local · Prisma 6", en: "Supabase in production · Docker locally · Prisma 6" } },
        { name: "Clés RSA 2048", detail: { fr: "Clé publique servie sur /jwks.json", en: "Public key served on /jwks.json" } },
        { name: "Journal d'audit", detail: { fr: "Table AuditLog, lue par la console admin", en: "AuditLog table, read by the admin console" } },
        { name: "SMTP", detail: { fr: "nodemailer, repli sur la console", en: "nodemailer, console fallback" } },
      ],
    },
  ],
  principles: [
    {
      title: { fr: "Un seul émetteur de jetons", en: "A single token issuer" },
      body: { fr: "Seul le backend Express signe des JWT. La clé privée ne le quitte jamais ; la clé publique est publiée sur /jwks.json.", en: "Only the Express backend signs JWTs. The private key never leaves it; the public key is published on /jwks.json." },
    },
    {
      title: { fr: "Un frontend sans logique d'auth", en: "A frontend without auth logic" },
      body: { fr: "Les pages Next.js appellent l'API. Mot de passe, consentement, émission de code : toute décision se prend côté Express.", en: "Next.js pages call the API. Password, consent, code issuance: every decision is made in Express." },
    },
    {
      title: { fr: "Une base, rien en mémoire", en: "One database, nothing in memory" },
      body: { fr: "Codes, refresh tokens, sessions et consentements sont en base. Le serveur est sans état, à part les compteurs de rate limit.", en: "Codes, refresh tokens, sessions and consents live in the database. The server is stateless apart from rate-limit counters." },
    },
    {
      title: { fr: "Des applis clientes déclarées", en: "Declared client apps" },
      body: { fr: "Chaque client a ses redirectUris et ses scopes autorisés. Une redirection hors liste est refusée avant même la connexion.", en: "Each client has its own redirectUris and allowed scopes. An unlisted redirect is refused before sign-in even starts." },
    },
    {
      title: { fr: "Les admins sont un scope", en: "Admins are a scope" },
      body: { fr: "Un utilisateur isAdmin reçoit le scope admin dans son access token ; requireScope('admin') protège tout /admin/*.", en: "An isAdmin user gets the admin scope in their access token; requireScope('admin') guards all of /admin/*." },
    },
    {
      title: { fr: "Tout est tracé", en: "Everything is logged" },
      body: { fr: "Connexions, échecs, émissions de jetons, révocations et actions admin sont écrits dans la table AuditLog.", en: "Sign-ins, failures, token issuance, revocations and admin actions are written to the AuditLog table." },
    },
  ],
  flow: {
    title: { fr: "Flux OpenID Connect · code d'autorisation + PKCE", en: "OpenID Connect flow · authorization code + PKCE" },
    actors: ["App cliente", "Navigateur", "Frontend", "Backend", "PostgreSQL"],
    steps: [
      { from: 0, to: 1, label: { fr: "Redirige vers /authorize", en: "Redirects to /authorize" } },
      { from: 1, to: 3, label: { fr: "GET /authorize · client_id, state, nonce, code_challenge", en: "GET /authorize · client_id, state, nonce, code_challenge" } },
      { from: 3, to: 2, label: { fr: "Pas de session → /login?returnTo", en: "No session → /login?returnTo" } },
      { from: 1, to: 2, label: { fr: "Email et mot de passe", en: "Email and password" } },
      { from: 2, to: 3, label: { fr: "POST /auth/login", en: "POST /auth/login" } },
      { from: 3, to: 4, label: { fr: "Vérification argon2 · création de la Session", en: "argon2 check · Session created" } },
      { from: 3, to: 2, label: { fr: "Cookies HttpOnly + jetons", en: "HttpOnly cookies + tokens" } },
      { from: 1, to: 3, label: { fr: "Retour sur /authorize avec le cookie", en: "Back to /authorize with the cookie" } },
      { from: 3, to: 2, label: { fr: "Pas de consentement → /consent", en: "No consent → /consent" } },
      { from: 1, to: 2, label: { fr: "« Autoriser »", en: "“Allow”" } },
      { from: 2, to: 3, label: { fr: "GET /authorize?approved=true", en: "GET /authorize?approved=true" } },
      { from: 3, to: 4, label: { fr: "UserConsent + AuthCode", en: "UserConsent + AuthCode" } },
      { from: 3, to: 0, label: { fr: "Redirection vers redirect_uri?code&state", en: "Redirect to redirect_uri?code&state" } },
      { from: 0, to: 3, label: { fr: "POST /token · code + code_verifier", en: "POST /token · code + code_verifier" } },
      { from: 3, to: 0, label: { fr: "access_token · refresh_token · id_token", en: "access_token · refresh_token · id_token" } },
      { from: 0, to: 3, label: { fr: "GET /userinfo en Bearer", en: "GET /userinfo with Bearer" } },
    ],
    note: {
      fr: "Un utilisateur déjà connecté saute les étapes 3 à 7, un consentement déjà donné saute 9 à 11. À l'échange, le backend vérifie que le code existe, n'a pas servi, n'a pas expiré et que la redirect_uri est identique, puis contrôle PKCE. L'id_token n'est émis que si le scope openid a été consenti.",
      en: "A signed-in user skips steps 3 to 7, an existing consent skips 9 to 11. On exchange, the backend checks the code exists, is unused and unexpired and that the redirect_uri matches, then verifies PKCE. The id_token is only issued if the openid scope was consented.",
    },
  },
  notes: [
    {
      title: { fr: "Sessions et révocation", en: "Sessions and revocation" },
      body: {
        fr: "Chaque refresh fait tourner le refresh token sur la même Session. Le scope admin est recalculé à chaque refresh, et un compte désactivé est bloqué immédiatement car le middleware relit son état en base. Chaque connexion crée une Session avec IP et user-agent, que l'utilisateur liste et révoque depuis son tableau de bord. Changer son mot de passe ferme toutes les sessions.",
        en: "Every refresh rotates the refresh token on the same Session. The admin scope is recomputed on each refresh, and a disabled account is blocked immediately because the middleware rereads its state from the database. Each sign-in creates a Session with IP and user agent, which users list and revoke from their dashboard. Changing a password closes every session.",
      },
    },
  ],
  tables: [
    {
      title: { fr: "Jetons et durées de vie", en: "Tokens and lifetimes" },
      head: [{ fr: "Jeton", en: "Token" }, { fr: "Format", en: "Format" }, { fr: "Durée", en: "Lifetime" }, { fr: "Côté serveur", en: "Server side" }],
      mono: [2],
      rows: [
        [{ fr: "Access token", en: "Access token" }, "JWT RS256 · sub, email, scope", "15 min", { fr: "Vérifié par signature et compte actif", en: "Verified by signature and active account" }],
        [{ fr: "Refresh token", en: "Refresh token" }, "JWT RS256 · jti", { fr: "90 j", en: "90 d" }, { fr: "Table RefreshToken, rotation à chaque usage", en: "RefreshToken table, rotated on every use" }],
        [{ fr: "ID token", en: "ID token" }, "JWT RS256 · aud, nonce", "1 h", { fr: "Émis seulement avec le scope openid", en: "Only issued with the openid scope" }],
        [{ fr: "Code d'autorisation", en: "Authorization code" }, "UUID v4", "60 s", { fr: "Table AuthCode, supprimé à l'usage", en: "AuthCode table, deleted on use" }],
        [{ fr: "Lien de réinitialisation", en: "Reset link" }, { fr: "Jeton aléatoire", en: "Random token" }, "1 h", { fr: "Usage unique", en: "Single use" }],
        [{ fr: "Lien de vérification", en: "Verification link" }, { fr: "Jeton aléatoire", en: "Random token" }, "24 h", { fr: "Table EmailVerificationToken", en: "EmailVerificationToken table" }],
      ],
    },
    {
      title: { fr: "Scopes", en: "Scopes" },
      head: [{ fr: "Scope", en: "Scope" }, { fr: "Donne accès à", en: "Grants" }],
      mono: [0],
      rows: [
        ["openid", { fr: "Émission de l'id_token", en: "id_token issuance" }],
        ["profile", { fr: "Infos de profil dans /userinfo", en: "Profile info in /userinfo" }],
        ["email", { fr: "Adresse email", en: "Email address" }],
        ["username", { fr: "preferred_username", en: "preferred_username" }],
        ["admin", { fr: "Routes /admin/* · jamais demandé par un client, ajouté au login si isAdmin", en: "/admin/* routes · never requested by a client, added at sign-in when isAdmin" }],
      ],
    },
    {
      title: { fr: "Modèle de données · 11 tables", en: "Data model · 11 tables" },
      head: [{ fr: "Table", en: "Table" }, { fr: "Contenu", en: "Contents" }],
      mono: [0],
      rows: [
        ["User", { fr: "Email, username, hash, isAdmin, isDisabled, emailVerified", en: "Email, username, hash, isAdmin, isDisabled, emailVerified" }],
        ["Session · RefreshToken", { fr: "Sessions avec IP et user-agent, refresh tokens liés", en: "Sessions with IP and user agent, linked refresh tokens" }],
        ["AuthCode", { fr: "Codes de 60 s avec nonce et code_challenge", en: "60-second codes with nonce and code_challenge" }],
        ["UserConsent", { fr: "Scopes accordés, un par utilisateur et par client", en: "Granted scopes, one per user and client" }],
        ["Client", { fr: "clientId public, secret en argon2id, redirectUris, scopes autorisés", en: "Public clientId, argon2id secret, redirectUris, allowed scopes" }],
        ["PasswordResetToken · EmailVerificationToken", { fr: "Liens envoyés par email, suppression en cascade", en: "Emailed links, cascade delete" }],
        ["Scope · AuditLog · SystemSetting", { fr: "Catalogue de scopes, journal d'audit, réglages admin", en: "Scope catalogue, audit log, admin settings" }],
      ],
      note: {
        fr: "AuditLog garde un userId libre, sans clé étrangère, pour survivre à la suppression du compte. Treize migrations Prisma, de novembre 2025 à avril 2026.",
        en: "AuditLog keeps a free userId, with no foreign key, so it survives account deletion. Thirteen Prisma migrations, November 2025 to April 2026.",
      },
    },
    {
      title: { fr: "API · quatre routeurs", en: "API · four routers" },
      head: [{ fr: "Routeur", en: "Router" }, { fr: "Routes", en: "Routes" }, { fr: "Protection", en: "Protection" }],
      mono: [1],
      rows: [
        [{ fr: "Compte", en: "Account" }, "/auth/register · login · refresh · logout · reset · verify", { fr: "Limites par IP, refresh token", en: "Per-IP limits, refresh token" }],
        ["OAuth 2.0 / OIDC", "/authorize · /token · /userinfo · /jwks.json · /.well-known", { fr: "Cookie ou Bearer, public pour la découverte", en: "Cookie or Bearer, public for discovery" }],
        [{ fr: "Utilisateur", en: "User" }, "/user/consents · sessions · profile · password · account", "authMiddleware"],
        [{ fr: "Administration", en: "Administration" }, "/admin/users · clients · scopes · audit-logs · settings", { fr: "Scope admin", en: "Admin scope" }],
      ],
    },
    {
      title: { fr: "Sécurité, couche par couche", en: "Security, layer by layer" },
      head: [{ fr: "Couche", en: "Layer" }, { fr: "Mécanisme", en: "Mechanism" }],
      rows: [
        [{ fr: "En-têtes HTTP", en: "HTTP headers" }, { fr: "helmet : CSP 'self', HSTS un an + preload, X-Frame-Options DENY, nosniff", en: "helmet: CSP 'self', one-year HSTS + preload, X-Frame-Options DENY, nosniff" }],
        [{ fr: "Mots de passe", en: "Passwords" }, { fr: "argon2id, 64 Mo, 3 itérations ; même message pour email inconnu ou mot de passe faux", en: "argon2id, 64 MB, 3 iterations; same message for unknown email or wrong password" }],
        [{ fr: "Secrets clients", en: "Client secrets" }, { fr: "32 octets aléatoires, stockés en argon2id, affichés une seule fois", en: "32 random bytes, stored as argon2id, shown once" }],
        [{ fr: "Jetons", en: "Tokens" }, { fr: "RS256 uniquement, issuer vérifié, refresh à usage unique", en: "RS256 only, issuer checked, single-use refresh" }],
        [{ fr: "Redirections", en: "Redirects" }, { fr: "redirect_uri comparée à la liste déclarée du client", en: "redirect_uri matched against the client's declared list" }],
        [{ fr: "Cookies", en: "Cookies" }, { fr: "HttpOnly, secure en production, SameSite=strict pour le refresh", en: "HttpOnly, secure in production, SameSite=strict for refresh" }],
        [{ fr: "Traçabilité", en: "Audit" }, { fr: "Connexions, échecs, jetons, révocations et actions admin journalisés", en: "Sign-ins, failures, tokens, revocations and admin actions logged" }],
      ],
    },
  ],
  pipeline: {
    stages: [
      { branch: "PR", target: { fr: "CI GitHub Actions", en: "GitHub Actions CI" } },
      { branch: "develop", target: { fr: "Intégration, CI", en: "Integration, CI" } },
      { branch: "main", target: { fr: "Production", en: "Production" } },
    ],
    checks: {
      fr: "La CI tourne sur Node 18 et 20 avec un service Postgres 15 : migrations Prisma, build TypeScript du backend, build Next.js du frontend, puis démarrage du serveur et contrôle de /health.",
      en: "CI runs on Node 18 and 20 with a Postgres 15 service: Prisma migrations, backend TypeScript build, frontend Next.js build, then the server starts and /health is checked.",
    },
  },
  inventory: [
    {
      group: { fr: "Backend", en: "Backend" },
      rows: [
        { tech: "Node.js · TypeScript", version: "18–20 · 5.3", role: { fr: "Runtime et langage", en: "Runtime and language" } },
        { tech: "Express", version: "4.18", role: { fr: "Serveur HTTP et routage", en: "HTTP server and routing" } },
        { tech: "jsonwebtoken", version: "9", role: { fr: "Signature et vérification RS256", en: "RS256 signing and verification" } },
        { tech: "argon2", version: "0.31", role: { fr: "Hash des mots de passe et des secrets", en: "Password and secret hashing" } },
        { tech: "helmet · cors · cookie-parser", version: "8 · 2.8 · 1.4", role: { fr: "En-têtes, CORS, cookies", en: "Headers, CORS, cookies" } },
        { tech: "express-rate-limit", version: "8.3", role: { fr: "Limites de débit", en: "Rate limiting" } },
        { tech: "nodemailer", version: "8", role: { fr: "Emails de vérification et de réinitialisation", en: "Verification and reset emails" } },
        { tech: "swagger-jsdoc · swagger-ui-express", version: "6 · 5", role: { fr: "Documentation d'API", en: "API documentation" } },
      ],
    },
    {
      group: { fr: "Données", en: "Data" },
      rows: [
        { tech: "Prisma", version: "6.19", role: { fr: "ORM, migrations", en: "ORM, migrations" } },
        { tech: "PostgreSQL", version: "15 · 16", role: { fr: "CI et local ; Supabase en production", en: "CI and local; Supabase in production" } },
      ],
    },
    {
      group: { fr: "Frontend", en: "Frontend" },
      rows: [
        { tech: "Next.js (App Router)", version: "16.2", role: { fr: "Connexion, consentement, dashboard, admin", en: "Sign-in, consent, dashboard, admin" } },
        { tech: "React", version: "19.2", role: { fr: "Interface", en: "UI" } },
        { tech: "Tailwind CSS", version: "4", role: { fr: "Styles, thème clair et sombre", en: "Styling, light and dark theme" } },
      ],
    },
    {
      group: { fr: "Infrastructure", en: "Infrastructure" },
      rows: [
        { tech: "Vercel", version: "—", role: { fr: "Frontend my-sso.louis-bertrand.fr", en: "my-sso.louis-bertrand.fr frontend" } },
        { tech: "Render", version: "—", role: { fr: "Backend, selon le dépôt", en: "Backend, per the repository" } },
        { tech: "Supabase", version: "—", role: { fr: "PostgreSQL managé, pooler", en: "Managed PostgreSQL, pooler" } },
        { tech: "GitHub Actions · Docker Compose", version: "—", role: { fr: "CI · Postgres local", en: "CI · local Postgres" } },
      ],
    },
  ],
};
