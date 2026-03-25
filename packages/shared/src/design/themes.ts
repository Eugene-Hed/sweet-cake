// =============================================================================
// Sweet-Cake Design System — Thèmes
// =============================================================================

import { couleurs } from './couleurs';

/**
 * Interface du thème — chaque thème (clair/sombre) doit respecter cette structure.
 */
export interface Theme {
    nom: string;
    couleurs: {
        primaire: string;
        primaire_clair: string;
        primaire_fonce: string;
        secondaire: string;
        secondaire_clair: string;
        secondaire_fonce: string;
        accent: string;
        accent_clair: string;
        accent_fonce: string;
        succes: string;
        succes_fond: string;
        erreur: string;
        erreur_fond: string;
        avertissement: string;
        avertissement_fond: string;
        information: string;
        information_fond: string;
        fond: string;
        fond_secondaire: string;
        surface: string;
        surface_elevee: string;
        texte_principal: string;
        texte_secondaire: string;
        texte_desactive: string;
        texte_inverse: string;
        bordure: string;
        bordure_legere: string;
        diviseur: string;
    };
}

/**
 * Thème clair — thème par défaut de Sweet-Cake
 */
export const theme_clair: Theme = {
    nom: 'clair',
    couleurs: {
        // Marque
        primaire: couleurs.primaire.defaut,
        primaire_clair: couleurs.primaire.clair,
        primaire_fonce: couleurs.primaire.fonce,
        secondaire: couleurs.secondaire.defaut,
        secondaire_clair: couleurs.secondaire.clair,
        secondaire_fonce: couleurs.secondaire.fonce,
        accent: couleurs.accent.defaut,
        accent_clair: couleurs.accent.clair,
        accent_fonce: couleurs.accent.fonce,

        // Sémantiques
        succes: couleurs.succes.defaut,
        succes_fond: couleurs.succes.clair,
        erreur: couleurs.erreur.defaut,
        erreur_fond: couleurs.erreur.clair,
        avertissement: couleurs.avertissement.defaut,
        avertissement_fond: couleurs.avertissement.clair,
        information: couleurs.information.defaut,
        information_fond: couleurs.information.clair,

        // Surfaces
        fond: couleurs.gris[50],
        fond_secondaire: couleurs.gris[100],
        surface: couleurs.blanc,
        surface_elevee: couleurs.blanc,

        // Textes
        texte_principal: couleurs.gris[900],
        texte_secondaire: couleurs.gris[600],
        texte_desactive: couleurs.gris[400],
        texte_inverse: couleurs.blanc,

        // Bordures
        bordure: couleurs.gris[300],
        bordure_legere: couleurs.gris[200],
        diviseur: couleurs.gris[200],
    },
};

/**
 * Thème sombre — structure prête, à compléter ultérieurement.
 * Décommenter et ajuster les valeurs pour activer le mode sombre.
 */
export const theme_sombre: Theme = {
    nom: 'sombre',
    couleurs: {
        // Marque (variantes plus lumineuses pour fond sombre)
        primaire: couleurs.primaire.clair,
        primaire_clair: '#F8A4C8',
        primaire_fonce: couleurs.primaire.defaut,
        secondaire: couleurs.secondaire.clair,
        secondaire_clair: '#FFF0D4',
        secondaire_fonce: couleurs.secondaire.defaut,
        accent: couleurs.accent.clair,
        accent_clair: '#F5D0A9',
        accent_fonce: couleurs.accent.defaut,

        // Sémantiques
        succes: '#4ADE80',
        succes_fond: '#1A3A2A',
        erreur: '#F87171',
        erreur_fond: '#3A1A1A',
        avertissement: '#FBBF24',
        avertissement_fond: '#3A3018',
        information: '#38BDF8',
        information_fond: '#18293A',

        // Surfaces
        fond: '#0F0F1A',
        fond_secondaire: '#1A1A2E',
        surface: '#242438',
        surface_elevee: '#2E2E48',

        // Textes
        texte_principal: '#F0F0F5',
        texte_secondaire: '#A0A0B8',
        texte_desactive: '#606078',
        texte_inverse: couleurs.gris[900],

        // Bordures
        bordure: '#3A3A50',
        bordure_legere: '#2E2E42',
        diviseur: '#2A2A3E',
    },
};
