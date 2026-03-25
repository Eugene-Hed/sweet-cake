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

## Design System — Identité visuelle partagée

Le design system est centralisé dans `packages/shared/src/design/` pour garantir la cohérence visuelle entre toutes les interfaces (mobile, back-office).

### Architecture des fichiers

```
packages/shared/src/design/
├── couleurs.ts       # Palette : primaire (rose), secondaire (doré), accent (caramel), sémantiques, neutres
├── typographie.ts    # Police Inter, 7 niveaux (titre_principal → legende), poids
├── espacements.ts    # Échelle 4px : 2xs(2) → 5xl(80)
├── rayons.ts         # Border-radius : aucun(0) → complet(9999)
├── ombres.ts         # Ombres CSS + React Native (sm → xl)
├── tailles.ts        # Tailles standards : icônes, boutons, champs, avatars
├── themes.ts         # theme_clair (défaut), theme_sombre (prêt)
├── composants.ts     # Specs : boutons, champs, cartes, badges, alertes
└── index.ts          # Barrel export
```

### Palette de couleurs

| Token | Rôle | Couleur par défaut |
|---|---|---|
| `primaire` | Identité de marque | `#E8608A` (rose pâtissier) |
| `secondaire` | Éléments secondaires | `#F5C563` (doré crème) |
| `accent` | Appels à l'action | `#D4883E` (caramel cuivré) |
| `succes` | Succès | `#28A745` |
| `erreur` | Erreurs | `#DC3545` |
| `avertissement` | Avertissements | `#FFC107` |
| `information` | Informations | `#17A2B8` |

### Typographie

Police : **Inter** (Google Fonts). Échelle :

| Niveau | Taille | Poids |
|---|---|---|
| `titre_principal` | 32px | 700 (gras) |
| `titre_secondaire` | 24px | 600 (semi-gras) |
| `sous_titre` | 20px | 600 |
| `texte_corps` | 16px | 400 (normal) |
| `texte_secondaire` | 14px | 400 |
| `texte_bouton` | 14px | 600 |
| `legende` | 12px | 400 |

### Thèmes

- **`theme_clair`** : thème par défaut, activé sur toutes les interfaces
- **`theme_sombre`** : structure prête, valeurs définies, à activer par interface
- Chaque thème respecte l'interface `Theme` avec des couleurs sémantiques (fond, surface, texte, bordure…)

### Convention d'usage

Tous les composants UI **doivent** utiliser les tokens du design system :
```typescript
// ✅ Correct — utiliser les tokens
import { couleurs, theme_clair } from '@sweet-cake/shared';
const fond = theme_clair.couleurs.fond;

// ❌ Incorrect — couleurs en dur
const fond = '#FAFAFA';
```

## Variables d'environnement

Voir `.env.example` pour la liste complète. Les variables critiques :
- `DATABASE_URL` — Connexion MySQL
- `JWT_SECRET` / `JWT_REFRESH_SECRET` — Secrets JWT (à changer en production)
- `BCRYPT_SALT_ROUNDS` — Tours bcrypt (12 en prod, 4 en test pour performance)
