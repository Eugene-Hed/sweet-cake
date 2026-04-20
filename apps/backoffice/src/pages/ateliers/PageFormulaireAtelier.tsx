// =============================================================================
// Page Formulaire Atelier — Création et Édition (pleine page)
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, GraduationCap, Clock, Users } from 'lucide-react';
import { ateliersService, type CreerAtelierPayload } from '@/services/ateliers.service';
import { formaterFCFA } from '@/utilitaires/formatage';
import type { Atelier } from '@/types';
import toast from 'react-hot-toast';

export default function PageFormulaireAtelier() {
  const { id } = useParams<{ id: string }>();
  const naviguer = useNavigate();
  const estEdition = Boolean(id && id !== 'nouveau');

  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);
  const [formulaire, setFormulaire] = useState<CreerAtelierPayload>({
    titre: '',
    description: '',
    date_atelier: '',
    heure_debut: '14:00',
    heure_fin: '17:00',
    capacite: 10,
    prix: 0,
  });

  useEffect(() => {
    const initialiser = async () => {
      setChargement(true);
      try {
        if (estEdition) {
          const r = await ateliersService.trouverParId(Number(id));
          const a = r.data.donnees;
          if (a) {
            setFormulaire({
              titre: a.titre,
              description: a.description || '',
              date_atelier: a.date_atelier?.split('T')[0] || '',
              heure_debut: a.heure_debut,
              heure_fin: a.heure_fin,
              capacite: a.capacite,
              prix: a.prix,
            });
          }
        }
      } catch {
        toast.error('Atelier introuvable');
        naviguer('/ateliers');
      } finally {
        setChargement(false);
      }
    };
    initialiser();
  }, [id, estEdition, naviguer]);

  const soumettre = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formulaire.titre.trim() || !formulaire.date_atelier) {
      toast.error('Le titre et la date sont requis');
      return;
    }
    setSauvegarde(true);
    try {
      const payload = { ...formulaire, prix: Number(formulaire.prix), capacite: Number(formulaire.capacite) };
      if (estEdition) {
        await ateliersService.mettreAJour(Number(id), payload);
        toast.success('Atelier mis à jour');
      } else {
        await ateliersService.creer(payload);
        toast.success('Atelier créé');
      }
      naviguer('/ateliers');
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
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/ateliers')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-titre">
            {estEdition ? `Modifier l'atelier #${id}` : 'Nouvel Atelier'}
          </h1>
        </div>
        <div className="page-actions">
          <button className="bouton bouton--fantome" onClick={() => naviguer('/ateliers')} disabled={sauvegarde}>
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
        {/* Informations principales */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <GraduationCap size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-primaire)' }} />
            Informations principales
          </h3>
          <div className="formulaire-grille formulaire-grille--2cols">
            <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
              <label className="champ-label">Titre de l'atelier *</label>
              <input
                className="champ-saisie"
                value={formulaire.titre}
                onChange={(e) => setFormulaire({ ...formulaire, titre: e.target.value })}
                placeholder="Ex: Initiation à la pâtisserie française"
                required
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Date de l'atelier *</label>
              <input
                className="champ-saisie"
                type="date"
                value={formulaire.date_atelier}
                onChange={(e) => setFormulaire({ ...formulaire, date_atelier: e.target.value })}
                required
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Prix (F CFA) *</label>
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
            <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
              <label className="champ-label">Description</label>
              <textarea
                className="champ-saisie champ-textarea"
                value={formulaire.description || ''}
                onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })}
                placeholder="Programme, prérequis, ce que les participants apprendront..."
                style={{ minHeight: '120px' }}
              />
            </div>
          </div>
        </div>

        {/* Planning & Capacité */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>
            <Clock size={20} style={{ verticalAlign: 'middle', marginRight: 8, color: 'var(--couleur-secondaire)' }} />
            Planning & Capacité
          </h3>
          <div className="formulaire-grille formulaire-grille--2cols">
            <div className="champ-groupe">
              <label className="champ-label">Heure de début</label>
              <input
                className="champ-saisie"
                type="time"
                value={formulaire.heure_debut}
                onChange={(e) => setFormulaire({ ...formulaire, heure_debut: e.target.value })}
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">Heure de fin</label>
              <input
                className="champ-saisie"
                type="time"
                value={formulaire.heure_fin}
                onChange={(e) => setFormulaire({ ...formulaire, heure_fin: e.target.value })}
              />
            </div>
            <div className="champ-groupe">
              <label className="champ-label">
                <Users size={16} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                Capacité maximale
              </label>
              <input
                className="champ-saisie"
                type="number"
                min="1"
                value={formulaire.capacite}
                onChange={(e) => setFormulaire({ ...formulaire, capacite: parseInt(e.target.value) || 1 })}
              />
              <p className="legende">Nombre de places disponibles pour cet atelier.</p>
            </div>
          </div>
        </div>

        {/* Aperçu */}
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 20 }}>Aperçu</h3>
          <div className="texte-secondaire" style={{ lineHeight: '1.6' }}>
            <p><strong>{formulaire.titre || 'Sans titre'}</strong></p>
            <p>Date : {formulaire.date_atelier ? new Date(formulaire.date_atelier + 'T00:00').toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : '—'}</p>
            <p>Horaire : {formulaire.heure_debut || '—'} → {formulaire.heure_fin || '—'}</p>
            <p>Places : {formulaire.capacite} | Prix : {formaterFCFA(formulaire.prix)}</p>
          </div>
        </div>
      </form>
    </div>
  );
}
