// =============================================================================
// Service Produits
// =============================================================================

import api from './api';
import type { ReponseApi, Produit, ParametresPagination } from '@/types';

export interface CreerProduitPayload {
  categorie_id: number;
  nom: string;
  description?: string;
  prix: number;
  image_url?: string;
  est_disponible?: boolean;
  est_actif?: boolean;
}

export interface MettreAJourProduitPayload extends Partial<CreerProduitPayload> {}

export interface FiltresProduits extends ParametresPagination {
  categorie_id?: number;
  est_disponible?: boolean;
  est_actif?: boolean;
  prix_min?: number;
  prix_max?: number;
}

export const produitsService = {
  listerTous: (params?: FiltresProduits) =>
    api.get<ReponseApi<Produit[]>>('/produits', { params }),

  trouverParId: (id: number) =>
    api.get<ReponseApi<Produit>>(`/produits/${id}`),

  creer: (donnees: CreerProduitPayload) =>
    api.post<ReponseApi<Produit>>('/produits', donnees),

  mettreAJour: (id: number, donnees: MettreAJourProduitPayload) =>
    api.patch<ReponseApi<Produit>>(`/produits/${id}`, donnees),

  supprimer: (id: number) =>
    api.delete<ReponseApi>(`/produits/${id}`),
};
