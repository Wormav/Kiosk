# Kiosk - Formulaire Dynamique ESG/CSRD

Application full-stack permettant de gérer des formulaires dynamiques hiérarchiques pour le reporting ESG/CSRD.

## Démo

![Démo de l'application](doc/img/demo.gif)

## Schéma de la Base de Données

![Schéma de la base de données](doc/img/db.png)

## Stack Technique

- **Frontend**: React 19, React Router 7, Mantine UI, TailwindCSS
- **Backend**: Node.js, React Router (SSR)
- **Base de données**: PostgreSQL 16 + Prisma ORM
- **Conteneurisation**: Docker & Docker Compose

## Structure du Projet

```
Kiosk/
├── app/
│   ├── .server/              # Code serveur uniquement
│   │   ├── db.ts             # Client Prisma
│   │   ├── locale.server.ts  # Gestion des locales (fr/en)
│   │   ├── questions.server.ts # Logique métier questions/réponses
│   │   └── sessions.server.ts  # Gestion des sessions utilisateur
│   ├── components/           # Composants React
│   │   ├── Navbar.tsx        # Barre de navigation
│   │   └── form/             # Composants du formulaire dynamique
│   ├── lib/
│   │   ├── i18n.ts           # Traductions
│   │   └── types.ts          # Types TypeScript partagés
│   ├── routes/
│   │   ├── home.tsx          # Page principale du formulaire
│   │   ├── sessions.tsx      # Liste des sessions sauvegardées
│   │   └── set-locale.tsx    # Changement de langue
│   ├── root.tsx              # Layout racine
│   ├── routes.ts             # Configuration des routes
│   └── app.css               # Styles globaux
├── prisma/
│   ├── schema.prisma         # Schéma de la base de données
│   ├── migrations/           # Migrations Prisma
│   ├── seed.ts               # Import des questions depuis CSV
│   └── seed-sessions.ts      # Données de test
├── questions.csv             # Catalogue de questions source
├── Dockerfile                # Image Docker multi-stage
├── docker-compose.yml        # Orchestration des services
├── docker-entrypoint.sh      # Script de démarrage (migrations + seeds)
└── instruction.md            # Instructions de l'exercice original
```

## Modèle de Données

### Question
- Structure hiérarchique (parent/enfants)
- Types de contenu: `number`, `text`, `enum`, `table`, ou vide (section)
- Labels multilingues (FR/EN)
- Options enum avec traductions

### FormSession
- Représente une session de formulaire utilisateur
- Contient les réponses associées

### Answer
- Réponse à une question dans une session
- Support des lignes de tableau (`rowIndex`, `rowLabel`)

## Lancement avec Docker

### Prérequis
- Docker et Docker Compose installés

### Démarrage

```bash
# Cloner le projet
git clone git@github.com:Wormav/Kiosk.git
cd Kiosk

# Créer le fichier .env (voir section Configuration .env)
cp .env.example .env  # ou créer manuellement

# Lancer l'application
docker compose up --build
```

L'application sera accessible sur **http://localhost:3000**

Le script d'entrée Docker effectue automatiquement :
1. Attente de la disponibilité de PostgreSQL
2. Exécution des migrations Prisma
3. Import des questions depuis `questions.csv`
4. Création de sessions de test
5. Démarrage du serveur

### Arrêt

```bash
docker compose down

# Pour supprimer aussi les données
docker compose down -v
```

## Développement Local

### Prérequis
- Node.js 20+
- PostgreSQL 16 (ou via Docker)

### Installation

```bash
# Installer les dépendances
npm install

# Démarrer PostgreSQL (si pas installé localement)
docker compose up db -d

# Créer le fichier .env (voir section ci-dessous)
cp .env.example .env  # ou créer manuellement

# Appliquer les migrations
npx prisma migrate dev

# Importer les questions
npx prisma db seed

# Lancer en développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

### Scripts disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Serveur de développement avec HMR |
| `npm run build` | Build de production |
| `npm run start` | Démarrer le build de production |
| `npm run typecheck` | Vérification des types TypeScript |

## Configuration .env

Créer un fichier `.env` à la racine du projet :

```env
# Connexion PostgreSQL
DATABASE_URL="postgresql://kiosk:kiosk@localhost:5432/kiosk"
```

### Variables d'environnement

| Variable | Description | Valeur par défaut |
|----------|-------------|-------------------|
| `DATABASE_URL` | URL de connexion PostgreSQL | `postgresql://kiosk:kiosk@localhost:5432/kiosk` |
| `NODE_ENV` | Environnement (`development` / `production`) | `development` |

## Fonctionnalités

- Formulaire dynamique avec questions imbriquées (profondeur illimitée)
- Support des tableaux avec lignes dynamiques
- Types de champs: texte, nombre, sélection (enum)
- Interface bilingue (Francais/Anglais)
- Sauvegarde automatique des réponses
- Gestion des sessions multiples
- Persistance des données en base PostgreSQL
