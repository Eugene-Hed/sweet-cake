// =============================================================================
// Page Formulaire Produit — Création et Édition
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Package, Tag, FileText, Image as ImageIcon, Eye } from 'lucide-react';
import { produitsService, type CreerProduitPayload } from '@/services/produits.service';
import { categoriesService } from '@/services/categories.service';
import type { Produit, Categorie } from '@/types';
import toast from 'react-hot-toast';

export default function PageFormulaireProduit() {
  const { id } = useParams<{ id: string }>();
  const naviguer = useNavigate();
  const estEdition = Boolean(id && id !== 'nouveau');

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);

  const [formulaire, setFormulaire] = useState<CreerProduitPayload>({
    categorie_id: 0,
    nom: '',
    prix: 0,
    description: '',
    image_url: '',
    est_disponible: true,
    est_actif: true
  });

  useEffect(() => {
    const initialiser = async () => {
      setChargement(true);
      try {
        // Charger les catégories d'abord
        const rCat = await categoriesService.listerToutes({ limite: 100 });
        const listCat = rCat.data.donnees || [];
        setCategories(listCat);

        if (estEdition) {
          const rProd = await produitsService.trouverParId(Number(id));
          const p = rProd.data.donnees;
          if (p) {
            setFormulaire({
              categorie_id: p.categorie_id,
              nom: p.nom,
              prix: p.prix,
              description: p.description || '',
              image_url: p.image_url || '',
              est_disponible: p.est_disponible,
              est_actif: p.est_actif
            });
          }
        } else if (listCat.length > 0) {
          setFormulaire(f => ({ ...f, categorie_id: listCat[0].id }));
        }
      } catch (err) {
        toast.error('Erreur lors de l\'initialisation');
        naviguer('/produits');
      } finally {
        setChargement(false);
      }
    };
    initialiser();
  }, [id, estEdition, naviguer]);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaire.nom.trim() || !formulaire.categorie_id) {
      toast.error('Le nom et la catégorie sont requis');
      return;
    }

    setSauvegarde(true);
    try {
      const payload = { ...formulaire, prix: Number(formulaire.prix) };
      if (estEdition) {
        await produitsService.mettreAJour(Number(id), payload);
        toast.success('Produit mis à jour avec succès');
      } else {
        await produitsService.creer(payload);
        toast.success('Produit créé avec succès');
      }
      naviguer('/produits');
    } catch (err) {
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
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/produits')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-titre">
            {estEdition ? `Modifier le produit #${id}` : 'Nouveau Produit'}
          </h1>
        </div>
        <div className="page-actions">
          <button className="bouton bouton--fantome" onClick={() => naviguer('/produits')} disabled={sauvegarde}>
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
        {/* Section Informations de Base */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <Package size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-primaire)' }} />
            Informations de base
          </h3>
          <div className="formulaire-grille">
            <div className="champ-groupe">
              <label className="champ-label">Nom du produit *</label>
              <input 
                className="champ-saisie" 
                value={formulaire.nom} 
                onChange={(e) => setFormulaire({ ...formulaire, nom: e.target.value })} 
                placeholder="Ex: Tartelette aux Fraises"
                required
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Catégorie *</label>
              <select 
                className="champ-saisie champ-select" 
                value={formulaire.categorie_id}
                onChange={(e) => setFormulaire({ ...formulaire, categorie_id: Number(e.target.value) })}
                required
              >
                <option value={0} disabled>Choisir une catégorie...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.nom}</option>)}
              </select>
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Prix de vente (F CFA) *</label>
              <input 
                className="champ-saisie" 
                type="number" 
                step="0.01" 
                min="0" 
                value={formulaire.prix}
                onChange={(e) => setFormulaire({ ...formulaire, prix: parseFloat(e.target.value) || 0 })} 
                required
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Statut et Visibilité</label>
              <div style={{ display: 'flex', gap: 20, marginTop: 10 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formulaire.est_disponible} 
                    onChange={(e) => setFormulaire({ ...formulaire, est_disponible: e.target.checked })} 
                    style={{ width: 18, height: 18 }}
                  />
                  <span>En stock / Disponible</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={formulaire.est_actif} 
                    onChange={(e) => setFormulaire({ ...formulaire, est_actif: e.target.checked })} 
                    style={{ width: 18, height: 18 }}
                  />
                  <span>Afficher sur la boutique</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Section Description et Image */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <FileText size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-secondaire)' }} />
            Description et Médias
          </h3>
          <div className="formulaire-grille">
            <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
              <label className="champ-label">Description du produit</label>
              <textarea 
                className="champ-saisie champ-textarea" 
                value={formulaire.description || ''} 
                onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })} 
                placeholder="Décrivez les ingrédients, les saveurs..." 
                style={{ minHeight: '120px' }}
              />
            </div>
            <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
              <label className="champ-label">URL de l'image</label>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ flex: 1, position: 'relative' }}>
                  <input 
                    className="champ-saisie" 
                    value={formulaire.image_url || ''} 
                    onChange={(e) => setFormulaire({ ...formulaire, image_url: e.target.value })} 
                    placeholder="https://... / image.jpg" 
                    style={{ paddingLeft: '40px' }}
                  />
                  <ImageIcon size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
                </div>
                {formulaire.image_url && (
                  <div className="apercu-image" style={{ width: 52, height: 52, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--couleur-bordure)' }}>
                    <img src={formulaire.image_url} alt="Aperçu" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Carte de Résumé / Aide */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <Eye size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-accent)' }} />
            Aperçu de la fiche
          </h3>
          <div className="texte-secondaire" style={{ lineHeight: '1.6' }}>
            <p><strong>{formulaire.nom || 'Sans nom'}</strong></p>
            <p>Prix : {Number(formulaire.prix).toLocaleString('fr-FR')} F CFA</p>
            <p>Catégorie : {categories.find(c => c.id === formulaire.categorie_id)?.nom || 'Aucune'}</p>
            <hr style={{ margin: '16px 0', borderColor: 'var(--couleur-bordure-legere)' }} />
            <p style={{ fontSize: '13px' }}>
              <em>Conseil : Utilisez des noms courts et des images appétissantes pour augmenter les ventes.</em>
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}
