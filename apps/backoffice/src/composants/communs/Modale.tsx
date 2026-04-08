// =============================================================================
// Composant Modale — Dialogue réutilisable
// =============================================================================

import { useEffect, useCallback, type ReactNode } from 'react';
import { X } from 'lucide-react';

interface PropsModale {
  estOuverte: boolean;
  onFermer: () => void;
  titre: string;
  children: ReactNode;
  pied?: ReactNode;
  large?: boolean;
}

export default function Modale({ estOuverte, onFermer, titre, children, pied, large }: PropsModale) {
  const gererEchap = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onFermer();
  }, [onFermer]);

  useEffect(() => {
    if (estOuverte) {
      document.addEventListener('keydown', gererEchap);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', gererEchap);
      document.body.style.overflow = '';
    };
  }, [estOuverte, gererEchap]);

  if (!estOuverte) return null;

  return (
    <div className="modale-overlay" onClick={(e) => { if (e.target === e.currentTarget) onFermer(); }}>
      <div className={`modale ${large ? 'modale--large' : ''}`}>
        <div className="modale-entete">
          <h2 className="modale-titre">{titre}</h2>
          <button className="modale-fermer" onClick={onFermer} aria-label="Fermer">
            <X size={18} />
          </button>
        </div>
        <div className="modale-corps">{children}</div>
        {pied && <div className="modale-pied">{pied}</div>}
      </div>
    </div>
  );
}
