// =============================================================================
// Service Utilisateurs
// =============================================================================

import api from './api';
import type { ReponseApi, Utilisateur, ParametresPagination } from '@/types';

export const utilisateursService = {
  listerTous: (params?: ParametresPagination) =>
    api.get<ReponseApi<Utilisateur[]>>('/utilisateurs', { params }),

  trouverParId: (id: number) =>
    api.get<ReponseApi<Utilisateur>>(`/utilisateurs/${id}`),

  mettreAJour: (id: number, donnees: Partial<Utilisateur>) =>
    api.patch<ReponseApi<Utilisateur>>(`/utilisateurs/${id}`, donnees),

  changerStatut: (id: number, est_actif: boolean) =>
    api.patch<ReponseApi<Utilisateur>>(`/utilisateurs/${id}/statut`, { est_actif }),
};
