// =============================================================================
// Page Mouvement de Stock — Pleine page
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, ArrowUpCircle, ArrowDownCircle, RefreshCw, Package, Info } from 'lucide-react';
import { stockService, type CreerMouvementPayload } from '@/services/stock.service';
import Badge from '@/composants/communs/Badge';
import type { ArticleStock } from '@/types';
import toast from 'react-hot-toast';

const TYPES_MOUVEMENT = [
  { val: 'entree' as const, label: 'Entrée de stock', description: 'Réception fournisseur, production...', icone: ArrowUpCircle, couleur: '#28A745' },
  { val: 'sortie' as const, label: 'Sortie de stock', description: 'Consommation, vente, perte...', icone: ArrowDownCircle, couleur: '#DC3545' },
  { val: 'ajustement' as const, label: 'Ajustement', description: 'Correction d\'inventaire', icone: RefreshCw, couleur: '#17A2B8' },
];

export default function PageMouvementStock() {
  const { id } = useParams<{ id: string }>();
  const naviguer = useNavigate();

  const [article, setArticle] = useState<ArticleStock | null>(null);
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [formulaire, setFormulaire] = useState<CreerMouvementPayload>({
    type_mouvement: 'entree',
    quantite: 0,
    raison: '',
  });

  useEffect(() => {
    const charger = async () => {
      setChargement(true);
      try {
        const r = await stockService.trouverParId(Number(id));
        setArticle(r.data.donnees || null);
      } catch {
        toast.error('Article introuvable');
        naviguer('/stock');
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, [id, naviguer]);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formulaire.quantite <= 0) {
      toast.error('La quantité doit être supérieure à 0');
      return;
    }
    setSauvegarde(true);
    try {
      await stockService.creerMouvement(Number(id), formulaire);
      toast.success('Mouvement de stock enregistré');
      naviguer('/stock');
    } catch {
      toast.error('Erreur lors de l\'enregistrement du mouvement');
    } finally {
      setSauvegarde(false);
    }
  };

  if (chargement) {
    return <div className="chargement-page"><div className="chargement-spinner chargement-spinner--lg" /></div>;
  }

  if (!article) return null;

  const typeActif = TYPES_MOUVEMENT.find(t => t.val === formulaire.type_mouvement);
  const nouvelleQuantite = formulaire.type_mouvement === 'entree'
    ? article.quantite + formulaire.quantite
    : formulaire.type_mouvement === 'sortie'
      ? article.quantite - formulaire.quantite
      : formulaire.quantite;

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/stock')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-titre">Mouvement — {article.nom}</h1>
        </div>
        <div className="page-actions">
          <button className="bouton bouton--fantome" onClick={() => naviguer('/stock')} disabled={sauvegarde}>
            Annuler
          </button>
          <button className="bouton bouton--primaire" onClick={soumettre} disabled={sauvegarde}>
            {sauvegarde ? (
              <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
            ) : (
              <><Save size={18} /> Enregistrer le mouvement</>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={soumettre} className="commande-detail-grille">
        {/* État actuel de l'article */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <Package size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-primaire)' }} />
            État actuel
          </h3>
          <div className="commande-info-grille">
            <div>
              <span className="texte-secondaire">Article</span><br />
              <strong>{article.nom}</strong>
            </div>
            <div>
              <span className="texte-secondaire">Quantité en stock</span><br />
              <strong style={{ fontSize: '1.25rem' }}>{article.quantite} {article.unite}</strong>
            </div>
            <div>
              <span className="texte-secondaire">Seuil minimal</span><br />
              <strong>{article.seuil_minimal} {article.unite}</strong>
            </div>
            <div>
              <span className="texte-secondaire">État</span><br />
              <Badge variante={article.quantite <= article.seuil_minimal ? 'erreur' : 'succes'}>
                {article.quantite <= article.seuil_minimal ? 'Stock faible' : 'OK'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Type de mouvement */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <RefreshCw size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-secondaire)' }} />
            Type de mouvement
          </h3>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {TYPES_MOUVEMENT.map((t) => (
              <button
                key={t.val}
                type="button"
                onClick={() => setFormulaire({ ...formulaire, type_mouvement: t.val })}
                className="carte"
                style={{
                  flex: '1 1 180px',
                  cursor: 'pointer',
                  padding: '16px 20px',
                  border: formulaire.type_mouvement === t.val
                    ? `2px solid ${t.couleur}`
                    : '2px solid var(--couleur-bordure-legere)',
                  background: formulaire.type_mouvement === t.val
                    ? `${t.couleur}10`
                    : 'var(--couleur-surface)',
                  transition: 'all var(--transition-normale)',
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <t.icone size={22} color={t.couleur} />
                  <strong style={{ color: formulaire.type_mouvement === t.val ? t.couleur : 'inherit' }}>
                    {t.label}
                  </strong>
                </div>
                <p className="texte-secondaire" style={{ fontSize: '12px', margin: 0 }}>{t.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Quantité et Raison */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <Info size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-accent)' }} />
            Détails du mouvement
          </h3>
          <div className="formulaire-grille formulaire-grille--2cols">
            <div className="champ-groupe">
              <label className="champ-label">Quantité ({article.unite}) *</label>
              <input
                className="champ-saisie"
                type="number"
                step="0.001"
                min="0"
                value={formulaire.quantite || ''}
                onChange={(e) => setFormulaire({ ...formulaire, quantite: parseFloat(e.target.value) || 0 })}
                placeholder={`Quantité en ${article.unite}`}
                style={{ fontSize: '1.1rem' }}
                required
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Impact estimé</label>
              <div style={{
                padding: '12px 16px',
                borderRadius: 'var(--rayon-md)',
                background: 'var(--couleur-fond)',
                border: '1px solid var(--couleur-bordure-legere)',
                lineHeight: '1.6',
              }}>
                <p style={{ margin: 0 }}>
                  <span className="texte-secondaire">Stock actuel :</span>{' '}
                  <strong>{article.quantite} {article.unite}</strong>
                </p>
                {formulaire.quantite > 0 && (
                  <p style={{ margin: '4px 0 0 0' }}>
                    <span className="texte-secondaire">Après mouvement :</span>{' '}
                    <strong style={{ color: typeActif?.couleur }}>
                      {formulaire.type_mouvement === 'ajustement' ? formulaire.quantite : Math.max(0, nouvelleQuantite)} {article.unite}
                    </strong>
                  </p>
                )}
              </div>
            </div>
            <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
              <label className="champ-label">Raison / Commentaire</label>
              <textarea
                className="champ-saisie champ-textarea"
                value={formulaire.raison || ''}
                onChange={(e) => setFormulaire({ ...formulaire, raison: e.target.value })}
                placeholder="Ex: Livraison fournisseur, consommation atelier, correction inventaire..."
                style={{ minHeight: '100px' }}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
