// =============================================================================
// Service Tableau de bord
// =============================================================================

import api from './api';
import type { ReponseApi, ResumeTableauDeBord } from '@/types';

export const tableauDeBordService = {
  resume: () =>
    api.get<ReponseApi<ResumeTableauDeBord>>('/tableau-de-bord/resume'),
};
