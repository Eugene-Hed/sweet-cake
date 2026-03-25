// =============================================================================
// Sweet-Cake Design System — Typographie
// =============================================================================

/**
 * Police principale : Inter
 * Moderne, lisible, optimisée pour le web et le mobile.
 * CDN : https://fonts.google.com/specimen/Inter
 */
export const police = {
    principale: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    /** Pour React Native */
    principale_rn: 'Inter',
} as const;

/**
 * Poids de police
 */
export const poids = {
    normal: 400,
    medium: 500,
    semi_gras: 600,
    gras: 700,
} as const;

/**
 * Échelle typographique
 * Chaque niveau définit taille (px), hauteur de ligne et poids.
 */
export const typographie = {
    titre_principal: {
        taille: 32,
        hauteur_ligne: 40,
        poids: poids.gras,
    },
    titre_secondaire: {
        taille: 24,
        hauteur_ligne: 32,
        poids: poids.semi_gras,
    },
    sous_titre: {
        taille: 20,
        hauteur_ligne: 28,
        poids: poids.semi_gras,
    },
    texte_corps: {
        taille: 16,
        hauteur_ligne: 24,
        poids: poids.normal,
    },
    texte_secondaire: {
        taille: 14,
        hauteur_ligne: 20,
        poids: poids.normal,
    },
    texte_bouton: {
        taille: 14,
        hauteur_ligne: 20,
        poids: poids.semi_gras,
    },
    legende: {
        taille: 12,
        hauteur_ligne: 16,
        poids: poids.normal,
    },
} as const;

/** Type utilitaire */
export type NiveauTypographique = keyof typeof typographie;
