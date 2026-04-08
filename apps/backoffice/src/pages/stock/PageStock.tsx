// =============================================================================
// Page Stock — CRUD + Mouvements + Alertes
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2, ArrowUpCircle, ArrowDownCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import { stockService, type CreerArticleStockPayload, type CreerMouvementPayload } from '@/services/stock.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import Modale from '@/composants/communs/Modale';
import Confirmation from '@/composants/communs/Confirmation';
import type { ArticleStock, AlerteStock, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageStock() {
  const [articles, setArticles] = useState<ArticleStock[]>([]);
  const [alertes, setAlertes] = useState<AlerteStock[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);

  // Modale article
  const [modaleArticle, setModaleArticle] = useState(false);
  const [articleEdite, setArticleEdite] = useState<ArticleStock | null>(null);
  const [formArticle, setFormArticle] = useState<CreerArticleStockPayload>({ nom: '', unite: '', quantite: 0, seuil_minimal: 0 });

  // Modale mouvement
  const [modaleMouvement, setModaleMouvement] = useState(false);
  const [articleMouvement, setArticleMouvement] = useState<ArticleStock | null>(null);
  const [formMouvement, setFormMouvement] = useState<CreerMouvementPayload>({ type_mouvement: 'entree', quantite: 0, raison: '' });

  const [sauvegarde, setSauvegarde] = useState(false);
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

  const ouvrirCreation = () => {
    setArticleEdite(null);
    setFormArticle({ nom: '', unite: 'kg', quantite: 0, seuil_minimal: 10 });
    setModaleArticle(true);
  };

  const ouvrirEdition = (a: ArticleStock) => {
    setArticleEdite(a);
    setFormArticle({ nom: a.nom, unite: a.unite, seuil_minimal: a.seuil_minimal });
    setModaleArticle(true);
  };

  const ouvrirMouvement = (a: ArticleStock) => {
    setArticleMouvement(a);
    setFormMouvement({ type_mouvement: 'entree', quantite: 0, raison: '' });
    setModaleMouvement(true);
  };

  const sauvegarderArticle = async () => {
    if (!formArticle.nom.trim()) { toast.error('Le nom est requis'); return; }
    setSauvegarde(true);
    try {
      if (articleEdite) {
        await stockService.mettreAJour(articleEdite.id, { nom: formArticle.nom, unite: formArticle.unite, seuil_minimal: formArticle.seuil_minimal });
        toast.success('Article modifié');
      } else {
        await stockService.creer(formArticle);
        toast.success('Article créé');
      }
      setModaleArticle(false);
      charger();
    } catch { toast.error('Erreur de sauvegarde'); }
    finally { setSauvegarde(false); }
  };

  const sauvegarderMouvement = async () => {
    if (!articleMouvement || formMouvement.quantite <= 0) { toast.error('Quantité invalide'); return; }
    setSauvegarde(true);
    try {
      await stockService.creerMouvement(articleMouvement.id, formMouvement);
      toast.success('Mouvement enregistré');
      setModaleMouvement(false);
      charger();
    } catch { toast.error('Erreur mouvement de stock'); }
    finally { setSauvegarde(false); }
  };

  const supprimer = async () => {
    if (suppression === null) return;
    try { await stockService.supprimer(suppression); toast.success('Article supprimé'); setSuppression(null); charger(); }
    catch { toast.error('Erreur de suppression'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Gestion du stock</h1>
        <button className="bouton bouton--primaire" onClick={ouvrirCreation}><Plus size={18} /> Nouvel article</button>
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
          <input className="recherche-saisie" placeholder="Rechercher..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Article</th><th>Unité</th><th>Quantité</th><th>Seuil min.</th><th>État</th><th>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={6} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : articles.length === 0 ? (
              <tr><td colSpan={6} className="tableau-vide">Aucun article en stock</td></tr>
            ) : articles.map((a) => (
              <tr key={a.id}>
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
                  <div className="tableau-actions">
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => ouvrirMouvement(a)} title="Mouvement">
                      <RefreshCw size={16} color="var(--couleur-information)" />
                    </button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => ouvrirEdition(a)} title="Modifier"><Pencil size={16} /></button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setSuppression(a.id)} title="Supprimer"><Trash2 size={16} color="var(--couleur-erreur)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      {/* Modale Article */}
      <Modale estOuverte={modaleArticle} onFermer={() => setModaleArticle(false)}
        titre={articleEdite ? 'Modifier l\'article' : 'Nouvel article de stock'}
        pied={<>
          <button className="bouton bouton--fantome" onClick={() => setModaleArticle(false)}>Annuler</button>
          <button className="bouton bouton--primaire" onClick={sauvegarderArticle} disabled={sauvegarde}>
            {sauvegarde ? <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Enregistrer'}
          </button>
        </>}>
        <div className="formulaire-grille formulaire-grille--2cols">
          <div className="champ-groupe">
            <label className="champ-label">Nom *</label>
            <input className="champ-saisie" value={formArticle.nom} onChange={(e) => setFormArticle({ ...formArticle, nom: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Unité *</label>
            <input className="champ-saisie" value={formArticle.unite} onChange={(e) => setFormArticle({ ...formArticle, unite: e.target.value })} placeholder="kg, L, pièces..." />
          </div>
          {!articleEdite && (
            <div className="champ-groupe">
              <label className="champ-label">Quantité initiale</label>
              <input className="champ-saisie" type="number" min="0" value={formArticle.quantite || 0}
                onChange={(e) => setFormArticle({ ...formArticle, quantite: parseFloat(e.target.value) || 0 })} />
            </div>
          )}
          <div className="champ-groupe">
            <label className="champ-label">Seuil minimal</label>
            <input className="champ-saisie" type="number" min="0" value={formArticle.seuil_minimal || 0}
              onChange={(e) => setFormArticle({ ...formArticle, seuil_minimal: parseFloat(e.target.value) || 0 })} />
          </div>
        </div>
      </Modale>

      {/* Modale Mouvement */}
      <Modale estOuverte={modaleMouvement} onFermer={() => setModaleMouvement(false)}
        titre={`Mouvement — ${articleMouvement?.nom || ''}`}
        pied={<>
          <button className="bouton bouton--fantome" onClick={() => setModaleMouvement(false)}>Annuler</button>
          <button className="bouton bouton--primaire" onClick={sauvegarderMouvement} disabled={sauvegarde}>
            {sauvegarde ? <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Enregistrer'}
          </button>
        </>}>
        <div className="formulaire-grille">
          <div className="champ-groupe">
            <label className="champ-label">Type de mouvement *</label>
            <div style={{ display: 'flex', gap: 8 }}>
              {[
                { val: 'entree' as const, label: 'Entrée', icone: ArrowUpCircle, couleur: 'var(--couleur-succes)' },
                { val: 'sortie' as const, label: 'Sortie', icone: ArrowDownCircle, couleur: 'var(--couleur-erreur)' },
                { val: 'ajustement' as const, label: 'Ajustement', icone: RefreshCw, couleur: 'var(--couleur-information)' },
              ].map((t) => (
                <button key={t.val}
                  className={`bouton ${formMouvement.type_mouvement === t.val ? 'bouton--primaire' : 'bouton--secondaire'} bouton--sm`}
                  style={formMouvement.type_mouvement === t.val ? { background: t.couleur, borderColor: t.couleur } : {}}
                  onClick={() => setFormMouvement({ ...formMouvement, type_mouvement: t.val })}>
                  <t.icone size={14} /> {t.label}
                </button>
              ))}
            </div>
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Quantité *</label>
            <input className="champ-saisie" type="number" step="0.001" min="0" value={formMouvement.quantite || ''}
              onChange={(e) => setFormMouvement({ ...formMouvement, quantite: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Raison</label>
            <textarea className="champ-saisie champ-textarea" value={formMouvement.raison || ''}
              onChange={(e) => setFormMouvement({ ...formMouvement, raison: e.target.value })} placeholder="Livraison fournisseur, consommation..." />
          </div>
        </div>
      </Modale>

      <Confirmation estOuverte={suppression !== null} onFermer={() => setSuppression(null)} onConfirmer={supprimer}
        message="Supprimer cet article de stock ?" labelConfirmer="Supprimer" />
    </div>
  );
}
