// =============================================================================
// Page Catégories — CRUD complet
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { categoriesService, type CreerCategoriePayload } from '@/services/categories.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import Modale from '@/composants/communs/Modale';
import Confirmation from '@/composants/communs/Confirmation';
import type { Categorie, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageCategories() {
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [categorieEditee, setCategorieEditee] = useState<Categorie | null>(null);
  const [formulaire, setFormulaire] = useState<CreerCategoriePayload>({ nom: '', description: '' });
  const [sauvegarde, setSauvegarde] = useState(false);
  const [suppression, setSuppression] = useState<number | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await categoriesService.listerToutes(parametres);
      setCategories(r.data.donnees || []);
      if (r.data.meta) setMeta(r.data.meta);
    } catch { toast.error('Erreur chargement catégories'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  const ouvrirCreation = () => {
    setCategorieEditee(null);
    setFormulaire({ nom: '', description: '' });
    setModaleOuverte(true);
  };

  const ouvrirEdition = (c: Categorie) => {
    setCategorieEditee(c);
    setFormulaire({ nom: c.nom, description: c.description || '' });
    setModaleOuverte(true);
  };

  const sauvegarder = async () => {
    if (!formulaire.nom.trim()) { toast.error('Le nom est requis'); return; }
    setSauvegarde(true);
    try {
      if (categorieEditee) {
        await categoriesService.mettreAJour(categorieEditee.id, formulaire);
        toast.success('Catégorie modifiée');
      } else {
        await categoriesService.creer(formulaire);
        toast.success('Catégorie créée');
      }
      setModaleOuverte(false);
      charger();
    } catch { toast.error('Erreur de sauvegarde'); }
    finally { setSauvegarde(false); }
  };

  const supprimer = async () => {
    if (suppression === null) return;
    try {
      await categoriesService.supprimer(suppression);
      toast.success('Catégorie supprimée');
      setSuppression(null);
      charger();
    } catch { toast.error('Erreur de suppression'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Catégories</h1>
        <button className="bouton bouton--primaire" onClick={ouvrirCreation}><Plus size={18} /> Nouvelle catégorie</button>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher..."
            value={parametres.recherche || ''} onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Nom</th><th>Description</th><th>Statut</th><th>Créée le</th><th>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={5} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="tableau-vide">Aucune catégorie</td></tr>
            ) : categories.map((c) => (
              <tr key={c.id}>
                <td><strong>{c.nom}</strong></td>
                <td className="texte-secondaire" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.description || '—'}</td>
                <td><Badge variante={c.est_active ? 'succes' : 'erreur'}>{c.est_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="texte-secondaire">{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="tableau-actions">
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => ouvrirEdition(c)} title="Modifier"><Pencil size={16} /></button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setSuppression(c.id)} title="Supprimer"><Trash2 size={16} color="var(--couleur-erreur)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      <Modale estOuverte={modaleOuverte} onFermer={() => setModaleOuverte(false)}
        titre={categorieEditee ? 'Modifier la catégorie' : 'Nouvelle catégorie'}
        pied={<>
          <button className="bouton bouton--fantome" onClick={() => setModaleOuverte(false)}>Annuler</button>
          <button className="bouton bouton--primaire" onClick={sauvegarder} disabled={sauvegarde}>
            {sauvegarde ? <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Enregistrer'}
          </button>
        </>}>
        <div className="formulaire-grille">
          <div className="champ-groupe">
            <label className="champ-label">Nom *</label>
            <input className="champ-saisie" value={formulaire.nom} onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })} placeholder="Ex: Viennoiseries" />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Description</label>
            <textarea className="champ-saisie champ-textarea" value={formulaire.description || ''} onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })} placeholder="Description optionnelle..." />
          </div>
        </div>
      </Modale>

      <Confirmation estOuverte={suppression !== null} onFermer={() => setSuppression(null)} onConfirmer={supprimer}
        message="Voulez-vous supprimer cette catégorie ? Cette action est irréversible." labelConfirmer="Supprimer" />
    </div>
  );
}
