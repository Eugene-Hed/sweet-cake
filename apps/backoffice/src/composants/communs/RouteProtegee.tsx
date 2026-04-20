// =============================================================================
// Composant RouteProtegee — Guard d'authentification et de rôle
// =============================================================================

import { Navigate } from 'react-router-dom';
import { utiliserAuth } from '@/contextes/AuthContexte';

interface PropsRouteProtegee {
  children: React.ReactNode;
  rolesAutorises?: string[];
}

export default function RouteProtegee({ children, rolesAutorises }: PropsRouteProtegee) {
  const { estAuthentifie, chargement, utilisateur } = utiliserAuth();

  if (chargement) {
    return (
      <div className="chargement-page">
        <div className="chargement-spinner chargement-spinner--lg" />
      </div>
    );
  }

  if (!estAuthentifie) {
    return <Navigate to="/connexion" replace />;
  }

  if (rolesAutorises && utilisateur && !rolesAutorises.includes(utilisateur.role)) {
    return (
      <div className="chargement-page" style={{ flexDirection: 'column', gap: '16px' }}>
        <h2 className="titre-secondaire">Accès refusé</h2>
        <p className="texte-secondaire">Vous n'avez pas les droits pour accéder à cette page.</p>
      </div>
    );
  }

  return <>{children}</>;
}
