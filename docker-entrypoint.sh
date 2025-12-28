#!/bin/sh
set -e

echo "Attente de la base de données..."
until pg_isready -h db -U kiosk -d kiosk; do
  echo "Base de données non prête, attente..."
  sleep 2
done

echo "Base de données prête!"

echo "Exécution des migrations Prisma..."
npx prisma migrate deploy

echo "Seed des questions depuis CSV..."
npx tsx prisma/seed.ts

echo "Seed des sessions de test..."
npx tsx prisma/seed-sessions.ts

echo "Démarrage de l'application..."
exec npm run start
