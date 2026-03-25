// =============================================================================
// Sweet-Cake Design System — Espacements
// =============================================================================

/**
 * Échelle d'espacement basée sur un multiple de 4px.
 * Utilisable pour padding, margin, gap.
 */
export const espacements = {
    /** 2px */
    '2xs': 2,
    /** 4px */
    xs: 4,
    /** 8px */
    sm: 8,
    /** 12px */
    md_sm: 12,
    /** 16px */
    md: 16,
    /** 20px */
    md_lg: 20,
    /** 24px */
    lg: 24,
    /** 32px */
    xl: 32,
    /** 40px */
    '2xl': 40,
    /** 48px */
    '3xl': 48,
    /** 64px */
    '4xl': 64,
    /** 80px */
    '5xl': 80,
} as const;

/** Type utilitaire */
export type EchelleEspacement = keyof typeof espacements;
