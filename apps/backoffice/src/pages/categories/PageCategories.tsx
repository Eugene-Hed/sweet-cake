// =============================================================================
// Page Catégories — Liste avec navigation vers formulaire
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { categoriesService } from '@/services/categories.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import Confirmation from '@/composants/communs/Confirmation';
import type { Categorie, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageCategories() {
  const naviguer = useNavigate();
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
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
        <button className="bouton bouton--primaire" onClick={() => naviguer('/categories/nouveau')}>
          <Plus size={18} /> Nouvelle catégorie
        </button>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher par nom..."
            value={parametres.recherche || ''} onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Nom</th><th>Description</th><th>Statut</th><th>Créée le</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={5} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : categories.length === 0 ? (
              <tr><td colSpan={5} className="tableau-vide">Aucune catégorie trouvée</td></tr>
            ) : categories.map((c, idx) => (
              <tr key={c.id} className="animer-entree" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td><strong>{c.nom}</strong></td>
                <td className="texte-secondaire" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {c.description || <span style={{ opacity: 0.4 }}>Aucune description</span>}
                </td>
                <td><Badge variante={c.est_active ? 'succes' : 'erreur'}>{c.est_active ? 'Active' : 'Inactive'}</Badge></td>
                <td className="texte-secondaire">{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="tableau-actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer(`/categories/${c.id}`)} title="Modifier">
                      <Pencil size={16} />
                    </button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setSuppression(c.id)} title="Supprimer">
                      <Trash2 size={16} color="var(--couleur-erreur)" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      <Confirmation estOuverte={suppression !== null} onFermer={() => setSuppression(null)} onConfirmer={supprimer}
        message="Voulez-vous supprimer cette catégorie ? Cette action est irréversible." labelConfirmer="Supprimer" />
    </div>
  );
}
