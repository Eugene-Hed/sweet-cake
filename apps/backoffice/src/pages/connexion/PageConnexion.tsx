// =============================================================================
// Page de Connexion
// =============================================================================

import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { utiliserAuth } from '@/contextes/AuthContexte';
import { Cake, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import './PageConnexion.css';

export default function PageConnexion() {
  const { connexion, estAuthentifie, chargement: chargementAuth } = utiliserAuth();
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [afficherMdp, setAfficherMdp] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState('');

  if (chargementAuth) {
    return (
      <div className="chargement-page" style={{ minHeight: '100vh' }}>
        <div className="chargement-spinner chargement-spinner--lg" />
      </div>
    );
  }

  if (estAuthentifie) {
    return <Navigate to="/" replace />;
  }

  const gererSoumission = async (e: FormEvent) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      await connexion(email, motDePasse);
      toast.success('Connexion réussie !');
    } catch (err: unknown) {
      const message =
        (err instanceof Error && err.message) ||
        (err && typeof err === 'object' && 'response' in err &&
          (err as { response?: { data?: { message?: string } } }).response?.data?.message) ||
        'Identifiants invalides';
      setErreur(message);
      toast.error(message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div className="connexion-page">
      <div className="connexion-fond">
        <div className="connexion-forme connexion-forme--1" />
        <div className="connexion-forme connexion-forme--2" />
        <div className="connexion-forme connexion-forme--3" />
      </div>

      <div className="connexion-carte">
        <div className="connexion-entete">
          <div className="connexion-logo">
            <Cake size={32} />
          </div>
          <h1 className="connexion-titre">Sweet-Cake</h1>
          <p className="connexion-sous-titre">Back-Office d'Administration</p>
        </div>

        <form onSubmit={gererSoumission} className="connexion-formulaire">
          {erreur && (
            <div className="alerte">
              {erreur}
            </div>
          )}

          <div className="champ-groupe">
            <label className="champ-label" htmlFor="email">Adresse email</label>
            <div className="connexion-champ-icone">
              <input
                id="email"
                type="email"
                className="champ-saisie"
                placeholder="Ex: admin@sweet-cake.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{ paddingLeft: '48px' }}
              />
              <Mail size={20} className="connexion-icone" />
            </div>
          </div>

          <div className="champ-groupe">
            <label className="champ-label" htmlFor="mot-de-passe">Mot de passe</label>
            <div className="connexion-champ-icone">
              <input
                id="mot-de-passe"
                type={afficherMdp ? 'text' : 'password'}
                className="champ-saisie"
                placeholder="••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                style={{ paddingLeft: '48px', paddingRight: '48px' }}
              />
              <Lock size={20} className="connexion-icone" />
              <button
                type="button"
                className="connexion-toggle-mdp"
                onClick={() => setAfficherMdp(!afficherMdp)}
                tabIndex={-1}
              >
                {afficherMdp ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bouton-connexion"
            disabled={chargement}
          >
            {chargement ? (
              <span className="chargement-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              'Accéder au Back-Office'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
