// =============================================================================
// Sweet-Cake Design System — Palette de couleurs
// =============================================================================

/**
 * Palette de couleurs Sweet-Cake
 * Inspirée du monde de la pâtisserie : tons chauds, gourmands et élégants.
 */
export const couleurs = {
    // --- Couleur primaire (rose pâtissier) ---
    primaire: {
        clair: '#F8A4C8',
        defaut: '#E8608A',
        fonce: '#C43D66',
    },

    // --- Couleur secondaire (doré crème) ---
    secondaire: {
        clair: '#FFF0D4',
        defaut: '#F5C563',
        fonce: '#D4A03A',
    },

    // --- Accent (caramel cuivré) ---
    accent: {
        clair: '#F5D0A9',
        defaut: '#D4883E',
        fonce: '#A86A2E',
    },

    // --- Sémantiques ---
    succes: {
        clair: '#D4EDDA',
        defaut: '#28A745',
        fonce: '#1E7E34',
    },
    erreur: {
        clair: '#F8D7DA',
        defaut: '#DC3545',
        fonce: '#BD2130',
    },
    avertissement: {
        clair: '#FFF3CD',
        defaut: '#FFC107',
        fonce: '#D39E00',
    },
    information: {
        clair: '#D1ECF1',
        defaut: '#17A2B8',
        fonce: '#117A8B',
    },

    // --- Neutres ---
    blanc: '#FFFFFF',
    noir: '#1A1A2E',
    gris: {
        50: '#FAFAFA',
        100: '#F5F5F5',
        200: '#EEEEEE',
        300: '#E0E0E0',
        400: '#BDBDBD',
        500: '#9E9E9E',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
    },
} as const;

/** Type utilitaire pour les clés de couleurs */
export type CouleursPalette = typeof couleurs;
