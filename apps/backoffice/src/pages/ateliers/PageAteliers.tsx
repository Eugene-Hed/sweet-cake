// =============================================================================
// Page Ateliers — Liste avec navigation vers formulaire
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Pencil, Trash2 } from 'lucide-react';
import { ateliersService } from '@/services/ateliers.service';
import Pagination from '@/composants/communs/Pagination';
import Badge, { varianteStatutAtelier, labelStatut } from '@/composants/communs/Badge';
import Confirmation from '@/composants/communs/Confirmation';
import type { Atelier, MetaPagination, ParametresPagination } from '@/types';
import { formaterFCFA } from '@/utilitaires/formatage';
import toast from 'react-hot-toast';

export default function PageAteliers() {
  const naviguer = useNavigate();
  const [ateliers, setAteliers] = useState<Atelier[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
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

  const supprimer = async () => {
    if (suppression === null) return;
    try {
      await ateliersService.supprimer(suppression);
      toast.success('Atelier supprimé');
      setSuppression(null);
      charger();
    } catch { toast.error('Erreur de suppression'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Ateliers de Formation</h1>
        <button className="bouton bouton--primaire" onClick={() => naviguer('/ateliers/nouveau')}>
          <Plus size={18} /> Nouvel atelier
        </button>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher un atelier..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Titre</th><th>Date</th><th>Horaire</th><th>Places</th><th>Prix</th><th>Statut</th><th style={{ textAlign: 'right' }}>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={7} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : ateliers.length === 0 ? (
              <tr><td colSpan={7} className="tableau-vide">Aucun atelier trouvé</td></tr>
            ) : ateliers.map((a, idx) => (
              <tr key={a.id} className="animer-entree" style={{ animationDelay: `${idx * 0.05}s` }}>
                <td><strong>{a.titre}</strong></td>
                <td>{a.date_atelier ? new Date(a.date_atelier).toLocaleDateString('fr-FR') : '—'}</td>
                <td className="texte-secondaire">{a.heure_debut} – {a.heure_fin}</td>
                <td>
                  <span style={{ color: (a.places_reservees || 0) >= a.capacite ? 'var(--couleur-erreur)' : 'inherit' }}>
                    {a.places_reservees || 0}/{a.capacite}
                  </span>
                </td>
                <td><strong>{formaterFCFA(a.prix)}</strong></td>
                <td><Badge variante={varianteStatutAtelier[a.statut] || 'neutre'}>{labelStatut[a.statut] || a.statut}</Badge></td>
                <td>
                  <div className="tableau-actions" style={{ justifyContent: 'flex-end' }}>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer(`/ateliers/${a.id}`)} title="Modifier"><Pencil size={16} /></button>
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setSuppression(a.id)} title="Supprimer"><Trash2 size={16} color="var(--couleur-erreur)" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      <Confirmation estOuverte={suppression !== null} onFermer={() => setSuppression(null)} onConfirmer={supprimer}
        message="Voulez-vous supprimer cet atelier ? Cette action est irréversible." labelConfirmer="Supprimer" />
    </div>
  );
}
