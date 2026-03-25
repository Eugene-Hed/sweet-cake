# 🍰 Sweet-Cake — Backend API

Backend de niveau production pour une plateforme de pâtisserie (vente et ateliers de formation).

## Technologies

| Technologie | Rôle |
|---|---|
| **NestJS** | Framework backend |
| **TypeScript** | Langage |
| **MySQL 8** | Base de données |
| **Prisma** | ORM |
| **Redis** | Cache / sessions |
| **JWT** | Authentification (access + refresh tokens) |
| **Swagger** | Documentation API |
| **Jest / Supertest** | Tests |
| **Docker / Docker Compose** | Conteneurisation |
| **GitHub Actions** | CI/CD |

## Structure du projet

```
sweet-cake/
├── apps/api/src/              # Application API NestJS
│   ├── commun/                # Infrastructure partagée (prisma, redis, i18n, gardes...)
│   └── modules/               # Modules métier
│       ├── authentification/  # Inscription, connexion, jetons
│       ├── utilisateurs/      # Gestion des utilisateurs
│       ├── categories/        # Catégories de produits
│       ├── produits/          # Catalogue produits
│       ├── commandes/         # Commandes et workflow de statut
│       ├── ateliers/          # Ateliers de formation
│       ├── reservations-atelier/ # Réservations (transactionnelles)
│       ├── articles-stock/    # Stock et mouvements
│       ├── tableau-de-bord/   # Résumé administrateur
│       ├── journaux-audit/    # Audit des actions sensibles
│       └── sante/             # Health / readiness checks
├── packages/shared/           # Types et constantes partagés
├── prisma/                    # Schéma, migrations, seed
├── docs/                      # Documentation technique
├── .github/workflows/         # CI/CD GitHub Actions
└── docker-compose.yml         # Services locaux (api, mysql, redis)
```

## Démarrage rapide

### Prérequis
- Node.js >= 20
- npm >= 10
- Docker et Docker Compose

### Installation

```bash
# 1. Cloner et installer
git clone <repo> && cd sweet-cake
cp .env.example .env
npm install

# 2. Démarrer MySQL et Redis
docker compose up mysql redis -d

# 3. Générer Prisma et migrer
npm run prisma:generate
npm run prisma:migrate

# 4. Charger les données de démonstration
npm run prisma:seed

# 5. Démarrer l'API
npm run dev
```

### Avec Docker (tout-en-un)

```bash
cp .env.example .env
docker compose up --build -d
```

## Accès

| Service | URL |
|---|---|
| API | `http://localhost:3000/api/v1` |
| Swagger | `http://localhost:3000/api/docs` |
| Health check | `http://localhost:3000/health` |
| Readiness | `http://localhost:3000/ready` |

## Comptes de démonstration

Mot de passe pour tous : `MotDePasse1`

| Rôle | Email |
|---|---|
| Administrateur | `admin@sweet-cake.fr` |
| Gestionnaire | `sophie@sweet-cake.fr` |
| Formateur | `pierre@sweet-cake.fr` |
| Client 1 | `marie@example.com` |
| Client 2 | `jean@example.com` |

## Endpoints API

### Authentification
| Méthode | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/authentification/inscription` | Inscription client |
| POST | `/api/v1/authentification/connexion` | Connexion |
| POST | `/api/v1/authentification/deconnexion` | Déconnexion |
| POST | `/api/v1/authentification/rafraichir` | Rafraîchir le jeton |
| GET | `/api/v1/authentification/profil` | Profil courant |

### Utilisateurs (admin)
| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/api/v1/utilisateurs` | Lister les utilisateurs |
| GET | `/api/v1/utilisateurs/:id` | Consulter un utilisateur |
| PATCH | `/api/v1/utilisateurs/:id` | Modifier un utilisateur |
| PATCH | `/api/v1/utilisateurs/:id/statut` | Activer/désactiver |

### Catégories, Produits, Commandes, Ateliers, Réservations, Stock
Consultez la documentation Swagger complète à `/api/docs`.

## Stratégie bilingue (i18n)

- **Français** par défaut
- **Anglais** disponible via l'en-tête `Accept-Language: en`
- Repli automatique sur le français si traduction manquante
- Messages d'erreur et messages système traduits
- Fichiers de traduction : `apps/api/src/commun/i18n/traductions/`
- Extensible facilement (ajouter un fichier JSON par langue)

## Sécurité

- JWT access token (15 min) + refresh token (7 jours)
- Rotation des refresh tokens
- Hashage bcrypt (12 tours)
- Politique de mot de passe (min 8 chars, majuscule, minuscule, chiffre)
- Helmet + CORS + Rate limiting
- Validation stricte (class-validator)
- Gardes d'authentification et rôles globales

## Rôles et permissions

| Rôle | Accès |
|---|---|
| `client` | Inscription, commandes, réservations, profil |
| `gestionnaire` | Gestion produits, commandes, stock, ateliers |
| `formateur` | Gestion ateliers |
| `administrateur` | Accès complet + gestion utilisateurs |

## Scripts npm

```bash
npm run dev            # Démarrer en développement
npm run build          # Build production
npm run lint           # Linter
npm run test           # Tests unitaires
npm run test:e2e       # Tests E2E
npm run test:cov       # Couverture de tests
npm run prisma:generate  # Générer le client Prisma
npm run prisma:migrate   # Exécuter les migrations
npm run prisma:seed      # Charger les données de démonstration
npm run prisma:studio    # Interface Prisma Studio
npm run docker:up        # Démarrer Docker Compose
npm run docker:build     # Construire et démarrer
```

## Format des réponses API

### Succès
```json
{
  "succes": true,
  "message": "Opération réussie",
  "donnees": { ... },
  "meta": { "page": 1, "limite": 20, "total": 100, "total_pages": 5 }
}
```

### Erreur
```json
{
  "succes": false,
  "message": "Message d'erreur traduit",
  "code_metier": "IDENTIFIANTS_INVALIDES",
  "details": [{ "champ": "email", "message": "Format invalide" }],
  "horodatage": "2026-03-25T10:00:00.000Z",
  "chemin": "/api/v1/authentification/connexion"
}
```

## Licence

UNLICENSED — Projet de licence professionnelle.
