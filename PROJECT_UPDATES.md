# PROJECT_UPDATES.md

Journal des changements du projet **To The Moon**.
Ordre antéchronologique (le plus récent en haut).
Format de chaque entrée : date, auteur, type, résumé, fichiers touchés.

## Légende des types

- feat : nouvelle fonctionnalité
- fix : correction de bug
- refactor : refonte sans changement fonctionnel
- docs : documentation
- chore : maintenance, dépendances, config
- test : ajout ou modification de tests
- style : mise en forme du code ou UI

---

## 2026-05-28 – Hugo – feat (admin)

Page d'administration sécurisée avec système de login.

Fonctionnalités livrées :
- Page de login `/admin/login` : formulaire glassmorphism, validation côté client, spinner de chargement, "Se souvenir de moi", badge DecryptedText CTF.
- Auth sécurisée : HMAC-SHA256 via Web Crypto API (Edge Runtime compatible). Identifiants dans `.env` (mot de passe hashé SHA-256, jamais en clair). Cookie httpOnly `ttm_admin_token`.
- Middleware Next.js : protège toutes les routes `/admin/*` sauf `/admin/login`. Redirection 307 si token absent ou expiré.
- Layout admin : sidebar rétractable avec liens de navigation, header sticky avec avatar admin et bouton de déconnexion.
- Dashboard complet (client component) :
  - 4 KPI cards SpotlightCard + CountUp animé (parties, complétion, temps moyen, satisfaction)
  - Graphique courbe d'activité (14 jours, mock data → brancher sur /api/admin/activity)
  - Graphique barres tentatives par énigme (données réelles via /api/admin/stats)
  - Graphique donut satisfaction (données réelles via /api/admin/stats)
  - Mini-leaderboard top 5 (données réelles via /api/leaderboard)
  - Tableau sessions avec recherche, tri 3 colonnes, pagination (données réelles via nouvelle API /api/admin/sessions)
  - Zone de danger "Reset" avec confirmation
- Déconnexion : API POST /api/admin/logout efface le cookie, redirige vers /login.

Dépendances ajoutées :
- `recharts` (graphiques SVG)

Nouvelles API routes :
- POST `/api/admin/login` – validation credentials + cookie
- POST `/api/admin/logout` – effacement cookie
- GET `/api/admin/verify` – vérification token
- GET `/api/admin/sessions` – liste paginée/filtrée des sessions

Identifiants par défaut :
- Username : `admin`
- Password : `moonadmin2026` (à changer en prod via ADMIN_PASSWORD_HASH dans .env)

Fichiers touchés :
- `middleware.ts` – protection routes admin
- `lib/adminAuth.ts` – auth Web Crypto
- `app/api/admin/login|logout|verify|sessions/` – nouvelles routes
- `app/admin/login/page.tsx` – page login
- `app/admin/layout.tsx` – layout avec sidebar
- `app/admin/page.tsx` – dashboard complet
- `hooks/useAdminAuth.ts` – hook auth
- `components/admin/` – AdminSidebar, AdminHeader, StatCard, MiniLeaderboard, charts/
- `.env` – ADMIN_USERNAME, ADMIN_PASSWORD_HASH, ADMIN_TOKEN_SECRET

---

## 2026-05-28 – Hugo – feat

Refonte complète de la landing page avec ReactBits et motion/ogl.

Fonctionnalités livrées :
- NavBar fixe avec glassmorphism au scroll, liens de navigation et CTA.
- HeroSection : background Particles WebGL (ogl), titre BlurText animé, sous-titre ShinyText, badge DecryptedText, deux CTA, scroll indicator. Chargement différé (next/dynamic ssr: false) pour le WebGL.
- StartSection : formulaire de démarrage de session avec SpotlightCard, design "mission briefing", gestion d'erreur et état de chargement.
- LeaderboardSection : podium top 3 avec glassmorphism et bordures colorées (or/argent/bronze), liste positions 4-10 avec animation au scroll, mock data 10 joueurs.
- HowItWorksSection : 3 SpotlightCards étapes, design cohérent avec la palette spatiale.
- StatsSection : 4 blocs CountUp animés (parties, équipes, complétion, satisfaction).
- Footer : navigation, liens, crédits équipe.

Composants ReactBits intégrés (sources copiées dans le projet) :
- `components/ui/Particles.tsx` – WebGL via ogl
- `components/ui/BlurText.tsx` – animation motion/react
- `components/ui/ShinyText.tsx` – animation motion/react
- `components/ui/CountUp.tsx` – compteur motion/react
- `components/ui/SpotlightCard.tsx` – spotlight interactif
- `components/ui/DecryptedText.tsx` – révélation CTF (custom)

Dépendances ajoutées :
- `motion` v12.40.0 (framer-motion v11+, import `motion/react`)
- `ogl` v1.0.11 (WebGL léger pour Particles)

Choix techniques :
- `app/page.tsx` reste un Server Component, chaque section est un Client Component indépendant.
- Math.random() pour le numéro de mission géré via useEffect (pas de hydration mismatch).
- Bundle landing page : 158 KB first load JS (sous la limite de 500 KB gzip).

Fichiers touchés :
- `app/page.tsx` – refonte totale
- `app/globals.css` – ajout scroll-behavior, canvas reset, .blur-text gap
- `components/ui/` – 6 nouveaux composants
- `components/home/` – 7 nouvelles sections
- `package.json`, `package-lock.json` – motion + ogl

---

## 2026-05-21 – Hugo – feat

Initialisation complète du projet Next.js 15 avec Prisma, SQLite et structure CTF.

Fonctionnalités livrées :
- Landing page avec saisie du pseudo/équipe et création de session en base.
- Flux de jeu : 3 énigmes (morse, binaire, César) avec indices progressifs et pénalités.
- Chronomètre global + penaltyMs cumulé, sauvegardé dans localStorage.
- Page de victoire avec mini-questionnaire de satisfaction (note + difficulté + commentaire).
- Leaderboard (rendu serveur) trié par temps.
- Page admin avec stats (parties, taux de complétion, temps moyen, tentatives par énigme) et bouton reset.
- 7 routes API REST : sessions CRUD, tentatives, complétion, questionnaire, leaderboard, stats, reset.
- Thème spatial offline-first : fond étoilé CSS, palette espace, polices système.

Choix techniques notables :
- Prisma v7 avec `prisma-client-js` + adapter `@prisma/adapter-libsql` (requis par Prisma v7).
- `datasourceUrl` via `DATABASE_URL` env var ; `prisma.config.ts` pour le CLI.
- Mode standalone Next.js (`output: 'standalone'`) pour Docker.

Fichiers touchés :
- `app/` – layout, page, game/*, victory, leaderboard, admin, api/*
- `components/` – StarField, RocketProgress, AdminResetButton
- `hooks/` – useTimer, useGameProgress
- `lib/` – db, storage, utils, puzzles/types, puzzles/index
- `prisma/schema.prisma`
- `prisma.config.ts`, `.env`
- `next.config.ts`, `package.json`
- `Dockerfile`, `docker-compose.yml`, `docker-entrypoint.sh`, `.dockerignore`

Prochaines étapes :
- Affiner les 3 énigmes (contenu, images, difficulté).
- Ajouter les sons d'ambiance dans `/public/sounds/`.
- Tester sur Raspberry Pi 5 (ARM64).
- Configurer le point d'accès Wi-Fi et le QR code.
- Ajouter une page d'intro narrative entre les énigmes.

---

## 2026-05-21 – Hugo – chore

Mise en place de la documentation initiale du projet.

- Création de `CLAUDE.md` (instructions IA et conventions).
- Création de `PROJECT_RULES.md` (équipe, objectifs, critères, risques).
- Création de `PROJECT_UPDATES.md` (ce fichier).
- Création de `PR_REVIEW.md` (checklist de revue de PR).

---

<!--
Template pour les prochaines entrées :

## YYYY-MM-DD – Prénom – type

Résumé en une ou deux phrases.

- Détail 1
- Détail 2

Fichiers touchés :
- chemin/du/fichier
-->
