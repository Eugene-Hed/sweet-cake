// =============================================================================
// Page Commandes — Liste avec statuts
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { commandesService } from '@/services/commandes.service';
import Pagination from '@/composants/communs/Pagination';
import Badge, { varianteStatutCommande, labelStatut } from '@/composants/communs/Badge';
import type { Commande, MetaPagination, ParametresPagination } from '@/types';
import { formaterFCFA } from '@/utilitaires/formatage';
import toast from 'react-hot-toast';

export default function PageCommandes() {
  const [commandes, setCommandes] = useState<Commande[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const naviguer = useNavigate();

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await commandesService.listerToutes(parametres);
      setCommandes(r.data.donnees || []);
      if (r.data.meta) setMeta(r.data.meta);
    } catch { toast.error('Erreur chargement commandes'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  const totalPage = commandes.reduce((acc, c) => acc + Number(c.montant_total || c.total || 0), 0);

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Commandes</h1>
      </div>

      <div className="commande-stats-resume" style={{ marginBottom: 'var(--espace-lg)' }}>
        <div className="carte" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <p className="texte-secondaire">Somme totale (page actuelle)</p>
            <h2 className="titre-secondaire" style={{ color: 'var(--couleur-primaire)' }}>{formaterFCFA(totalPage)}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p className="texte-secondaire">Nombre de commandes</p>
            <h2 className="titre-secondaire">{meta.total}</h2>
          </div>
        </div>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input className="recherche-saisie" placeholder="Rechercher par numéro ou client..." value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })} />
        </div>
      </div>

      <div className="tableau-conteneur text-shimmer">
        <table className="tableau">
          <thead><tr><th>N°</th><th>Client</th><th>Type</th><th>Total</th><th>Statut</th><th>Date</th><th>Actions</th></tr></thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={7} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : commandes.length === 0 ? (
              <tr><td colSpan={7} className="tableau-vide">Aucune commande</td></tr>
            ) : commandes.map((c) => (
              <tr key={c.id}>
                <td><strong>#{c.id}</strong></td>
                <td>{c.client?.nom_complet || '—'}</td>
                <td style={{ textTransform: 'capitalize' }}>{c.type_commande}</td>
                <td><strong>{formaterFCFA(c.montant_total || c.total)}</strong></td>
                <td><Badge variante={varianteStatutCommande[c.statut] || 'neutre'}>{labelStatut[c.statut] || c.statut}</Badge></td>
                <td className="texte-secondaire">{new Date(c.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer(`/commandes/${c.id}`)} title="Détail">
                    <Eye size={16} />
                  </button>
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
