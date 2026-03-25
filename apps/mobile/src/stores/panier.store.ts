// =============================================================================
// Sweet-Cake Mobile — Store Panier (Zustand)
// =============================================================================

import { create } from 'zustand';

interface ArticlePanier {
    produit_id: number;
    nom: string;
    prix: number;
    quantite: number;
    image_url?: string;
}

interface EtatPanier {
    articles: ArticlePanier[];
    ajouter: (article: Omit<ArticlePanier, 'quantite'>, quantite?: number) => void;
    retirer: (produit_id: number) => void;
    modifierQuantite: (produit_id: number, quantite: number) => void;
    vider: () => void;
    nombreArticles: () => number;
    total: () => number;
}

export const usePanierStore = create<EtatPanier>((set, get) => ({
    articles: [],

    ajouter: (article, quantite = 1) => {
        set((state) => {
            const existant = state.articles.find((a) => a.produit_id === article.produit_id);
            if (existant) {
                return {
                    articles: state.articles.map((a) =>
                        a.produit_id === article.produit_id
                            ? { ...a, quantite: a.quantite + quantite }
                            : a,
                    ),
                };
            }
            return { articles: [...state.articles, { ...article, quantite }] };
        });
    },

    retirer: (produit_id) => {
        set((state) => ({
            articles: state.articles.filter((a) => a.produit_id !== produit_id),
        }));
    },

    modifierQuantite: (produit_id, quantite) => {
        if (quantite < 1) {
            get().retirer(produit_id);
            return;
        }
        set((state) => ({
            articles: state.articles.map((a) =>
                a.produit_id === produit_id ? { ...a, quantite } : a,
            ),
        }));
    },

    vider: () => set({ articles: [] }),

    nombreArticles: () => get().articles.reduce((acc, a) => acc + a.quantite, 0),

    total: () =>
        get().articles.reduce((acc, a) => acc + a.prix * a.quantite, 0),
}));
