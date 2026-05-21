# To The Moon

CTF spatial interactif pour les portes ouvertes de l'école – module ICT-306.

Fonctionne **100% offline** sur Raspberry Pi 5 (point d'accès Wi-Fi).
Les joueurs se connectent depuis leur smartphone et résolvent 3 énigmes spatiales.

---

## Stack

- **Next.js 15** (App Router, TypeScript, Tailwind CSS)
- **Prisma v7** + SQLite via `@prisma/adapter-libsql`
- Stockage de session côté client : `localStorage`
- Cible de déploiement : Raspberry Pi 5 (ARM64, Linux)

---

## Démarrage en développement

```bash
npm install
npm run db:push      # créer/mettre à jour la base SQLite
npm run dev          # http://localhost:3000
```

Variables d'environnement (fichier `.env`) :
```
DATABASE_URL="file:./dev.db"
```

---

## Scripts disponibles

| Commande          | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Serveur de développement (Turbopack)     |
| `npm run build`   | Build de production                      |
| `npm run start`   | Lancer le build de production            |
| `npm run lint`    | ESLint                                   |
| `npm run db:push` | Pousser le schéma Prisma sur la DB       |
| `npm run db:migrate` | Créer une migration Prisma            |
| `npm run db:studio` | Ouvrir Prisma Studio                  |

---

## Déploiement Docker (Raspberry Pi)

### Prérequis

- Docker et Docker Compose installés sur le Raspberry Pi
- L'image peut être construite sur un PC puis transférée

### Construire et lancer

```bash
# Construire l'image
docker compose build

# Lancer (en arrière-plan)
docker compose up -d

# Voir les logs
docker compose logs -f

# Arrêter
docker compose down
```

L'application sera accessible sur le port **3000**.
La base de données SQLite est persistée dans un volume Docker (`db-data`).

### Transférer l'image vers le Raspberry Pi

```bash
# Sur le PC de build (AMD64 → ARM64)
docker buildx build --platform linux/arm64 -t to-the-moon:latest --load .
docker save to-the-moon:latest | gzip > to-the-moon.tar.gz

# Sur le Raspberry Pi
docker load < to-the-moon.tar.gz
docker compose up -d
```

---

## Pages

| Route            | Description                                   | Rendu   |
| ---------------- | --------------------------------------------- | ------- |
| `/`              | Landing : saisie du pseudo / équipe           | Client  |
| `/game/[id]`     | Énigme en cours                               | Serveur |
| `/victory`       | Félicitations + questionnaire de satisfaction | Client  |
| `/leaderboard`   | Classement (affiché sur l'écran du stand)     | Serveur |
| `/admin`         | Stats + reset (accès restreint au stand)      | Serveur |

## Routes API

| Méthode | Route                              | Description                  |
| ------- | ---------------------------------- | ---------------------------- |
| POST    | `/api/sessions`                    | Créer une session            |
| POST    | `/api/sessions/[id]/attempt`       | Enregistrer une tentative    |
| POST    | `/api/sessions/[id]/complete`      | Terminer une session         |
| POST    | `/api/sessions/[id]/survey`        | Sauvegarder le questionnaire |
| GET     | `/api/leaderboard`                 | Classement JSON              |
| GET     | `/api/admin/stats`                 | Statistiques JSON            |
| POST    | `/api/admin/reset`                 | Supprimer toutes les sessions|

---

## Arborescence

```
to-the-moon/
├── app/                    # Routes Next.js (App Router)
│   ├── page.tsx            # Landing
│   ├── game/[puzzleId]/    # Énigme
│   ├── victory/            # Victoire + questionnaire
│   ├── leaderboard/        # Classement
│   ├── admin/              # Stats, reset
│   └── api/                # Routes API
├── components/             # Composants réutilisables
├── hooks/                  # Hooks custom (timer, progress)
├── lib/
│   ├── db.ts               # Client Prisma (singleton)
│   ├── storage.ts          # Helpers localStorage
│   ├── utils.ts            # Fonctions utilitaires
│   └── puzzles/            # Définition des énigmes
├── prisma/
│   └── schema.prisma
├── public/
│   ├── sounds/             # Sons d'ambiance (à ajouter)
│   └── images/             # Visuels des énigmes (à ajouter)
├── Dockerfile
├── docker-compose.yml
├── docker-entrypoint.sh
└── prisma.config.ts
```
