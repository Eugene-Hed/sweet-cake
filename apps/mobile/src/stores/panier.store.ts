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
    options_choisies?: Record<string, string>;
}

interface EtatPanier {
    articles: ArticlePanier[];
    ajouter: (article: Omit<ArticlePanier, 'quantite'>, quantite?: number) => void;
    retirer: (produit_id: number, options_choisies?: Record<string, string>) => void;
    modifierQuantite: (produit_id: number, quantite: number, options_choisies?: Record<string, string>) => void;
    vider: () => void;
    nombreArticles: () => number;
    total: () => number;
}

export const usePanierStore = create<EtatPanier>((set, get) => ({
    articles: [],

    ajouter: (article, quantite = 1) => {
        set((state) => {
            const optionsStr = JSON.stringify(article.options_choisies || {});
            const existant = state.articles.find((a) => 
                a.produit_id === article.produit_id && 
                JSON.stringify(a.options_choisies || {}) === optionsStr
            );

            if (existant) {
                return {
                    articles: state.articles.map((a) =>
                        (a.produit_id === article.produit_id && JSON.stringify(a.options_choisies || {}) === optionsStr)
                            ? { ...a, quantite: a.quantite + quantite }
                            : a,
                    ),
                };
            }
            return { articles: [...state.articles, { ...article, quantite }] };
        });
    },

    retirer: (produit_id, options_choisies) => {
        const optionsStr = JSON.stringify(options_choisies || {});
        set((state) => ({
            articles: state.articles.filter((a) => 
                !(a.produit_id === produit_id && JSON.stringify(a.options_choisies || {}) === optionsStr)
            ),
        }));
    },

    modifierQuantite: (produit_id, quantite, options_choisies) => {
        const optionsStr = JSON.stringify(options_choisies || {});
        if (quantite < 1) {
            get().retirer(produit_id, options_choisies);
            return;
        }
        set((state) => ({
            articles: state.articles.map((a) =>
                (a.produit_id === produit_id && JSON.stringify(a.options_choisies || {}) === optionsStr)
                    ? { ...a, quantite } : a,
            ),
        }));
    },

    vider: () => set({ articles: [] }),

    nombreArticles: () => get().articles.reduce((acc, a) => acc + a.quantite, 0),

    total: () =>
        get().articles.reduce((acc, a) => acc + a.prix * a.quantite, 0),
}));
