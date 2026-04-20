// =============================================================================
// Page Journaux d'Audit — Traçabilité des actions (lecture seule)
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, Shield, User, Clock, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { journauxAuditService } from '@/services/journaux-audit.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import type { JournalAudit, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

const COULEURS_ACTION: Record<string, string> = {
  creer: '#28A745',
  modifier: '#F5C563',
  supprimer: '#DC3545',
  connexion: '#17A2B8',
  deconnexion: '#6C757D',
};

const VARIANTES_ACTION: Record<string, 'succes' | 'avertissement' | 'erreur' | 'information' | 'neutre'> = {
  creer: 'succes',
  modifier: 'avertissement',
  supprimer: 'erreur',
  connexion: 'information',
  deconnexion: 'neutre',
};

function labelAction(action: string): string {
  const map: Record<string, string> = {
    creer: 'Création',
    modifier: 'Modification',
    supprimer: 'Suppression',
    connexion: 'Connexion',
    deconnexion: 'Déconnexion',
  };
  return map[action] || action;
}

export default function PageAudit() {
  const [journaux, setJournaux] = useState<JournalAudit[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const [detailOuvert, setDetailOuvert] = useState<number | null>(null);

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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Shield size={24} style={{ color: 'var(--couleur-primaire)' }} />
          <div>
            <h1 className="page-titre" style={{ marginBottom: 2 }}>Journaux d'audit</h1>
            <p className="texte-secondaire" style={{ fontSize: 13, margin: 0 }}>
              Historique complet des actions effectuées sur la plateforme
            </p>
          </div>
        </div>
      </div>

      {/* Résumé */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 'var(--espace-lg)' }}>
        <div className="carte" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <p className="texte-secondaire" style={{ fontSize: 12, marginBottom: 4 }}>Total des entrées</p>
          <strong style={{ fontSize: '1.4rem' }}>{meta.total}</strong>
        </div>
        <div className="carte" style={{ padding: '16px 20px', textAlign: 'center' }}>
          <p className="texte-secondaire" style={{ fontSize: 12, marginBottom: 4 }}>Page actuelle</p>
          <strong style={{ fontSize: '1.4rem' }}>{meta.page} / {meta.total_pages || 1}</strong>
        </div>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher par action, entité, utilisateur..."
            value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead>
            <tr>
              <th style={{ width: 170 }}>Date</th>
              <th style={{ width: 130 }}>Action</th>
              <th>Entité</th>
              <th>Utilisateur</th>
              <th style={{ textAlign: 'right', width: 80 }}>Détails</th>
            </tr>
          </thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={5} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : journaux.length === 0 ? (
              <tr><td colSpan={5} className="tableau-vide">Aucun journal d'audit trouvé</td></tr>
            ) : journaux.map((j, idx) => (
              <>
                <tr key={j.id} className="animer-entree" style={{ animationDelay: `${idx * 0.04}s`, cursor: j.details ? 'pointer' : 'default' }}
                  onClick={() => j.details && setDetailOuvert(detailOuvert === j.id ? null : j.id)}>
                  <td className="texte-secondaire" style={{ whiteSpace: 'nowrap' }}>
                    <Clock size={14} style={{ verticalAlign: 'middle', marginRight: 6, opacity: 0.5 }} />
                    {new Date(j.created_at).toLocaleString('fr-FR')}
                  </td>
                  <td>
                    <Badge variante={VARIANTES_ACTION[j.action] || 'neutre'}>
                      {labelAction(j.action)}
                    </Badge>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FileText size={14} style={{ opacity: 0.5 }} />
                      <strong>{j.entite}</strong>
                      {j.entite_id && <span className="texte-secondaire">#{j.entite_id}</span>}
                    </span>
                  </td>
                  <td>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <User size={14} style={{ opacity: 0.5 }} />
                      {j.utilisateur?.nom_complet || (j.utilisateur_id ? `Utilisateur #${j.utilisateur_id}` : '—')}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    {j.details ? (
                      detailOuvert === j.id
                        ? <ChevronUp size={16} style={{ opacity: 0.6 }} />
                        : <ChevronDown size={16} style={{ opacity: 0.6 }} />
                    ) : <span className="texte-secondaire">—</span>}
                  </td>
                </tr>
                {detailOuvert === j.id && j.details && (
                  <tr key={`detail-${j.id}`}>
                    <td colSpan={5} style={{ padding: 0 }}>
                      <div style={{
                        padding: '12px 20px',
                        background: 'var(--couleur-fond)',
                        borderLeft: `3px solid ${COULEURS_ACTION[j.action] || 'var(--couleur-bordure)'}`,
                        fontSize: '13px',
                        fontFamily: 'monospace',
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-all',
                        maxHeight: 200,
                        overflow: 'auto',
                      }}>
                        {typeof j.details === 'string' ? j.details : JSON.stringify(j.details, null, 2)}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>
    </div>
  );
}
