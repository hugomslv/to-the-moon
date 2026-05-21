# CLAUDE.md

Ce fichier guide Claude (et les autres assistants IA) lorsqu'ils travaillent sur le projet **To The Moon**.

## Contexte du projet

To The Moon est un Capture The Flag (CTF) interactif sur le thème de l'espace, conçu pour les portes ouvertes de l'école dans le cadre du module ICT-306. Le jeu tourne entièrement en local sur un Raspberry Pi 5 (point d'accès Wi-Fi), sans connexion internet, et se joue depuis un smartphone.

- Public cible : visiteurs des portes ouvertes (tout âge, niveau informatique variable)
- Durée d'une partie visée : moins de 15 minutes
- Contrainte forte : 100% offline, aucun appel à des CDN ou API externes en production
- Chef de projet : Hugo
- Project Owner : Monsieur Wohlhauser

## Stack technique

- Front + Back : Next.js 15 (App Router) avec TypeScript
- UI : React 19, Tailwind CSS, animations CSS custom
- Stockage : SQLite via Prisma (fichier local sur le Raspberry)
- État côté client : localStorage pour la reprise de partie
- Cible de déploiement : Raspberry Pi 5 sous Linux, mode point d'accès Wi-Fi

## Règles absolues

1. Tout doit fonctionner sans internet une fois l'app installée. Aucune dépendance runtime à un CDN, Google Fonts, analytics, etc. Les polices, images, sons sont servis depuis `/public`.
2. Le poids total du bundle initial doit rester sous 500 KB gzip. Les sons et images sont chargés à la demande.
3. Lire `PROJECT_RULES.md` avant toute modification.
4. Mettre à jour `PROJECT_UPDATES.md` à chaque changement significatif.
5. Documenter toute nouvelle dépendance, variable d'environnement ou page dans le README.
6. Supprimer le code mort et les imports inutilisés à la fin de chaque tâche.
7. Ne jamais inventer d'informations sur le projet. Poser les questions nécessaires.

## Workflow attendu

À chaque tâche, Claude doit :

1. Lire `PROJECT_RULES.md` et `PROJECT_UPDATES.md` pour comprendre l'état actuel.
2. Proposer un plan court avant de coder si la tâche touche à plusieurs fichiers.
3. Coder en respectant les conventions ci-dessous.
4. Mettre à jour `PROJECT_UPDATES.md` avec un résumé daté.
5. Fournir un compte rendu détaillé des changements en fin de réponse.

## Conventions de code

- TypeScript strict, pas de `any` sans justification.
- Composants React fonctionnels avec hooks.
- Nommage : `PascalCase` pour les composants, `camelCase` pour les fonctions et variables, `SCREAMING_SNAKE_CASE` pour les constantes.
- Un composant par fichier, fichier nommé comme le composant.
- Pas de logique métier dans les composants UI : extraire dans `lib/` ou `hooks/`.
- Pas de styles inline sauf cas dynamique ; utiliser Tailwind ou CSS modules.
- Les énigmes sont définies dans `lib/puzzles/` avec une interface commune.

## Arborescence cible

```
to-the-moon/
├── app/                    # Routes Next.js (App Router)
│   ├── page.tsx            # Landing (pseudo / nom d'équipe)
│   ├── game/               # Pages de jeu et énigmes
│   ├── victory/            # Page de victoire + questionnaire
│   ├── leaderboard/        # Classement (écran du stand)
│   └── admin/              # Stats, reset session
├── components/             # Composants React réutilisables
├── lib/
│   ├── puzzles/            # Définition des énigmes
│   ├── db.ts               # Client Prisma
│   └── storage.ts          # Helpers localStorage
├── hooks/                  # Hooks custom (timer, progress, etc.)
├── prisma/
│   └── schema.prisma
├── public/
│   ├── sounds/             # Sons d'ambiance (mp3 compressés)
│   └── images/             # Visuels des énigmes
├── PROJECT_RULES.md
├── PROJECT_UPDATES.md
├── PR_REVIEW.md
└── CLAUDE.md
```

## Communication avec Hugo

- Répondre en français.
- Pas de mise en gras dans les réponses.
- Une seule version par réponse, pas de variantes.
- Mettre en évidence les fautes d'orthographe dans les explications.
- Ne jamais inventer ; poser les questions nécessaires.

## Ce que Claude ne doit pas faire

- Ajouter une dépendance externe sans validation.
- Toucher au schéma Prisma sans migration.
- Casser le mode offline (vérifier les imports, fonts, fetch externes).
- Ignorer les conventions de PR (voir `PR_REVIEW.md`).
- Modifier `PROJECT_RULES.md` sans demander.
