// =============================================================================
// Service Ateliers
// =============================================================================

import api from './api';
import type { ReponseApi, Atelier, ParametresPagination } from '@/types';

export interface CreerAtelierPayload {
  titre: string;
  description?: string;
  date_atelier: string;
  heure_debut: string;
  heure_fin: string;
  capacite: number;
  prix: number;
}

export interface MettreAJourAtelierPayload extends Partial<CreerAtelierPayload> {
  statut?: string;
}

export const ateliersService = {
  listerTous: (params?: ParametresPagination) =>
    api.get<ReponseApi<Atelier[]>>('/ateliers', { params }),

  trouverParId: (id: number) =>
    api.get<ReponseApi<Atelier>>(`/ateliers/${id}`),

  creer: (donnees: CreerAtelierPayload) =>
    api.post<ReponseApi<Atelier>>('/ateliers', donnees),

  mettreAJour: (id: number, donnees: MettreAJourAtelierPayload) =>
    api.patch<ReponseApi<Atelier>>(`/ateliers/${id}`, donnees),

  supprimer: (id: number) =>
    api.delete<ReponseApi>(`/ateliers/${id}`),
};
