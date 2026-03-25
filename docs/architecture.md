# Documentation technique — Sweet-Cake API

## Architecture

```
                    ┌──────────────┐
                    │   Client     │
                    │  Mobile/Web  │
                    └──────┬───────┘
                           │ HTTP/HTTPS
                    ┌──────▼───────┐
                    │   API NestJS │
                    │  (port 3000) │
                    └──┬───────┬───┘
                       │       │
              ┌────────▼─┐  ┌─▼────────┐
              │  MySQL 8 │  │  Redis 7  │
              │ (données) │  │ (cache)   │
              └──────────┘  └──────────┘
```

## Modules

### Authentification
- Inscription client avec validation de mot de passe
- Connexion avec génération JWT (access 15min + refresh 7j)
- Rotation des refresh tokens (ancien révoqué à chaque usage)
- Stockage sécurisé : hashage bcrypt du jeton en BDD
- Déconnexion = révocation de tous les refresh tokens

### Commandes
- Workflow de statut strict : `en_attente → confirmee → en_preparation → prete → terminee`
- Annulation possible uniquement depuis `en_attente` ou `confirmee`
- Création transactionnelle avec calcul du total
- Historique complet des changements de statut

### Réservations Atelier
- Contrôle de capacité transactionnel (Prisma $transaction)
- Passage automatique en statut `complet` si capacité atteinte
- Annulation avec libération des places

### Stock
- Mouvements en 3 types : entrée, sortie, ajustement
- Vérification de stock suffisant pour les sorties
- Alertes de stock faible (requête directe MySQL)

## Stratégie i18n

| Aspect | Détail |
|---|---|
| Langues | `fr` (défaut), `en` |
| Détection | En-tête `Accept-Language` ou paramètre `?lang=` |
| Repli | Français si traduction manquante |
| Fichiers | `apps/api/src/commun/i18n/traductions/{fr,en}.json` |
| Extension | Ajouter un fichier JSON + l'enregistrer dans le service |

## Conventions de nommage

| Contexte | Convention | Exemple |
|---|---|---|
| Tables BDD | snake_case français | `lignes_commande` |
| Fichiers | kebab-case français | `articles-stock.service.ts` |
| Classes | PascalCase français | `CommandesService` |
| Routes API | kebab-case français | `/api/v1/articles-stock` |
| Enums | snake_case français | `en_attente`, `confirmee` |

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les variables critiques :
- `DATABASE_URL` — Connexion MySQL
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — Secrets JWT (à changer en production)
- `BCRYPT_SALT_ROUNDS` — Tours bcrypt (12 en prod, 4 en test pour performance)
