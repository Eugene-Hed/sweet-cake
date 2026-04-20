// =============================================================================
// Service Articles Stock
// =============================================================================

import api from './api';
import type { ReponseApi, ArticleStock, AlerteStock, ParametresPagination } from '@/types';

export interface CreerArticleStockPayload {
  nom: string;
  unite: string;
  quantite?: number;
  seuil_minimal?: number;
}

export interface MettreAJourArticleStockPayload {
  nom?: string;
  unite?: string;
  seuil_minimal?: number;
}

export interface CreerMouvementPayload {
  type_mouvement: 'entree' | 'sortie' | 'ajustement';
  quantite: number;
  raison?: string;
}

export const stockService = {
  listerTous: (params?: ParametresPagination) =>
    api.get<ReponseApi<ArticleStock[]>>('/articles-stock', { params }),

  trouverParId: (id: number) =>
    api.get<ReponseApi<ArticleStock>>(`/articles-stock/${id}`),

  creer: (donnees: CreerArticleStockPayload) =>
    api.post<ReponseApi<ArticleStock>>('/articles-stock', donnees),

  mettreAJour: (id: number, donnees: MettreAJourArticleStockPayload) =>
    api.patch<ReponseApi<ArticleStock>>(`/articles-stock/${id}`, donnees),

  supprimer: (id: number) =>
    api.delete<ReponseApi>(`/articles-stock/${id}`),

  creerMouvement: (id: number, donnees: CreerMouvementPayload) =>
    api.post<ReponseApi>(`/articles-stock/${id}/mouvements`, donnees),

  alertesStockFaible: () =>
    api.get<ReponseApi<AlerteStock[]>>('/alertes-stock'),
};
