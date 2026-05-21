#!/bin/sh
set -e

: "${DATABASE_URL:=file:/app/data/production.db}"
export DATABASE_URL

echo "To The Moon – démarrage du conteneur…"

mkdir -p /app/data

echo "Synchronisation du schéma de base de données…"
node_modules/.bin/prisma db push --skip-generate
echo "Base de données prête."

exec node server.js
