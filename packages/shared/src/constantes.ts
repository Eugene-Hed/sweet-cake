// =============================================================================
// Constantes partagees — Sweet-Cake
// =============================================================================

/** Langues supportees */
export const LANGUES_SUPPORTEES = ['fr', 'en'] as const;
export type LangueSupportee = (typeof LANGUES_SUPPORTEES)[number];
export const LANGUE_PAR_DEFAUT: LangueSupportee = 'fr';

/** Pagination par defaut */
export const PAGINATION_PAR_DEFAUT = {
    PAGE: 1,
    LIMITE: 20,
    LIMITE_MAX: 100,
} as const;

/** Longueurs de mot de passe */
export const MOT_DE_PASSE = {
    LONGUEUR_MIN: 8,
    LONGUEUR_MAX: 128,
} as const;

/** Prefixe API */
export const PREFIXE_API = 'api/v1';
