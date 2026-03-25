// =============================================================================
// Sweet-Cake Mobile — Store Authentification (Zustand)
// =============================================================================

import { create } from 'zustand';
import * as SecureStore from 'expo-secure-store';
import api, { CLES_STOCKAGE } from '../services/api';
import { RoleUtilisateur } from '@sweet-cake/shared';

interface Utilisateur {
    id: number;
    nom_complet: string;
    email: string;
    role: string;
    telephone?: string;
    langue_preferee: string;
}

interface EtatAuth {
    utilisateur: Utilisateur | null;
    estConnecte: boolean;
    estChargement: boolean;
    erreur: string | null;
    estAdmin: boolean;

    connexion: (email: string, mot_de_passe: string) => Promise<void>;
    inscription: (donnees: {
        nom_complet: string;
        email: string;
        mot_de_passe: string;
        telephone?: string;
    }) => Promise<void>;
    deconnexion: () => Promise<void>;
    chargerProfil: () => Promise<void>;
    restaurerSession: () => Promise<void>;
    effacerErreur: () => void;
}

export const useAuthStore = create<EtatAuth>((set, get) => ({
    utilisateur: null,
    estConnecte: false,
    estChargement: false,
    erreur: null,
    estAdmin: false,

    connexion: async (email, mot_de_passe) => {
        set({ estChargement: true, erreur: null });
        try {
            const { data } = await api.post('/authentification/connexion', {
                email,
                mot_de_passe,
            });

            const { utilisateur, jeton_acces, jeton_rafraichissement } = data.donnees;

            await SecureStore.setItemAsync(CLES_STOCKAGE.JETON_ACCES, jeton_acces);
            await SecureStore.setItemAsync(CLES_STOCKAGE.JETON_RAFRAICHISSEMENT, jeton_rafraichissement);

            const estAdmin = [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.GESTIONNAIRE].includes(
                utilisateur.role as RoleUtilisateur,
            );

            set({
                utilisateur,
                estConnecte: true,
                estAdmin,
                estChargement: false,
            });
        } catch (err: any) {
            const message = err.response?.data?.message || 'Erreur de connexion';
            set({ erreur: message, estChargement: false });
            throw new Error(message);
        }
    },

    inscription: async (donnees) => {
        set({ estChargement: true, erreur: null });
        try {
            const { data } = await api.post('/authentification/inscription', donnees);
            const { utilisateur, jeton_acces, jeton_rafraichissement } = data.donnees;

            await SecureStore.setItemAsync(CLES_STOCKAGE.JETON_ACCES, jeton_acces);
            await SecureStore.setItemAsync(CLES_STOCKAGE.JETON_RAFRAICHISSEMENT, jeton_rafraichissement);

            set({
                utilisateur,
                estConnecte: true,
                estAdmin: false,
                estChargement: false,
            });
        } catch (err: any) {
            const message = err.response?.data?.message || "Erreur d'inscription";
            set({ erreur: message, estChargement: false });
            throw new Error(message);
        }
    },

    deconnexion: async () => {
        try {
            await api.post('/authentification/deconnexion');
        } catch { /* ignore */ }
        await SecureStore.deleteItemAsync(CLES_STOCKAGE.JETON_ACCES);
        await SecureStore.deleteItemAsync(CLES_STOCKAGE.JETON_RAFRAICHISSEMENT);
        set({ utilisateur: null, estConnecte: false, estAdmin: false });
    },

    chargerProfil: async () => {
        try {
            const { data } = await api.get('/authentification/profil');
            const utilisateur = data.donnees;
            const estAdmin = [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.GESTIONNAIRE].includes(
                utilisateur.role as RoleUtilisateur,
            );
            set({ utilisateur, estAdmin });
        } catch { /* session expirée */ }
    },

    restaurerSession: async () => {
        const jeton = await SecureStore.getItemAsync(CLES_STOCKAGE.JETON_ACCES);
        if (!jeton) return;

        set({ estChargement: true });
        try {
            const { data } = await api.get('/authentification/profil');
            const utilisateur = data.donnees;
            const estAdmin = [RoleUtilisateur.ADMINISTRATEUR, RoleUtilisateur.GESTIONNAIRE].includes(
                utilisateur.role as RoleUtilisateur,
            );
            set({ utilisateur, estConnecte: true, estAdmin, estChargement: false });
        } catch {
            await SecureStore.deleteItemAsync(CLES_STOCKAGE.JETON_ACCES);
            await SecureStore.deleteItemAsync(CLES_STOCKAGE.JETON_RAFRAICHISSEMENT);
            set({ estChargement: false });
        }
    },

    effacerErreur: () => set({ erreur: null }),
}));
