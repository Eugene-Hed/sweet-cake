// =============================================================================
// Composant Confirmation — Dialogue de confirmation
// =============================================================================

import Modale from './Modale';
import { AlertTriangle } from 'lucide-react';

interface PropsConfirmation {
  estOuverte: boolean;
  onFermer: () => void;
  onConfirmer: () => void;
  titre?: string;
  message: string;
  labelConfirmer?: string;
  variante?: 'danger' | 'primaire';
  chargement?: boolean;
}

export default function Confirmation({
  estOuverte, onFermer, onConfirmer, titre = 'Confirmation',
  message, labelConfirmer = 'Confirmer', variante = 'danger', chargement = false,
}: PropsConfirmation) {
  return (
    <Modale
      estOuverte={estOuverte}
      onFermer={onFermer}
      titre={titre}
      pied={
        <>
          <button className="bouton bouton--fantome" onClick={onFermer} disabled={chargement}>
            Annuler
          </button>
          <button
            className={`bouton bouton--${variante}`}
            onClick={onConfirmer}
            disabled={chargement}
          >
            {chargement ? <span className="chargement-spinner" /> : labelConfirmer}
          </button>
        </>
      }
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
        <div style={{
          flexShrink: 0, width: 40, height: 40, borderRadius: '50%',
          background: variante === 'danger' ? 'var(--couleur-erreur-clair)' : 'var(--couleur-primaire-clair)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: variante === 'danger' ? 'var(--couleur-erreur)' : 'var(--couleur-primaire)',
        }}>
          <AlertTriangle size={20} />
        </div>
        <p className="texte-corps" style={{ paddingTop: 8 }}>{message}</p>
      </div>
    </Modale>
  );
}
