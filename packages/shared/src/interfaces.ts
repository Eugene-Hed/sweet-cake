// =============================================================================
// Interfaces partagees — Sweet-Cake
// =============================================================================

/** Format de reponse API uniforme */
export interface ReponseApi<T = unknown> {
    succes: boolean;
    message: string;
    donnees?: T;
    meta?: MetaPagination;
    erreurs?: DetailErreur[];
}

/** Meta-donnees de pagination */
export interface MetaPagination {
    page: number;
    limite: number;
    total: number;
    total_pages: number;
}

/** Detail d'erreur */
export interface DetailErreur {
    champ?: string;
    message: string;
    code?: string;
}

/** Format d'erreur API uniforme */
export interface ReponseErreurApi {
    succes: false;
    message: string;
    code_metier?: string;
    details?: DetailErreur[];
    horodatage: string;
    chemin: string;
}

/** Parametres de pagination */
export interface ParametresPagination {
    page: number;
    limite: number;
    tri?: string;
    ordre?: 'asc' | 'desc';
}

/** Payload du JWT */
export interface PayloadJwt {
    sub: number;
    email: string;
    role: string;
    iat?: number;
    exp?: number;
}

/** Resume du tableau de bord */
export interface ResumeTableauDeBord {
    total_commandes: number;
    total_produits: number;
    total_ateliers: number;
    total_clients: number;
    alertes_stock_faible: number;
    revenus_estimes: number;
    commandes_recentes: unknown[];
}
