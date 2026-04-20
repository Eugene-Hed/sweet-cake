// =============================================================================
// Composant Badge — Étiquette de statut
// =============================================================================

interface PropsBadge {
  variante?: 'primaire' | 'succes' | 'erreur' | 'avertissement' | 'information' | 'neutre';
  children: React.ReactNode;
}

/** Mapping des statuts vers des variantes de badge */
export const varianteStatutCommande: Record<string, PropsBadge['variante']> = {
  en_attente: 'avertissement',
  confirmee: 'information',
  en_preparation: 'primaire',
  prete: 'succes',
  terminee: 'succes',
  livree: 'succes',
  annulee: 'erreur',
};

export const varianteStatutAtelier: Record<string, PropsBadge['variante']> = {
  planifie: 'information',
  complet: 'avertissement',
  termine: 'succes',
  annule: 'erreur',
};

export const varianteStatutReservation: Record<string, PropsBadge['variante']> = {
  en_attente: 'avertissement',
  confirmee: 'succes',
  annulee: 'erreur',
};

/** Labels lisibles pour les statuts */
export const labelStatut: Record<string, string> = {
  en_attente: 'En attente',
  confirmee: 'Confirmée',
  en_preparation: 'En préparation',
  prete: 'Prête',
  terminee: 'Terminée',
  livree: 'Livrée',
  annulee: 'Annulée',
  planifie: 'Planifié',
  complet: 'Complet',
  termine: 'Terminé',
  annule: 'Annulé',
};

export default function Badge({ variante = 'neutre', children }: PropsBadge) {
  return (
    <span className={`badge badge--${variante}`}>
      {children}
    </span>
  );
}
