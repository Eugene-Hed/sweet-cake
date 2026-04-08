// =============================================================================
// Service Authentification
// =============================================================================

import api from './api';
import type { ReponseApi, ReponseConnexion, Utilisateur } from '@/types';

export const authentificationService = {
  connexion: (email: string, mot_de_passe: string) =>
    api.post<ReponseApi<ReponseConnexion>>('/authentification/connexion', { email, mot_de_passe }),

  deconnexion: () =>
    api.post<ReponseApi>('/authentification/deconnexion'),

  rafraichir: (jeton_rafraichissement: string) =>
    api.post<ReponseApi<ReponseConnexion>>('/authentification/rafraichir', { jeton_rafraichissement }),

  profil: () =>
    api.get<ReponseApi<Utilisateur>>('/authentification/profil'),
};
