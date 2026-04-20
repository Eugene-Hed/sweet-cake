// =============================================================================
// Types locaux du back-office Sweet-Cake
// =============================================================================

/** Utilisateur retourné par l'API */
export interface Utilisateur {
  id: number;
  nom_complet: string;
  email: string;
  role: string;
  telephone?: string;
  est_actif: boolean;
  langue_preferee: string;
  created_at: string;
  updated_at: string;
}

/** Catégorie */
export interface Categorie {
  id: number;
  nom: string;
  description?: string;
  est_active: boolean;
  created_at: string;
  updated_at: string;
}

/** Produit */
export interface Produit {
  id: number;
  categorie_id: number;
  nom: string;
  description?: string;
  prix: number;
  image_url?: string;
  est_disponible: boolean;
  est_actif: boolean;
  categorie?: Categorie;
  created_at: string;
  updated_at: string;
}

/** Ligne de commande */
export interface LigneCommande {
  id: number;
  produit_id: number;
  quantite: number;
  prix_unitaire: number;
  sous_total: number;
  produit?: Produit;
}

/** Commande */
export interface Commande {
  id: number;
  client_id: number;
  numero_commande?: string;
  type_commande: string;
  statut: string;
  statut_paiement?: string;
  montant_total: number | string;
  /** alias fréquemment utilisé dans le back-office */
  total: number | string;
  notes?: string;
  planifiee_pour?: string;
  annulee_at?: string;
  client?: Utilisateur;
  lignes?: LigneCommande[];
  lignes_commande?: LigneCommande[];
  created_at: string;
  updated_at: string;
}

/** Historique de statut de commande */
export interface HistoriqueStatut {
  id: number;
  commande_id: number;
  ancien_statut: string;
  nouveau_statut: string;
  note?: string;
  modifie_par?: number;
  utilisateur?: Utilisateur;
  created_at: string;
}

/** Atelier */
export interface Atelier {
  id: number;
  titre: string;
  description?: string;
  date_atelier: string;
  heure_debut: string;
  heure_fin: string;
  capacite: number;
  places_reservees: number;
  prix: number;
  statut: string;
  formateur_id?: number;
  formateur?: Utilisateur;
  reservations?: Reservation[];
  created_at: string;
  updated_at: string;
}

/** Réservation d'atelier */
export interface Reservation {
  id: number;
  atelier_id: number;
  client_id: number;
  nombre_places: number;
  statut: string;
  atelier?: Atelier;
  client?: Utilisateur;
  created_at: string;
  updated_at: string;
}

/** Article de stock */
export interface ArticleStock {
  id: number;
  nom: string;
  unite: string;
  quantite: number;
  seuil_minimal: number;
  created_at: string;
  updated_at: string;
}

/** Mouvement de stock */
export interface MouvementStock {
  id: number;
  article_stock_id: number;
  type_mouvement: string;
  quantite: number;
  raison?: string;
  utilisateur_id: number;
  utilisateur?: Utilisateur;
  created_at: string;
}

/** Journal d'audit */
export interface JournalAudit {
  id: number;
  action: string;
  entite: string;
  entite_id?: number;
  utilisateur_id?: number;
  utilisateur?: Utilisateur;
  details?: Record<string, unknown>;
  adresse_ip?: string;
  created_at: string;
}

/** Résumé du tableau de bord */
export interface ResumeTableauDeBord {
  total_commandes: number;
  total_produits: number;
  total_ateliers: number;
  total_clients: number;
  alertes_stock_faible: number;
  revenus_estimes: number;
  revenus_mensuels: { nom: string; total: number }[];
  commandes_recentes: Commande[];
}

/** Réponse API générique */
export interface ReponseApi<T = unknown> {
  succes: boolean;
  message: string;
  donnees?: T;
  meta?: MetaPagination;
}

/** Meta pagination */
export interface MetaPagination {
  page: number;
  limite: number;
  total: number;
  total_pages: number;
}

/** Paramètres de pagination */
export interface ParametresPagination {
  page?: number;
  limite?: number;
  tri?: string;
  ordre?: 'asc' | 'desc';
  recherche?: string;
}

/** Réponse de connexion */
export interface ReponseConnexion {
  jeton_acces: string;
  jeton_rafraichissement: string;
  utilisateur: Utilisateur;
}

/** Alerte stock faible */
export interface AlerteStock {
  id: number;
  nom: string;
  unite: string;
  quantite: number;
  seuil_minimal: number;
}
