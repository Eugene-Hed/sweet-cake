// =============================================================================
// Utilitaires de formatage
// =============================================================================

/**
 * Formate un montant en Franc CFA (XAF)
 * Exemple : 15000 -> 15 000 F CFA
 */
export const formaterFCFA = (montant: number | string): string => {
  const valeur = typeof montant === 'string' ? parseFloat(montant) : montant;
  
  if (isNaN(valeur)) return '0 F CFA';

  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'XAF',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(valeur).replace('FCFA', 'F CFA');
};

/**
 * Formate une date au format français
 */
export const formaterDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

/**
 * Formate une date et heure au format français
 */
export const formaterDateTime = (date: string | Date): string => {
  return new Date(date).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};
