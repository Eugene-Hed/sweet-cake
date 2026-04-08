// =============================================================================
// Page Journaux d'Audit — Lecture seule
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search } from 'lucide-react';
import { journauxAuditService } from '@/services/journaux-audit.service';
import Pagination from '@/composants/communs/Pagination';
import type { JournalAudit, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageAudit() {
  const [journaux, setJournaux] = useState<JournalAudit[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await journauxAuditService.listerTous(parametres);
      setJournaux(r.data.donnees || []);
      if (r.data.meta) setMeta(r.data.meta);
    } catch { toast.error('Erreur chargement des journaux'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Journaux d'audit</h1>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher par action..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead><tr><th>Date</th><th>Action</th><th>Entité</th><th>Utilisateur</th><th>Détails</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={5} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : journaux.length === 0 ? (
              <tr><td colSpan={5} className="tableau-vide">Aucun journal d'audit</td></tr>
            ) : journaux.map((j) => (
              <tr key={j.id}>
                <td className="texte-secondaire" style={{ whiteSpace: 'nowrap' }}>{new Date(j.created_at).toLocaleString('fr-FR')}</td>
                <td><strong>{j.action}</strong></td>
                <td>{j.entite}{j.entite_id ? ` #${j.entite_id}` : ''}</td>
                <td>{j.utilisateur?.nom_complet || (j.utilisateur_id ? `#${j.utilisateur_id}` : '—')}</td>
                <td className="texte-secondaire" style={{ maxWidth: 300, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {j.details ? JSON.stringify(j.details).substring(0, 80) : '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>
    </div>
  );
}
