// =============================================================================
// Service Réservations
// =============================================================================

import api from './api';
import type { ReponseApi, Reservation, ParametresPagination } from '@/types';

export const reservationsService = {
  listerToutes: (params?: ParametresPagination) =>
    api.get<ReponseApi<Reservation[]>>('/reservations', { params }),

  annuler: (id: number) =>
    api.post<ReponseApi<Reservation>>(`/reservations/${id}/annuler`),
};
