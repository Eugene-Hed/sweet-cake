// =============================================================================
// Composant EnTete — Header principal
// =============================================================================

import { Menu, Sun, Moon, LogOut, User } from 'lucide-react';
import { utiliserAuth } from '@/contextes/AuthContexte';
import { utiliserTheme } from '@/contextes/ThemeContexte';
import './EnTete.css';

interface PropsEnTete {
  onToggleSidebar: () => void;
}

export default function EnTete({ onToggleSidebar }: PropsEnTete) {
  const { utilisateur, deconnexion } = utiliserAuth();
  const { theme, basculerTheme } = utiliserTheme();

  return (
    <header className="entete">
      <div className="entete-gauche">
        <button className="entete-menu-btn" onClick={onToggleSidebar} aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>

      <div className="entete-droite">
        <button
          className="entete-theme-btn"
          onClick={basculerTheme}
          aria-label={theme === 'clair' ? 'Mode sombre' : 'Mode clair'}
          title={theme === 'clair' ? 'Mode sombre' : 'Mode clair'}
        >
          {theme === 'clair' ? <Moon size={18} /> : <Sun size={18} />}
        </button>

        <div className="entete-profil">
          <div className="entete-avatar">
            <User size={16} />
          </div>
          <div className="entete-profil-info">
            <span className="entete-profil-nom">{utilisateur?.nom_complet}</span>
            <span className="entete-profil-role">{utilisateur?.role}</span>
          </div>
        </div>

        <button className="entete-deconnexion-btn" onClick={deconnexion} title="Déconnexion">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
