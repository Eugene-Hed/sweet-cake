// =============================================================================
// Sweet-Cake Mobile — Thème React Native (bridge design tokens)
// =============================================================================

import { StyleSheet } from 'react-native';
import {
    couleurs,
    typographie,
    espacements,
    rayons,
    ombres,
    police,
    theme_clair,
    theme_sombre,
    type Theme,
} from '@sweet-cake/shared';

// ─── Thème actif (pour l'instant clair, extensible) ──────────────────────────

export let themeActif: Theme = theme_clair;

export const changerTheme = (sombre: boolean) => {
    themeActif = sombre ? theme_sombre : theme_clair;
};

// ─── Raccourcis ──────────────────────────────────────────────────────────────

/** Raccourci vers les couleurs du thème actif */
export const tc = () => themeActif.couleurs;

/** Palette brute (hors thème) */
export { couleurs, typographie, espacements, rayons, ombres, police };

// ─── Helpers de style ────────────────────────────────────────────────────────

/** Crée un texte avec le niveau typographique donné */
export const texteStyle = (niveau: keyof typeof typographie) => ({
    fontFamily: police.principale,
    fontSize: typographie[niveau].taille,
    lineHeight: typographie[niveau].hauteur_ligne,
    fontWeight: String(typographie[niveau].poids) as any,
});

/** Applique une ombre RN */
export const ombreStyle = (niveau: keyof typeof ombres) => ombres[niveau].rn;

// ─── Styles globaux ──────────────────────────────────────────────────────────

export const stylesGlobaux = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: theme_clair.couleurs.fond,
    },
    conteneurPadding: {
        flex: 1,
        backgroundColor: theme_clair.couleurs.fond,
        padding: espacements.md,
    },
    centrer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    ligne: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    ligneEntre: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});
