// =============================================================================
// Sweet-Cake Mobile — Client API Axios
// =============================================================================

import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ReponseApi } from '@sweet-cake/shared';

const BASE_URL = 'http://localhost:3000/api/v1';

export const CLES_STOCKAGE = {
    JETON_ACCES: 'jeton_acces',
    JETON_RAFRAICHISSEMENT: 'jeton_rafraichissement',
} as const;

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 15000,
    headers: { 'Content-Type': 'application/json' },
});

// ─── Intercepteur Request : injection du JWT ─────────────────────────────────

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const jeton = await SecureStore.getItemAsync(CLES_STOCKAGE.JETON_ACCES);
    if (jeton && config.headers) {
        config.headers.Authorization = `Bearer ${jeton}`;
    }
    return config;
});

// ─── Intercepteur Response : refresh automatique sur 401 ─────────────────────

let estEnTrainDeRafraichir = false;
let fileAttente: Array<{
    resolve: (value: string) => void;
    reject: (reason: unknown) => void;
}> = [];

const traiterFileAttente = (jeton: string | null) => {
    fileAttente.forEach(({ resolve, reject }) => {
        jeton ? resolve(jeton) : reject(new Error('Refresh échoué'));
    });
    fileAttente = [];
};

api.interceptors.response.use(
    (response) => response,
    async (erreur: AxiosError) => {
        const configOriginale = erreur.config;
        if (!configOriginale) return Promise.reject(erreur);

        // Si 401 et pas une requête de refresh
        if (
            erreur.response?.status === 401 &&
            !configOriginale.url?.includes('rafraichir') &&
            !(configOriginale as any)._retry
        ) {
            if (estEnTrainDeRafraichir) {
                return new Promise((resolve, reject) => {
                    fileAttente.push({ resolve, reject });
                }).then((jeton) => {
                    if (configOriginale.headers) {
                        configOriginale.headers.Authorization = `Bearer ${jeton}`;
                    }
                    return api(configOriginale);
                });
            }

            (configOriginale as any)._retry = true;
            estEnTrainDeRafraichir = true;

            try {
                const jetonRefresh = await SecureStore.getItemAsync(CLES_STOCKAGE.JETON_RAFRAICHISSEMENT);
                if (!jetonRefresh) throw new Error('Pas de refresh token');

                const { data } = await axios.post<ReponseApi<{ jeton_acces: string; jeton_rafraichissement: string }>>(
                    `${BASE_URL}/authentification/rafraichir`,
                    { jeton_rafraichissement: jetonRefresh },
                );

                const nouveauJeton = data.donnees!.jeton_acces;
                const nouveauRefresh = data.donnees!.jeton_rafraichissement;

                await SecureStore.setItemAsync(CLES_STOCKAGE.JETON_ACCES, nouveauJeton);
                await SecureStore.setItemAsync(CLES_STOCKAGE.JETON_RAFRAICHISSEMENT, nouveauRefresh);

                traiterFileAttente(nouveauJeton);

                if (configOriginale.headers) {
                    configOriginale.headers.Authorization = `Bearer ${nouveauJeton}`;
                }
                return api(configOriginale);
            } catch (errRefresh) {
                traiterFileAttente(null);
                await SecureStore.deleteItemAsync(CLES_STOCKAGE.JETON_ACCES);
                await SecureStore.deleteItemAsync(CLES_STOCKAGE.JETON_RAFRAICHISSEMENT);
                return Promise.reject(errRefresh);
            } finally {
                estEnTrainDeRafraichir = false;
            }
        }

        return Promise.reject(erreur);
    },
);

export default api;
