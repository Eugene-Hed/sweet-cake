// =============================================================================
// Page Produits — CRUD avec filtres
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { produitsService, type CreerProduitPayload, type FiltresProduits } from '@/services/produits.service';
import { categoriesService } from '@/services/categories.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import Modale from '@/composants/communs/Modale';
import Confirmation from '@/composants/communs/Confirmation';
import type { Produit, Categorie, MetaPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageProduits() {
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<FiltresProduits>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [produitEdite, setProduitEdite] = useState<Produit | null>(null);
  const [formulaire, setFormulaire] = useState<CreerProduitPayload>({ categorie_id: 0, nom: '', prix: 0, description: '', image_url: '', est_disponible: true, est_actif: true });
  const [sauvegarde, setSauvegarde] = useState(false);
  const [suppression, setSuppression] = useState<number | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await produitsService.listerTous(parametres);
      setProduits(r.data.donnees || []);
      if (r.data.meta) setMeta(r.data.meta);
    } catch { toast.error('Erreur chargement produits'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  useEffect(() => {
    categoriesService.listerToutes({ limite: 100 }).then(r => setCategories(r.data.donnees || [])).catch(() => {});
  }, []);

  const ouvrirCreation = () => {
    setProduitEdite(null);
    setFormulaire({ categorie_id: categories[0]?.id || 0, nom: '', prix: 0, description: '', image_url: '', est_disponible: true, est_actif: true });
    setModaleOuverte(true);
  };

  const ouvrirEdition = (p: Produit) => {
    setProduitEdite(p);
    setFormulaire({ categorie_id: p.categorie_id, nom: p.nom, prix: p.prix, description: p.description || '', image_url: p.image_url || '', est_disponible: p.est_disponible, est_actif: p.est_actif });
    setModaleOuverte(true);
  };

  const sauvegarder = async () => {
    if (!formulaire.nom.trim() || !formulaire.categorie_id) { toast.error('Nom et catégorie requis'); return; }
    setSauvegarde(true);
    try {
      const payload = { ...formulaire, prix: Number(formulaire.prix) };
      if (produitEdite) {
        await produitsService.mettreAJour(produitEdite.id, payload);
        toast.success('Produit modifié');
      } else {
        await produitsService.creer(payload);
        toast.success('Produit créé');
      }
      setModaleOuverte(false);
      charger();
    } catch { toast.error('Erreur de sauvegarde'); }
    finally { setSauvegarde(false); }
  };

  const supprimer = async () => {
    if (suppression === null) return;
    try { await produitsService.supprimer(suppression); toast.success('Produit supprimé'); setSuppression(null); charger(); }
    catch { toast.error('Erreur de suppression'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Produits</h1>
        <button className="bouton bouton--primaire" onClick={ouvrirCreation}><Plus size={18} /> Nouveau produit</button>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
        <select className="champ-saisie champ-select" style={{ width: 'auto', maxWidth: 200 }}
          value={parametres.categorie_id || ''} onChange={(e) => setParametres({ ...parametres, categorie_id: e.target.value ? Number(e.target.value) : undefined, page: 1 })}>
          <option value="">Toutes catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Disponible</th><th>Actif</th><th>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={6} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : produits.length === 0 ? (
              <tr><td colSpan={6} className="tableau-vide">Aucun produit</td></tr>
            ) : produits.map((p) => (
              <tr key={p.id}>
                <td><strong>{p.nom}</strong></td>
                <td className="texte-secondaire">{p.categorie?.nom || '—'}</td>
                <td><strong>{Number(p.prix).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</strong></td>
                <td><Badge variante={p.est_disponible ? 'succes' : 'erreur'}>{p.est_disponible ? 'Oui' : 'Non'}</Badge></td>
                <td><Badge variante={p.est_actif ? 'succes' : 'neutre'}>{p.est_actif ? 'Actif' : 'Inactif'}</Badge></td>
                <td>
                  <div className="tableau-actions">
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => ouvrirEdition(p)} title="Modifier"><Pencil size={16} /></button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setSuppression(p.id)} title="Supprimer"><Trash2 size={16} color="var(--couleur-erreur)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      <Modale estOuverte={modaleOuverte} onFermer={() => setModaleOuverte(false)} large
        titre={produitEdite ? 'Modifier le produit' : 'Nouveau produit'}
        pied={<>
          <button className="bouton bouton--fantome" onClick={() => setModaleOuverte(false)}>Annuler</button>
          <button className="bouton bouton--primaire" onClick={sauvegarder} disabled={sauvegarde}>
            {sauvegarde ? <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Enregistrer'}
          </button>
        </>}>
        <div className="formulaire-grille formulaire-grille--2cols">
          <div className="champ-groupe">
            <label className="champ-label">Nom *</label>
            <input className="champ-saisie" value={formulaire.nom} onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Catégorie *</label>
            <select className="champ-saisie champ-select" value={formulaire.categorie_id}
              onChange={(e) => setFormulaire({ ...formulaire, categorie_id: Number(e.target.value) })}>
              <option value={0} disabled>Choisir...</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
            </select>
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Prix (€) *</label>
            <input className="champ-saisie" type="number" step="0.01" min="0" value={formulaire.prix}
              onChange={(e) => setFormulaire({ ...formulaire, prix: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">URL image</label>
            <input className="champ-saisie" value={formulaire.image_url || ''} onChange={(e) => setFormulaire({ ...formulaire, image_url: e.target.value })} placeholder="/uploads/produits/..." />
          </div>
          <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
            <label className="champ-label">Description</label>
            <textarea className="champ-saisie champ-textarea" value={formulaire.description || ''} onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })} />
          </div>
          <div className="champ-groupe" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 16 }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={formulaire.est_disponible} onChange={(e) => setFormulaire({ ...formulaire, est_disponible: e.target.checked })} /> Disponible
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
              <input type="checkbox" checked={formulaire.est_actif} onChange={(e) => setFormulaire({ ...formulaire, est_actif: e.target.checked })} /> Actif
            </label>
          </div>
        </div>
      </Modale>

      <Confirmation estOuverte={suppression !== null} onFermer={() => setSuppression(null)} onConfirmer={supprimer}
        message="Supprimer ce produit ?" labelConfirmer="Supprimer" />
    </div>
  );
}
