// =============================================================================
// Sweet-Cake Design System — Rayons de bordure
// =============================================================================

/**
 * Rayons (border-radius) standards.
 */
export const rayons = {
    /** 0px — pas de rayon */
    aucun: 0,
    /** 4px — subtil */
    sm: 4,
    /** 8px — standard */
    md: 8,
    /** 12px — arrondi */
    lg: 12,
    /** 16px — très arrondi */
    xl: 16,
    /** 24px — pilule */
    '2xl': 24,
    /** 9999px — cercle complet */
    complet: 9999,
} as const;

/** Type utilitaire */
export type EchelleRayon = keyof typeof rayons;
