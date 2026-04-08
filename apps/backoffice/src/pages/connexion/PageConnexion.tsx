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
            <div className="alerte alerte--erreur">
              {erreur}
            </div>
          )}

          <div className="champ-groupe">
            <label className="champ-label" htmlFor="email">Adresse email</label>
            <div className="connexion-champ-icone">
              <Mail size={18} className="connexion-icone" />
              <input
                id="email"
                type="email"
                className="champ-saisie"
                placeholder="admin@sweet-cake.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
                style={{ paddingLeft: '40px' }}
              />
            </div>
          </div>

          <div className="champ-groupe">
            <label className="champ-label" htmlFor="mot-de-passe">Mot de passe</label>
            <div className="connexion-champ-icone">
              <Lock size={18} className="connexion-icone" />
              <input
                id="mot-de-passe"
                type={afficherMdp ? 'text' : 'password'}
                className="champ-saisie"
                placeholder="••••••••"
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                required
                style={{ paddingLeft: '40px', paddingRight: '44px' }}
              />
              <button
                type="button"
                className="connexion-toggle-mdp"
                onClick={() => setAfficherMdp(!afficherMdp)}
                tabIndex={-1}
              >
                {afficherMdp ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="bouton bouton--primaire bouton--lg bouton--plein"
            disabled={chargement}
          >
            {chargement ? (
              <span className="chargement-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
            ) : (
              'Se connecter'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
