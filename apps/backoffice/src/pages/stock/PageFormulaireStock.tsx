// =============================================================================
// Page Formulaire Stock — Création et Édition (pleine page)
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, AlertTriangle } from 'lucide-react';
import { stockService, type CreerArticleStockPayload } from '@/services/stock.service';
import type { ArticleStock } from '@/types';
import toast from 'react-hot-toast';

export default function PageFormulaireStock() {
  const { id } = useParams<{ id: string }>();
  const naviguer = useNavigate();
  const estEdition = Boolean(id && id !== 'nouveau');

  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [formulaire, setFormulaire] = useState<CreerArticleStockPayload>({
    nom: '',
    unite: 'kg',
    quantite: 0,
    seuil_minimal: 10,
  });

  useEffect(() => {
    const initialiser = async () => {
      setChargement(true);
      try {
        if (estEdition) {
          const r = await stockService.trouverParId(Number(id));
          const a = r.data.donnees;
          if (a) {
            setFormulaire({
              nom: a.nom,
              unite: a.unite,
              quantite: a.quantite,
              seuil_minimal: a.seuil_minimal,
            });
          }
        }
      } catch {
        toast.error('Article introuvable');
        naviguer('/stock');
      } finally {
        setChargement(false);
      }
    };
    initialiser();
  }, [id, estEdition, naviguer]);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaire.nom.trim()) {
      toast.error('Le nom de l\'article est requis');
      return;
    }
    setSauvegarde(true);
    try {
      if (estEdition) {
        await stockService.mettreAJour(Number(id), {
          nom: formulaire.nom,
          unite: formulaire.unite,
          seuil_minimal: formulaire.seuil_minimal,
        });
        toast.success('Article mis à jour');
      } else {
        await stockService.creer(formulaire);
        toast.success('Article créé');
      }
      naviguer('/stock');
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSauvegarde(false);
    }
  };

  if (chargement) {
    return <div className="chargement-page"><div className="chargement-spinner chargement-spinner--lg" /></div>;
  }

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/stock')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-titre">
            {estEdition ? `Modifier l'article #${id}` : 'Nouvel Article de Stock'}
          </h1>
        </div>
        <div className="page-actions">
          <button className="bouton bouton--fantome" onClick={() => naviguer('/stock')} disabled={sauvegarde}>
            Annuler
          </button>
          <button className="bouton bouton--primaire" onClick={soumettre} disabled={sauvegarde}>
            {sauvegarde ? (
              <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} />
            ) : (
              <><Save size={18} /> Enregistrer</>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={soumettre} className="commande-detail-grille">
        {/* Informations de l'article */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <Package size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-primaire)' }} />
            Informations de l'article
          </h3>
          <div className="formulaire-grille formulaire-grille--2cols">
            <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
              <label className="champ-label">Nom de l'article *</label>
              <input
                className="champ-saisie"
                value={formulaire.nom}
                onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
                placeholder="Ex: Farine de blé, Beurre, Sucre..."
                required
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Unité de mesure *</label>
              <input
                className="champ-saisie"
                value={formulaire.unite}
                onChange={(e) => setFormulaire({ ...formulaire, unite: e.target.value })}
                placeholder="kg, L, pièces, sachets..."
              />
              <p className="legende">L'unité utilisée pour compter cet article.</p>
            </div>
            {!estEdition && (
              <div className="champ-groupe">
                <label className="champ-label">Quantité initiale</label>
                <input
                  className="champ-saisie"
                  type="number"
                  step="0.001"
                  min="0"
                  value={formulaire.quantite || 0}
                  onChange={(e) => setFormulaire({ ...formulaire, quantite: parseFloat(e.target.value) || 0 })}
                />
                <p className="legende">Stock de départ au moment de la création.</p>
              </div>
            )}
          </div>
        </div>

        {/* Seuils & Alertes */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <AlertTriangle size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-avertissement, #F5C563)' }} />
            Seuils & Alertes
          </h3>
          <div className="formulaire-grille">
            <div className="champ-groupe">
              <label className="champ-label">Seuil minimal d'alerte</label>
              <input
                className="champ-saisie"
                type="number"
                step="0.001"
                min="0"
                value={formulaire.seuil_minimal || 0}
                onChange={(e) => setFormulaire({ ...formulaire, seuil_minimal: parseFloat(e.target.value) || 0 })}
              />
              <p className="legende">
                Quand la quantité en stock descend en dessous de ce seuil, une alerte « stock faible » apparaîtra sur le tableau de bord.
              </p>
            </div>
          </div>
        </div>

        {/* Résumé */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>Résumé</h3>
          <div className="texte-secondaire" style={{ lineHeight: '1.6' }}>
            <p><strong>{formulaire.nom || 'Sans nom'}</strong></p>
            <p>Unité : {formulaire.unite || '—'}</p>
            {!estEdition && <p>Quantité initiale : {formulaire.quantite} {formulaire.unite}</p>}
            <p>Seuil d'alerte : {formulaire.seuil_minimal} {formulaire.unite}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
