// =============================================================================
// Page Utilisateurs
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { Search, ToggleLeft, ToggleRight, Eye } from 'lucide-react';
import { utilisateursService } from '@/services/utilisateurs.service';
import Pagination from '@/composants/communs/Pagination';
import Badge from '@/composants/communs/Badge';
import Confirmation from '@/composants/communs/Confirmation';
import type { Utilisateur, MetaPagination, ParametresPagination } from '@/types';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function PageUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState<Utilisateur[]>([]);
  const [meta, setMeta] = useState<MetaPagination>({ page: 1, limite: 20, total: 0, total_pages: 0 });
  const [parametres, setParametres] = useState<ParametresPagination>({ page: 1, limite: 20, recherche: '' });
  const [chargement, setChargement] = useState(true);
  const [confirmation, setConfirmation] = useState<{ id: number; actif: boolean } | null>(null);
  const naviguer = useNavigate();

  const charger = useCallback(async () => {
    setChargement(true);
    try {
      const r = await utilisateursService.listerTous(parametres);
      setUtilisateurs(r.data.donnees || []);
      if (r.data.meta) setMeta(r.data.meta);
    } catch { toast.error('Erreur chargement utilisateurs'); }
    finally { setChargement(false); }
  }, [parametres]);

  useEffect(() => { charger(); }, [charger]);

  const changerStatut = async () => {
    if (!confirmation) return;
    try {
      await utilisateursService.changerStatut(confirmation.id, !confirmation.actif);
      toast.success(`Utilisateur ${!confirmation.actif ? 'activé' : 'désactivé'}`);
      setConfirmation(null);
      charger();
    } catch { toast.error('Erreur changement statut'); }
  };

  return (
    <div className="animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Utilisateurs</h1>
      </div>

      <div className="filtres-barre">
        <div className="recherche-conteneur">
          <Search size={16} className="recherche-icone" />
          <input
            className="recherche-saisie"
            placeholder="Rechercher un utilisateur..."
            value={parametres.recherche || ''}
            onChange={(e) => setParametres({ ...parametres, recherche: e.target.value, page: 1 })}
          />
        </div>
      </div>

      <div className="tableau-conteneur">
        <table className="tableau">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Rôle</th>
              <th>Statut</th>
              <th>Inscrit le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {chargement ? (
              <tr><td colSpan={6} className="tableau-vide"><div className="chargement-spinner" /></td></tr>
            ) : utilisateurs.length === 0 ? (
              <tr><td colSpan={6} className="tableau-vide">Aucun utilisateur trouvé</td></tr>
            ) : utilisateurs.map((u) => (
              <tr key={u.id}>
                <td><strong>{u.nom_complet}</strong></td>
                <td className="texte-secondaire">{u.email}</td>
                <td>
                  <Badge variante={u.role === 'administrateur' ? 'primaire' : u.role === 'gestionnaire' ? 'information' : 'neutre'}>
                    {u.role}
                  </Badge>
                </td>
                <td>
                  <Badge variante={u.est_actif ? 'succes' : 'erreur'}>
                    {u.est_actif ? 'Actif' : 'Inactif'}
                  </Badge>
                </td>
                <td className="texte-secondaire">{new Date(u.created_at).toLocaleDateString('fr-FR')}</td>
                <td>
                  <div className="tableau-actions">
                    <button className="bouton bouton--fantome bouton--sm" title="Voir" onClick={() => naviguer(`/utilisateurs/${u.id}`)}>
                      <Eye size={16} />
                    </button>
                    <button
                      className="bouton bouton--fantome bouton--sm"
                      title={u.est_actif ? 'Désactiver' : 'Activer'}
                      onClick={() => setConfirmation({ id: u.id, actif: u.est_actif })}
                    >
                      {u.est_actif ? <ToggleRight size={16} color="var(--couleur-succes)" /> : <ToggleLeft size={16} />}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination meta={meta} onChangerPage={(p) => setParametres({ ...parametres, page: p })} />
      </div>

      <Confirmation
        estOuverte={!!confirmation}
        onFermer={() => setConfirmation(null)}
        onConfirmer={changerStatut}
        message={`Voulez-vous ${confirmation?.actif ? 'désactiver' : 'activer'} cet utilisateur ?`}
        labelConfirmer={confirmation?.actif ? 'Désactiver' : 'Activer'}
        variante={confirmation?.actif ? 'danger' : 'primaire'}
      />
    </div>
  );
}
