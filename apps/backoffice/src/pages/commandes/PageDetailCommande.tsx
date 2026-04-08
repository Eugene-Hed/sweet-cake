// =============================================================================
// Page Détail Commande — avec changement de statut et historique
// =============================================================================

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock } from 'lucide-react';
import { commandesService } from '@/services/commandes.service';
import Badge, { varianteStatutCommande, labelStatut } from '@/composants/communs/Badge';
import Confirmation from '@/composants/communs/Confirmation';
import type { Commande, HistoriqueStatut } from '@/types';
import { TRANSITIONS_STATUT_COMMANDE } from '@sweet-cake/shared';
import toast from 'react-hot-toast';
import './PageCommandes.css';

export default function PageDetailCommande() {
  const { id } = useParams<{ id: string }>();
  const naviguer = useNavigate();
  const [commande, setCommande] = useState<Commande | null>(null);
  const [historique, setHistorique] = useState<HistoriqueStatut[]>([]);
  const [chargement, setChargement] = useState(true);
  const [changementStatut, setChangementStatut] = useState<string | null>(null);

  const charger = async () => {
    try {
      const [rCmd, rHist] = await Promise.all([
        commandesService.trouverParId(Number(id)),
        commandesService.historique(Number(id)),
      ]);
      setCommande(rCmd.data.donnees || null);
      setHistorique(rHist.data.donnees || []);
    } catch { toast.error('Commande introuvable'); naviguer('/commandes'); }
    finally { setChargement(false); }
  };

  useEffect(() => { charger(); }, [id]);

  const confirmerChangement = async () => {
    if (!changementStatut) return;
    try {
      await commandesService.changerStatut(Number(id), changementStatut);
      toast.success(`Statut changé en "${labelStatut[changementStatut] || changementStatut}"`);
      setChangementStatut(null);
      setChargement(true);
      charger();
    } catch { toast.error('Erreur changement de statut'); }
  };

  if (chargement) return <div className="chargement-page"><div className="chargement-spinner chargement-spinner--lg" /></div>;
  if (!commande) return null;

  const transitionsDisponibles = TRANSITIONS_STATUT_COMMANDE[commande.statut] || [];

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/commandes')}><ArrowLeft size={18} /></button>
          <h1 className="page-titre">Commande #{commande.id}</h1>
          <Badge variante={varianteStatutCommande[commande.statut]}>{labelStatut[commande.statut] || commande.statut}</Badge>
        </div>
      </div>

      <div className="commande-detail-grille">
        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 16 }}>Informations</h3>
          <div className="commande-info-grille">
            <div><span className="texte-secondaire">Client</span><br /><strong>{commande.client?.nom_complet || '—'}</strong></div>
            <div><span className="texte-secondaire">Email</span><br />{commande.client?.email || '—'}</div>
            <div><span className="texte-secondaire">Type</span><br /><span style={{ textTransform: 'capitalize' }}>{commande.type_commande}</span></div>
            <div><span className="texte-secondaire">Date</span><br />{new Date(commande.created_at).toLocaleString('fr-FR')}</div>
            {commande.planifiee_pour && <div><span className="texte-secondaire">Planifiée pour</span><br />{new Date(commande.planifiee_pour).toLocaleString('fr-FR')}</div>}
            {commande.notes && <div style={{ gridColumn: '1 / -1' }}><span className="texte-secondaire">Notes</span><br />{commande.notes}</div>}
          </div>

          {transitionsDisponibles.length > 0 && (
            <div style={{ marginTop: 20, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <span className="texte-secondaire" style={{ alignSelf: 'center', marginRight: 4 }}>Changer le statut :</span>
              {transitionsDisponibles.map((s) => (
                <button key={s} className={`bouton bouton--sm ${s === 'annulee' ? 'bouton--danger' : 'bouton--secondaire'}`}
                  onClick={() => setChangementStatut(s)}>
                  {labelStatut[s] || s}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 16 }}>Articles commandés</h3>
          <table className="tableau" style={{ fontSize: '14px' }}>
            <thead><tr><th>Produit</th><th>Qté</th><th>Prix unit.</th><th>Sous-total</th></tr></thead>
            <tbody>
              {commande.lignes && commande.lignes.length > 0 ? commande.lignes.map((l) => (
                <tr key={l.id}>
                  <td>{l.produit?.nom || `Produit #${l.produit_id}`}</td>
                  <td>{l.quantite}</td>
                  <td>{Number(l.prix_unitaire).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td><strong>{Number(l.sous_total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</strong></td>
                </tr>
              )) : <tr><td colSpan={4} className="tableau-vide">Aucun article</td></tr>}
            </tbody>
            <tfoot>
              <tr><td colSpan={3} style={{ textAlign: 'right', fontWeight: 600 }}>Total</td>
                <td><strong style={{ color: 'var(--couleur-primaire)', fontSize: 16 }}>{Number(commande.total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="carte">
          <h3 className="sous-titre" style={{ marginBottom: 16 }}><Clock size={18} style={{ verticalAlign: 'middle', marginRight: 6 }} />Historique des statuts</h3>
          {historique.length > 0 ? (
            <div className="timeline">
              {historique.map((h) => (
                <div key={h.id} className="timeline-item">
                  <div className="timeline-point" />
                  <div className="timeline-contenu">
                    <Badge variante={varianteStatutCommande[h.nouveau_statut]}>{labelStatut[h.nouveau_statut] || h.nouveau_statut}</Badge>
                    {h.ancien_statut && <span className="texte-secondaire" style={{ marginLeft: 8 }}>← {labelStatut[h.ancien_statut] || h.ancien_statut}</span>}
                    {h.note && <p className="texte-secondaire" style={{ marginTop: 4 }}>{h.note}</p>}
                  </div>
                  <div className="timeline-date">{new Date(h.created_at).toLocaleString('fr-FR')}</div>
                </div>
              ))}
            </div>
          ) : <p className="texte-secondaire">Aucun historique</p>}
        </div>
      </div>

      <Confirmation estOuverte={!!changementStatut} onFermer={() => setChangementStatut(null)} onConfirmer={confirmerChangement}
        message={`Changer le statut vers "${labelStatut[changementStatut || ''] || changementStatut}" ?`}
        labelConfirmer="Confirmer" variante={changementStatut === 'annulee' ? 'danger' : 'primaire'} />
    </div>
  );
}
