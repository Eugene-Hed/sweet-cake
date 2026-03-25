// =============================================================================
// Enums partages — Sweet-Cake
// =============================================================================

export enum RoleUtilisateur {
    CLIENT = 'client',
    ADMINISTRATEUR = 'administrateur',
    GESTIONNAIRE = 'gestionnaire',
    FORMATEUR = 'formateur',
}

export enum StatutCommande {
    EN_ATTENTE = 'en_attente',
    CONFIRMEE = 'confirmee',
    EN_PREPARATION = 'en_preparation',
    PRETE = 'prete',
    TERMINEE = 'terminee',
    ANNULEE = 'annulee',
}

export enum StatutPaiement {
    NON_PAYE = 'non_paye',
    EN_ATTENTE = 'en_attente',
    PAYE = 'paye',
    ANNULE = 'annule',
}

export enum TypeCommande {
    RETRAIT = 'retrait',
    LIVRAISON = 'livraison',
}

export enum StatutAtelier {
    PLANIFIE = 'planifie',
    COMPLET = 'complet',
    TERMINE = 'termine',
    ANNULE = 'annule',
}

export enum StatutReservation {
    EN_ATTENTE = 'en_attente',
    CONFIRMEE = 'confirmee',
    ANNULEE = 'annulee',
}

export enum TypeMouvement {
    ENTREE = 'entree',
    SORTIE = 'sortie',
    AJUSTEMENT = 'ajustement',
}

// Transitions de statut de commande autorisees
export const TRANSITIONS_STATUT_COMMANDE: Record<string, string[]> = {
    [StatutCommande.EN_ATTENTE]: [StatutCommande.CONFIRMEE, StatutCommande.ANNULEE],
    [StatutCommande.CONFIRMEE]: [StatutCommande.EN_PREPARATION, StatutCommande.ANNULEE],
    [StatutCommande.EN_PREPARATION]: [StatutCommande.PRETE],
    [StatutCommande.PRETE]: [StatutCommande.TERMINEE],
    [StatutCommande.TERMINEE]: [],
    [StatutCommande.ANNULEE]: [],
};
