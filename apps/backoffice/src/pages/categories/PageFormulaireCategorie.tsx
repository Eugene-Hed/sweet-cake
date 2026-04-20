// =============================================================================
// Page Formulaire Catégorie — Création et Édition (pleine page)
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, FolderOpen } from 'lucide-react';
import { categoriesService, type CreerCategoriePayload } from '@/services/categories.service';
import type { Categorie } from '@/types';
import toast from 'react-hot-toast';

export default function PageFormulaireCategorie() {
  const { id } = useParams<{ id: string }>();
  const naviguer = useNavigate();
  const estEdition = Boolean(id && id !== 'nouveau');

  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [formulaire, setFormulaire] = useState<CreerCategoriePayload & { est_active?: boolean }>({
    nom: '',
    description: '',
    est_active: true,
  });

  useEffect(() => {
    const initialiser = async () => {
      setChargement(true);
      try {
        if (estEdition) {
          const r = await categoriesService.trouverParId(Number(id));
          const c = r.data.donnees;
          if (c) {
            setFormulaire({ nom: c.nom, description: c.description || '', est_active: c.est_active });
          }
        }
      } catch {
        toast.error('Catégorie introuvable');
        naviguer('/categories');
      } finally {
        setChargement(false);
      }
    };
    initialiser();
  }, [id, estEdition, naviguer]);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaire.nom.trim()) {
      toast.error('Le nom de la catégorie est requis');
      return;
    }
    setSauvegarde(true);
    try {
      if (estEdition) {
        await categoriesService.mettreAJour(Number(id), formulaire);
        toast.success('Catégorie mise à jour');
      } else {
        await categoriesService.creer(formulaire);
        toast.success('Catégorie créée');
      }
      naviguer('/categories');
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
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/categories')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-titre">
            {estEdition ? `Modifier la catégorie #${id}` : 'Nouvelle Catégorie'}
          </h1>
        </div>
        <div className="page-actions">
          <button className="bouton bouton--fantome" onClick={() => naviguer('/categories')} disabled={sauvegarde}>
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
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <FolderOpen size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-primaire)' }} />
            Informations de la catégorie
          </h3>
          <div className="formulaire-grille" style={{ gap: 'var(--espace-lg)' }}>
            <div className="champ-groupe">
              <label className="champ-label">Nom de la catégorie *</label>
              <input
                className="champ-saisie"
                value={formulaire.nom}
                onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })}
                placeholder="Ex: Pâtisseries fines, Boissons..."
                required
              />
              <p className="legende">Ce nom sera affiché dans le catalogue clients.</p>
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Description</label>
              <textarea
                className="champ-saisie champ-textarea"
                value={formulaire.description || ''}
                onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })}
                placeholder="Décrivez cette catégorie pour vos collaborateurs..."
                style={{ minHeight: '120px' }}
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label" style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={formulaire.est_active}
                  onChange={(e) => setFormulaire({ ...formulaire, est_active: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: 'pointer' }}
                />
                <span>Catégorie active</span>
              </label>
              <p className="legende" style={{ marginLeft: 28 }}>
                Si désactivée, les produits associés ne seront plus visibles dans la boutique.
              </p>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
