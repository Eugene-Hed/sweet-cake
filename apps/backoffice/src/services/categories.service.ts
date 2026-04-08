// =============================================================================
// Service Catégories
// =============================================================================

import api from './api';
import type { ReponseApi, Categorie, ParametresPagination } from '@/types';

export interface CreerCategoriePayload {
  nom: string;
  description?: string;
}

export interface MettreAJourCategoriePayload {
  nom?: string;
  description?: string;
  est_active?: boolean;
}

export const categoriesService = {
  listerToutes: (params?: ParametresPagination) =>
    api.get<ReponseApi<Categorie[]>>('/categories', { params }),

  trouverParId: (id: number) =>
    api.get<ReponseApi<Categorie>>(`/categories/${id}`),

  creer: (donnees: CreerCategoriePayload) =>
    api.post<ReponseApi<Categorie>>('/categories', donnees),

  mettreAJour: (id: number, donnees: MettreAJourCategoriePayload) =>
    api.patch<ReponseApi<Categorie>>(`/categories/${id}`, donnees),

  supprimer: (id: number) =>
    api.delete<ReponseApi>(`/categories/${id}`),
};
