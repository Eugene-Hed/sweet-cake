// =============================================================================
// Page Réservations
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, XCircle } from 'lucide-react';
import { reservationsService } from '@/services/reservations.service';
import Pagination from '@/composants/communs/Pagination';
import Badge, { varianteStatutReservation, labelStatut } from '@/composants/communs/Badge';
import Confirmation from '@/composants/communs/Confirmation';
import type { Reservation, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';

export default function PageReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const [annulation, setAnnulation] = useState<number | null>(null);

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await reservationsService.listerToutes(parametres);
      setReservations(r.data.donnees || []);
      if (r.data.meta) setMeta(r.data.meta);
    } catch { toast.error('Erreur chargement réservations'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  const annuler = async () => {
    if (annulation === null) return;
    try {
      await reservationsService.annuler(annulation);
      toast.success('Réservation annulée');
      setAnnulation(null);
      charger();
    } catch { toast.error('Erreur d\'annulation'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Réservations</h1>
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
          <thead><tr><th>ID</th><th>Atelier</th><th>Client</th><th>Places</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={7} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : reservations.length === 0 ? (
              <tr><td colSpan={7} className="tableau-vide">Aucune réservation</td></tr>
            ) : reservations.map((r) => (
              <tr key={r.id}>
                <td><strong>#{r.id}</strong></td>
                <td>{r.atelier?.titre || `Atelier #${r.atelier_id}`}</td>
                <td>{r.client?.nom_complet || `Client #${r.client_id}`}</td>
                <td>{r.nombre_places}</td>
                <td><Badge variante={varianteStatutReservation[r.statut] || 'neutre'}>{labelStatut[r.statut] || r.statut}</Badge></td>
                <td className="texte-secondaire">{new Date(r.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  {r.statut !== 'annulee' && (
                    <button className="bouton bouton--fantome bouton--sm" onClick={() => setAnnulation(r.id)} title="Annuler">
                      <XCircle size={16} color="var(--couleur-erreur)" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      <Confirmation estOuverte={annulation !== null} onFermer={() => setAnnulation(null)} onConfirmer={annuler}
        message="Voulez-vous annuler cette réservation ?" labelConfirmer="Annuler la réservation" />
    </div>
  );
}
