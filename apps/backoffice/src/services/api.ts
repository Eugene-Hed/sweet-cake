// =============================================================================
// Service API — Instance Axios avec intercepteurs JWT
// =============================================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Crée l'instance Axios
const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept-Language': 'fr',
  },
});

// File d'attente pour les requêtes en attente de refresh
let estEnTrainDeRafraichir = false;
let fileAttente: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const traiterFileAttente = (erreur: unknown, token: string | null = null) => {
  fileAttente.forEach((promesse) => {
    if (erreur) {
      promesse.reject(erreur);
    } else {
      promesse.resolve(token!);
    }
  });
  fileAttente = [];
};

// --- Intercepteur de requête : ajoute le token JWT ---
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jeton_acces');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (erreur) => Promise.reject(erreur)
);

// --- Intercepteur de réponse : gère le refresh token ---
api.interceptors.response.use(
  (reponse) => reponse,
  async (erreur: AxiosError) => {
    const configOriginale = erreur.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Si 401 et pas déjà en retry
    if (erreur.response?.status === 401 && !configOriginale._retry) {
      // Ne pas essayer de refresh si c'est la requête de connexion ou de refresh
      const url = configOriginale.url || '';
      if (url.includes('connexion') || url.includes('rafraichir')) {
        return Promise.reject(erreur);
      }

      if (estEnTrainDeRafraichir) {
        // Mettre en file d'attente
        return new Promise<string>((resolve, reject) => {
          fileAttente.push({ resolve, reject });
        }).then((token) => {
          configOriginale.headers.Authorization = `Bearer ${token}`;
          return api(configOriginale);
        });
      }

      configOriginale._retry = true;
      estEnTrainDeRafraichir = true;

      const jetonRafraichissement = localStorage.getItem('jeton_rafraichissement');
      if (!jetonRafraichissement) {
        // Pas de refresh token → déconnexion
        localStorage.removeItem('jeton_acces');
        localStorage.removeItem('jeton_rafraichissement');
        localStorage.removeItem('utilisateur');
        window.location.href = '/connexion';
        return Promise.reject(erreur);
      }

      try {
        const reponse = await axios.post('/api/v1/authentification/rafraichir', {
          jeton_rafraichissement: jetonRafraichissement,
        });

        const { jeton_acces, jeton_rafraichissement: nouveauRefresh } = reponse.data.donnees;
        localStorage.setItem('jeton_acces', jeton_acces);
        localStorage.setItem('jeton_rafraichissement', nouveauRefresh);

        configOriginale.headers.Authorization = `Bearer ${jeton_acces}`;
        traiterFileAttente(null, jeton_acces);

        return api(configOriginale);
      } catch (erreurRefresh) {
        traiterFileAttente(erreurRefresh, null);
        localStorage.removeItem('jeton_acces');
        localStorage.removeItem('jeton_rafraichissement');
        localStorage.removeItem('utilisateur');
        window.location.href = '/connexion';
        return Promise.reject(erreurRefresh);
      } finally {
        estEnTrainDeRafraichir = false;
      }
    }

    return Promise.reject(erreur);
  }
);

export default api;
