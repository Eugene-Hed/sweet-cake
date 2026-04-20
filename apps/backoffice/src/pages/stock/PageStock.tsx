// =============================================================================
// Page Stock — Liste avec navigation vers formulaires dédiés
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { stockService } from '@/services/stock.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import Confirmation from '@/composants/communs/Confirmation';
import type { ArticleStock, AlerteStock, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageStock() {
  const naviguer = useNavigate();
  const [articles, setArticles] = useState<ArticleStock[]>([]);
  const [alertes, setAlertes] = useState<AlerteStock[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const [suppression, setSuppression] = useState<number | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const [rArticles, rAlertes] = await Promise.all([
        stockService.listerTous(parametres),
        stockService.alertesStockFaible(),
      ]);
      setArticles(rArticles.data.donnees || []);
      if (rArticles.data.meta) setMeta(rArticles.data.meta);
      setAlertes(rAlertes.data.donnees || []);
    } catch { toast.error('Erreur chargement stock'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  const supprimer = async () => {
    if (suppression === null) return;
    try {
      await stockService.supprimer(suppression);
      toast.success('Article supprimé');
      setSuppression(null);
      charger();
    } catch { toast.error('Erreur de suppression'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Gestion du Stock</h1>
        <button className="bouton bouton--primaire" onClick={() => naviguer('/stock/nouveau')}>
          <Plus size={18} /> Nouvel article
        </button>
      </div>

      {alertes.length > 0 && (
        <div className="alerte alerte--avertissement" style={{ marginBottom: 16 }}>
          <AlertTriangle size={20} />
          <div>
            <strong>Stock faible !</strong> {alertes.length} article(s) sous le seuil minimal :
            <span style={{ marginLeft: 8 }}>{alertes.map(a => `${a.nom} (${a.quantite} ${a.unite})`).join(', ')}</span>
          </div>
        </div>
      )}

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher un article..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Article</th><th>Unité</th><th>Quantité</th><th>Seuil min.</th><th>État</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={6} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={6} className="tableau-vide">Aucun article en stock</td></tr>
            ) : articles.map((a, idx) => (
              <tr key={a.id} className="animer-entree" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td><strong>{a.nom}</strong></td>
                <td className="texte-secondaire">{a.unite}</td>
                <td><strong>{a.quantite}</strong></td>
                <td className="texte-secondaire">{a.seuil_minimal}</td>
                <td>
                  <Badge variante={a.quantite <= a.seuil_minimal ? 'erreur' : 'succes'}>
                    {a.quantite <= a.seuil_minimal ? 'Stock faible' : 'OK'}
                  </Badge>
                </td>
                <td>
                  <div className="tableau-actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer(`/stock/${a.id}/mouvement`)} title="Mouvement de stock">
                      <RefreshCw size={16} color="var(--couleur-information)" />
                    </button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer(`/stock/${a.id}`)} title="Modifier">
                      <Pencil size={16} />
                    </button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setSuppression(a.id)} title="Supprimer">
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
        message="Voulez-vous supprimer cet article de stock ? Cette action est irréversible." labelConfirmer="Supprimer" />
    </div>
  );
}
