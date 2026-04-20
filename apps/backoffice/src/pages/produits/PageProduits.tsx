import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { produitsService, type FiltresProduits } from '@/services/produits.service';
import { categoriesService } from '@/services/categories.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import Confirmation from '@/composants/communs/Confirmation';
import type { Produit, Categorie, MetaPagination } from '@/types';
import { formaterFCFA } from '@/utilitaires/formatage';
import toast from 'react-hot-toast';

export default function PageProduits() {
  const naviguer = useNavigate();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [categories, setCategories] = useState<Categorie[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<FiltresProduits>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
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

  const supprimer = async () => {
    if (suppression === null) return;
    try { 
      await produitsService.supprimer(suppression); 
      toast.success('Produit supprimé'); 
      setSuppression(null); 
      charger(); 
    } catch { toast.error('Erreur de suppression'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Catalogue Produits</h1>
        <button className="bouton bouton--primaire" onClick={() => naviguer('/produits/nouveau')}>
          <Plus size={18} /> Nouveau produit
        </button>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Nom, description..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
        <select className="champ-saisie champ-select" style={{ width: 'auto', maxWidth: 220 }}
          value={parametres.categorie_id || ''} onChange={(e) => setParametres({ ...parametres, categorie_id: e.target.value ? Number(e.target.value) : undefined, page: 1 })}>
          <option value="">Toutes les catégories</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
        </select>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Produit</th><th>Catégorie</th><th>Prix</th><th>Statut</th><th>Visibilité</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={6} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : produits.length === 0 ? (
              <tr><td colSpan={6} className="tableau-vide">Aucun produit trouvé</td></tr>
            ) : produits.map((p, idx) => (
              <tr key={p.id} className="animer-entree" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    {p.image_url && <img src={p.image_url} alt="" style={{ width: 36, height: 36, borderRadius: 6, objectFit: 'cover' }} />}
                    <strong>{p.nom}</strong>
                  </div>
                </td>
                <td className="texte-secondaire">{p.categorie?.nom || '—'}</td>
                <td><strong>{formaterFCFA(p.prix)}</strong></td>
                <td><Badge variante={p.est_disponible ? 'succes' : 'erreur'}>{p.est_disponible ? 'En stock' : 'Rupture'}</Badge></td>
                <td><Badge variante={p.est_actif ? 'neutre' : 'erreur'}>{p.est_actif ? 'Public' : 'Masqué'}</Badge></td>
                <td>
                  <div className="tableau-actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer(`/produits/${p.id}`)} title="Modifier"><Pencil size={18} /></button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setSuppression(p.id)} title="Supprimer"><Trash2 size={18} color="var(--couleur-erreur)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      <Confirmation estOuverte={suppression !== null} onFermer={() => setSuppression(null)} onConfirmer={supprimer}
        message="Voulez-vous vraiment supprimer ce produit ? Cette action est irréversible." labelConfirmer="Supprimer" />
    </div>
  );
}
