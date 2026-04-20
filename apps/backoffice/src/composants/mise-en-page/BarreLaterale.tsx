// =============================================================================
// Composant BarreLaterale — Navigation sidebar
// =============================================================================

import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Users, FolderOpen, ShoppingBag, ShoppingCart,
  GraduationCap, CalendarCheck, Package, ScrollText, ChevronLeft, Cake,
} from 'lucide-react';
import './BarreLaterale.css';

interface PropsBarreLaterale {
  estOuverte: boolean;
  onFermer: () => void;
}

const elementsNav = [
  { chemin: '/', label: 'Tableau de bord', icone: LayoutDashboard },
  { chemin: '/utilisateurs', label: 'Utilisateurs', icone: Users, role: 'administrateur' },
  { chemin: '/categories', label: 'Catégories', icone: FolderOpen },
  { chemin: '/produits', label: 'Produits', icone: ShoppingBag },
  { chemin: '/commandes', label: 'Commandes', icone: ShoppingCart },
  { chemin: '/ateliers', label: 'Ateliers', icone: GraduationCap },
  { chemin: '/reservations', label: 'Réservations', icone: CalendarCheck },
  { chemin: '/stock', label: 'Stock', icone: Package, role: 'administrateur' },
  { chemin: '/audit', label: 'Journaux d\'audit', icone: ScrollText, role: 'administrateur' },
];

export default function BarreLaterale({ estOuverte, onFermer }: PropsBarreLaterale) {
  const location = useLocation();

  return (
    <>
      {estOuverte && <div className="sidebar-overlay" onClick={onFermer} />}
      <aside className={`sidebar ${estOuverte ? 'sidebar--ouverte' : ''}`}>
        <div className="sidebar-entete">
          <div className="sidebar-logo">
            <div className="sidebar-logo-icone">
              <Cake size={24} />
            </div>
            <div className="sidebar-logo-texte">
              <span className="sidebar-logo-nom">Sweet-Cake</span>
              <span className="sidebar-logo-sous-titre">Back-Office</span>
            </div>
          </div>
          <button className="sidebar-fermer" onClick={onFermer}>
            <ChevronLeft size={20} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {elementsNav.map((element) => (
            <NavLink
              key={element.chemin}
              to={element.chemin}
              end={element.chemin === '/'}
              className={({ isActive }) =>
                `sidebar-lien ${isActive || (element.chemin !== '/' && location.pathname.startsWith(element.chemin)) ? 'sidebar-lien--actif' : ''}`
              }
              onClick={() => {
                if (window.innerWidth < 1024) onFermer();
              }}
            >
              <element.icone size={20} />
              <span>{element.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-pied">
          <div className="sidebar-version">v1.0.0</div>
        </div>
      </aside>
    </>
  );
}
