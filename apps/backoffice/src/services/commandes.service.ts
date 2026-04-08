// =============================================================================
// Service Commandes
// =============================================================================

import api from './api';
import type { ReponseApi, Commande, HistoriqueStatut, ParametresPagination } from '@/types';

export const commandesService = {
  listerToutes: (params?: ParametresPagination) =>
    api.get<ReponseApi<Commande[]>>('/commandes', { params }),

  trouverParId: (id: number) =>
    api.get<ReponseApi<Commande>>(`/commandes/${id}`),

  changerStatut: (id: number, statut: string, note?: string) =>
    api.patch<ReponseApi<Commande>>(`/commandes/${id}/statut`, { statut, note }),

  annuler: (id: number) =>
    api.post<ReponseApi<Commande>>(`/commandes/${id}/annuler`),

  historique: (id: number) =>
    api.get<ReponseApi<HistoriqueStatut[]>>(`/commandes/${id}/historique`),
};
