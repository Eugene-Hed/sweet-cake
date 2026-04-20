// =============================================================================
// Page Détail Utilisateur
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { utilisateursService } from '@/services/utilisateurs.service';
import Badge from '@/composants/communs/Badge';
import type { Utilisateur } from '@/types';
import toast from 'react-hot-toast';

export default function PageDetailUtilisateur() {
  const { id } = useParams<{ id: string }>();
  const naviguer = useNavigate();
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [formulaire, setFormulaire] = useState({ nom_complet: '', telephone: '', langue_preferee: 'fr' });
  const [chargement, setChargement] = useState(true);
  const [sauvegarde, setSauvegarde] = useState(false);

  useEffect(() => {
    const charger = async () => {
      try {
        const r = await utilisateursService.trouverParId(Number(id));
        const u = r.data.donnees;
        if (u) {
          setUtilisateur(u);
          setFormulaire({ nom_complet: u.nom_complet, telephone: u.telephone || '', langue_preferee: u.langue_preferee || 'fr' });
        }
      } catch { toast.error('Utilisateur introuvable'); naviguer('/utilisateurs'); }
      finally { setChargement(false); }
    };
    charger();
  }, [id, naviguer]);

  const sauvegarder = async () => {
    setSauvegarde(true);
    try {
      await utilisateursService.mettreAJour(Number(id), formulaire);
      toast.success('Utilisateur mis à jour');
    } catch { toast.error('Erreur de mise à jour'); }
    finally { setSauvegarde(false); }
  };

  if (chargement) return <div className="chargement-page"><div className="chargement-spinner chargement-spinner--lg" /></div>;
  if (!utilisateur) return null;

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/utilisateurs')}>
            <ArrowLeft size={18} />
          </button>
          <h1 className="page-titre">{utilisateur.nom_complet}</h1>
          <Badge variante={utilisateur.est_actif ? 'succes' : 'erreur'}>
            {utilisateur.est_actif ? 'Actif' : 'Inactif'}
          </Badge>
        </div>
      </div>

      <div className="carte" style={{ maxWidth: 600 }}>
        <div className="formulaire-grille" style={{ gap: '20px' }}>
          <div className="champ-groupe">
            <label className="champ-label">Email</label>
            <input className="champ-saisie" value={utilisateur.email} disabled style={{ opacity: 0.6 }} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Rôle</label>
            <input className="champ-saisie" value={utilisateur.role} disabled style={{ opacity: 0.6, textTransform: 'capitalize' }} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Nom complet</label>
            <input className="champ-saisie" value={formulaire.nom_complet}
              onChange={(e) => setFormulaire({ ...formulaire, nom_complet: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Téléphone</label>
            <input className="champ-saisie" value={formulaire.telephone} placeholder="+237..."
              onChange={(e) => setFormulaire({ ...formulaire, telephone: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Langue préférée</label>
            <select className="champ-saisie champ-select" value={formulaire.langue_preferee}
              onChange={(e) => setFormulaire({ ...formulaire, langue_preferee: e.target.value })}>
              <option value="fr">Français</option>
              <option value="en">English</option>
            </select>
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Inscrit le</label>
            <input className="champ-saisie" value={new Date(utilisateur.created_at).toLocaleString('fr-FR')} disabled style={{ opacity: 0.6 }} />
          </div>
          <button className="bouton bouton--primaire" onClick={sauvegarder} disabled={sauvegarde} style={{ justifySelf: 'start' }}>
            {sauvegarde ? <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : <><Save size={16} /> Enregistrer</>}
          </button>
        </div>
      </div>
    </div>
  );
}
