// =============================================================================
// Composant MiseEnPageAdmin — Layout wrapper principal
// =============================================================================

import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import BarreLaterale from './BarreLaterale';
import EnTete from './EnTete';
import './MiseEnPageAdmin.css';

export default function MiseEnPageAdmin() {
  const [sidebarOuverte, setSidebarOuverte] = useState(false);

  return (
    <div className="admin-layout">
      <BarreLaterale
        estOuverte={sidebarOuverte}
        onFermer={() => setSidebarOuverte(false)}
      />
      <EnTete onToggleSidebar={() => setSidebarOuverte(!sidebarOuverte)} />
      <main className="admin-contenu">
        <Outlet />
      </main>
    </div>
  );
}
