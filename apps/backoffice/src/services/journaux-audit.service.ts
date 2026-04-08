// =============================================================================
// Service Journaux d'Audit
// =============================================================================

import api from './api';
import type { ReponseApi, JournalAudit, ParametresPagination } from '@/types';

export const journauxAuditService = {
  listerTous: (params?: ParametresPagination) =>
    api.get<ReponseApi<JournalAudit[]>>('/journaux-audit', { params }),
};
