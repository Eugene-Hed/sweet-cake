// =============================================================================
// Sweet-Cake Design System — Spécifications des composants
// =============================================================================
// Ce fichier documente les styles de base des composants UI.
// Ce ne sont PAS des composants React/RN, mais des tokens de style
// que chaque interface (mobile, backoffice) utilise pour construire ses composants.
// =============================================================================

import { couleurs } from './couleurs';
import { rayons } from './rayons';
import { espacements } from './espacements';
import { typographie } from './typographie';
import { tailles_boutons, tailles_champs } from './tailles';

// ─── Boutons ─────────────────────────────────────────────────────────────────

export const styles_boutons = {
    primaire: {
        fond: couleurs.primaire.defaut,
        fond_hover: couleurs.primaire.fonce,
        texte: couleurs.blanc,
        rayon: rayons.md,
        hauteur: tailles_boutons.md,
        padding_horizontal: espacements.lg,
        typographie: typographie.texte_bouton,
    },
    secondaire: {
        fond: 'transparent',
        fond_hover: couleurs.primaire.clair + '20',
        texte: couleurs.primaire.defaut,
        bordure: couleurs.primaire.defaut,
        rayon: rayons.md,
        hauteur: tailles_boutons.md,
        padding_horizontal: espacements.lg,
        typographie: typographie.texte_bouton,
    },
    danger: {
        fond: couleurs.erreur.defaut,
        fond_hover: couleurs.erreur.fonce,
        texte: couleurs.blanc,
        rayon: rayons.md,
        hauteur: tailles_boutons.md,
        padding_horizontal: espacements.lg,
        typographie: typographie.texte_bouton,
    },
    fantome: {
        fond: 'transparent',
        fond_hover: couleurs.gris[100],
        texte: couleurs.gris[700],
        rayon: rayons.md,
        hauteur: tailles_boutons.md,
        padding_horizontal: espacements.md,
        typographie: typographie.texte_bouton,
    },
} as const;

// ─── Champs de saisie ────────────────────────────────────────────────────────

export const styles_champs = {
    defaut: {
        fond: couleurs.blanc,
        bordure: couleurs.gris[300],
        bordure_focus: couleurs.primaire.defaut,
        texte: couleurs.gris[900],
        texte_placeholder: couleurs.gris[400],
        rayon: rayons.md,
        hauteur: tailles_champs.md,
        padding_horizontal: espacements.md_sm,
        typographie: typographie.texte_corps,
    },
    erreur: {
        bordure: couleurs.erreur.defaut,
        texte_aide: couleurs.erreur.defaut,
    },
} as const;

// ─── Cartes ──────────────────────────────────────────────────────────────────

export const styles_cartes = {
    defaut: {
        fond: couleurs.blanc,
        rayon: rayons.lg,
        padding: espacements.lg,
        bordure: couleurs.gris[200],
        ombre: 'sm' as const,
    },
    surlignee: {
        fond: couleurs.blanc,
        rayon: rayons.lg,
        padding: espacements.lg,
        bordure: couleurs.primaire.clair,
        ombre: 'md' as const,
    },
} as const;

// ─── Badges ──────────────────────────────────────────────────────────────────

export const styles_badges = {
    primaire: { fond: couleurs.primaire.clair, texte: couleurs.primaire.fonce },
    succes: { fond: couleurs.succes.clair, texte: couleurs.succes.fonce },
    erreur: { fond: couleurs.erreur.clair, texte: couleurs.erreur.fonce },
    avertissement: { fond: couleurs.avertissement.clair, texte: couleurs.avertissement.fonce },
    information: { fond: couleurs.information.clair, texte: couleurs.information.fonce },
    neutre: { fond: couleurs.gris[200], texte: couleurs.gris[700] },
    commun: {
        rayon: rayons.complet,
        padding_horizontal: espacements.sm,
        padding_vertical: espacements['2xs'],
        typographie: typographie.legende,
    },
} as const;

// ─── Messages système / Alertes ──────────────────────────────────────────────

export const styles_messages = {
    succes: { fond: couleurs.succes.clair, bordure: couleurs.succes.defaut, icone_couleur: couleurs.succes.fonce },
    erreur: { fond: couleurs.erreur.clair, bordure: couleurs.erreur.defaut, icone_couleur: couleurs.erreur.fonce },
    avertissement: { fond: couleurs.avertissement.clair, bordure: couleurs.avertissement.defaut, icone_couleur: couleurs.avertissement.fonce },
    information: { fond: couleurs.information.clair, bordure: couleurs.information.defaut, icone_couleur: couleurs.information.fonce },
    commun: {
        rayon: rayons.md,
        padding: espacements.md,
        typographie: typographie.texte_secondaire,
    },
} as const;
