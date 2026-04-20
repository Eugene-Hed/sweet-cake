// =============================================================================
// Contexte d'Authentification
// =============================================================================

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { authentificationService } from '@/services/authentification.service';
import type { Utilisateur } from '@/types';

interface ContexteAuth {
  utilisateur: Utilisateur | null;
  estAuthentifie: boolean;
  chargement: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => Promise<void>;
}

const AuthContexte = createContext<ContexteAuth | undefined>(undefined);

export function AuthFournisseur({ children }: { children: ReactNode }) {
  const [utilisateur, setUtilisateur] = useState<Utilisateur | null>(null);
  const [chargement, setChargement] = useState(true);

  // Restaurer la session au montage
  useEffect(() => {
    const restaurerSession = async () => {
      const token = localStorage.getItem('jeton_acces');
      const utilisateurStocke = localStorage.getItem('utilisateur');

      if (token && utilisateurStocke) {
        try {
          // Vérifier si le token est encore valide en appelant /profil
          const reponse = await authentificationService.profil();
          const donnees = reponse.data.donnees;
          if (donnees) {
            setUtilisateur(donnees);
            localStorage.setItem('utilisateur', JSON.stringify(donnees));
          }
        } catch {
          // Token invalide — essayer de rafraîchir
          const refreshToken = localStorage.getItem('jeton_rafraichissement');
          if (refreshToken) {
            try {
              const reponse = await authentificationService.rafraichir(refreshToken);
              const donnees = reponse.data.donnees;
              if (donnees) {
                localStorage.setItem('jeton_acces', donnees.jeton_acces);
                localStorage.setItem('jeton_rafraichissement', donnees.jeton_rafraichissement);
                localStorage.setItem('utilisateur', JSON.stringify(donnees.utilisateur));
                setUtilisateur(donnees.utilisateur);
              }
            } catch {
              // Échec total — nettoyer
              localStorage.removeItem('jeton_acces');
              localStorage.removeItem('jeton_rafraichissement');
              localStorage.removeItem('utilisateur');
            }
          } else {
            localStorage.removeItem('jeton_acces');
            localStorage.removeItem('utilisateur');
          }
        }
      }
      setChargement(false);
    };

    restaurerSession();
  }, []);

  const connexion = useCallback(async (email: string, motDePasse: string) => {
    const reponse = await authentificationService.connexion(email, motDePasse);
    const donnees = reponse.data.donnees;
    if (donnees) {
      // Vérifier que l'utilisateur a le rôle admin ou gestionnaire
      if (donnees.utilisateur.role !== 'administrateur' && donnees.utilisateur.role !== 'gestionnaire') {
        throw new Error('Accès réservé aux administrateurs et gestionnaires');
      }
      localStorage.setItem('jeton_acces', donnees.jeton_acces);
      localStorage.setItem('jeton_rafraichissement', donnees.jeton_rafraichissement);
      localStorage.setItem('utilisateur', JSON.stringify(donnees.utilisateur));
      setUtilisateur(donnees.utilisateur);
    }
  }, []);

  const deconnexion = useCallback(async () => {
    try {
      await authentificationService.deconnexion();
    } catch {
      // Ignorer les erreurs de déconnexion
    } finally {
      localStorage.removeItem('jeton_acces');
      localStorage.removeItem('jeton_rafraichissement');
      localStorage.removeItem('utilisateur');
      setUtilisateur(null);
    }
  }, []);

  return (
    <AuthContexte.Provider
      value={{
        utilisateur,
        estAuthentifie: !!utilisateur,
        chargement,
        connexion,
        deconnexion,
      }}
    >
      {children}
    </AuthContexte.Provider>
  );
}

export function utiliserAuth(): ContexteAuth {
  const contexte = useContext(AuthContexte);
  if (!contexte) {
    throw new Error('utiliserAuth doit être utilisé dans un AuthFournisseur');
  }
  return contexte;
}
