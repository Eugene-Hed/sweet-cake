// =============================================================================
// Page Ateliers — CRUD
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { ateliersService, type CreerAtelierPayload } from '@/services/ateliers.service';
import Pagination from '@/composants/communs/Pagination';
import Badge, { varianteStatutAtelier, labelStatut } from '@/composants/communs/Badge';
import Modale from '@/composants/communs/Modale';
import Confirmation from '@/composants/communs/Confirmation';
import type { Atelier, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageAteliers() {
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const [modaleOuverte, setModaleOuverte] = useState(false);
  const [atelierEdite, setAtelierEdite] = useState<Atelier | null>(null);
  const [formulaire, setFormulaire] = useState<CreerAtelierPayload>({ titre: '', description: '', date_atelier: '', heure_debut: '', heure_fin: '', capacite: 10, prix: 0 });
  const [sauvegarde, setSauvegarde] = useState(false);
  const [suppression, setSuppression] = useState<number | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await ateliersService.listerTous(parametres);
      setAteliers(r.data.donnees || []);
      if (r.data.meta) setMeta(r.data.meta);
    } catch { toast.error('Erreur chargement ateliers'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  const ouvrirCreation = () => {
    setAtelierEdite(null);
    setFormulaire({ titre: '', description: '', date_atelier: '', heure_debut: '14:00', heure_fin: '17:00', capacite: 10, prix: 0 });
    setModaleOuverte(true);
  };

  const ouvrirEdition = (a: Atelier) => {
    setAtelierEdite(a);
    setFormulaire({ titre: a.titre, description: a.description || '', date_atelier: a.date_atelier?.split('T')[0] || '', heure_debut: a.heure_debut, heure_fin: a.heure_fin, capacite: a.capacite, prix: a.prix });
    setModaleOuverte(true);
  };

  const sauvegarder = async () => {
    if (!formulaire.titre.trim() || !formulaire.date_atelier) { toast.error('Titre et date requis'); return; }
    setSauvegarde(true);
    try {
      const payload = { ...formulaire, prix: Number(formulaire.prix), capacite: Number(formulaire.capacite) };
      if (atelierEdite) {
        await ateliersService.mettreAJour(atelierEdite.id, payload);
        toast.success('Atelier modifié');
      } else {
        await ateliersService.creer(payload);
        toast.success('Atelier créé');
      }
      setModaleOuverte(false);
      charger();
    } catch { toast.error('Erreur de sauvegarde'); }
    finally { setSauvegarde(false); }
  };

  const supprimer = async () => {
    if (suppression === null) return;
    try { await ateliersService.supprimer(suppression); toast.success('Atelier supprimé'); setSuppression(null); charger(); }
    catch { toast.error('Erreur de suppression'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Ateliers</h1>
        <button className="bouton bouton--primaire" onClick={ouvrirCreation}><Plus size={18} /> Nouvel atelier</button>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Titre</th><th>Date</th><th>Horaire</th><th>Places</th><th>Prix</th><th>Statut</th><th>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={7} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : ateliers.length === 0 ? (
              <tr><td colSpan={7} className="tableau-vide">Aucun atelier</td></tr>
            ) : ateliers.map((a) => (
              <tr key={a.id}>
                <td><strong>{a.titre}</strong></td>
                <td>{a.date_atelier ? new Date(a.date_atelier).toLocaleDateString('fr-FR') : '—'}</td>
                <td className="texte-secondaire">{a.heure_debut} – {a.heure_fin}</td>
                <td>
                  <span style={{ color: (a.places_reservees || 0) >= a.capacite ? 'var(--couleur-erreur)' : 'inherit' }}>
                    {a.places_reservees || 0}/{a.capacite}
                  </span>
                </td>
                <td><strong>{Number(a.prix).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</strong></td>
                <td><Badge variante={varianteStatutAtelier[a.statut] || 'neutre'}>{labelStatut[a.statut] || a.statut}</Badge></td>
                <td>
                  <div className="tableau-actions">
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

      <Modale estOuverte={modaleOuverte} onFermer={() => setModaleOuverte(false)} large
        titre={atelierEdite ? 'Modifier l\'atelier' : 'Nouvel atelier'}
        pied={<>
          <button className="bouton bouton--fantome" onClick={() => setModaleOuverte(false)}>Annuler</button>
          <button className="bouton bouton--primaire" onClick={sauvegarder} disabled={sauvegarde}>
            {sauvegarde ? <span className="chargement-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> : 'Enregistrer'}
          </button>
        </>}>
        <div className="formulaire-grille formulaire-grille--2cols">
          <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
            <label className="champ-label">Titre *</label>
            <input className="champ-saisie" value={formulaire.titre} onChange={(e) => setFormulaire({ ...formulaire, titre: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Date *</label>
            <input className="champ-saisie" type="date" value={formulaire.date_atelier} onChange={(e) => setFormulaire({ ...formulaire, date_atelier: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Prix (€) *</label>
            <input className="champ-saisie" type="number" step="0.01" min="0" value={formulaire.prix}
              onChange={(e) => setFormulaire({ ...formulaire, prix: parseFloat(e.target.value) || 0 })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Heure début</label>
            <input className="champ-saisie" type="time" value={formulaire.heure_debut} onChange={(e) => setFormulaire({ ...formulaire, heure_debut: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Heure fin</label>
            <input className="champ-saisie" type="time" value={formulaire.heure_fin} onChange={(e) => setFormulaire({ ...formulaire, heure_fin: e.target.value })} />
          </div>
          <div className="champ-groupe">
            <label className="champ-label">Capacité</label>
            <input className="champ-saisie" type="number" min="1" value={formulaire.capacite}
              onChange={(e) => setFormulaire({ ...formulaire, capacite: parseInt(e.target.value) || 1 })} />
          </div>
          <div className="champ-groupe" style={{ gridColumn: '1 / -1' }}>
            <label className="champ-label">Description</label>
            <textarea className="champ-saisie champ-textarea" value={formulaire.description || ''} onChange={(e) => setFormulaire({ ...formulaire, description: e.target.value })} />
          </div>
        </div>
      </Modale>

      <Confirmation estOuverte={suppression !== null} onFermer={() => setSuppression(null)} onConfirmer={supprimer}
        message="Supprimer cet atelier ?" labelConfirmer="Supprimer" />
    </div>
  );
}
