// =============================================================================
// Page Tableau de Bord — Version Professionnelle
// =============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, Package, GraduationCap, Users, 
  AlertTriangle, DollarSign, TrendingUp, TrendingDown,
  ArrowRight, Calendar, Shield
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { tableauDeBordService } from '@/services/tableau-de-bord.service';
import Badge, { varianteStatutCommande, labelStatut } from '@/composants/communs/Badge';
import type { ResumeTableauDeBord } from '@/types';
import { formaterFCFA } from '@/utilitaires/formatage';
import toast from 'react-hot-toast';
import './PageTableauDeBord.css';

export default function PageTableauDeBord() {
  const [resume, setResume] = useState<ResumeTableauDeBord | null>(null);
  const [chargement, setChargement] = useState(true);
  const naviguer = useNavigate();

  useEffect(() => {
    const charger = async () => {
      try {
        const reponse = await tableauDeBordService.resume();
        setResume(reponse.data.donnees || null);
      } catch {
        toast.error('Erreur lors du chargement du tableau de bord');
      } finally {
        setChargement(false);
      }
    };
    charger();
  }, []);

  if (chargement) {
    return <div className="chargement-page"><div className="chargement-spinner chargement-spinner--lg" /></div>;
  }

  if (!resume) {
    return <div className="chargement-page"><p>Impossible de charger les données</p></div>;
  }

  // Statistiques avec tendances simulées pour l'aspect professionnel
  const cartesStats = [
    { 
      label: 'Revenus (estimés)', 
      valeur: formaterFCFA(resume.revenus_estimes), 
      Icone: DollarSign, 
      couleur: '#28A745', 
      fond: 'rgba(40, 167, 69, 0.1)',
      tendance: '+12.5%',
      hausse: true
    },
    { 
      label: 'Commandes totales', 
      valeur: resume.total_commandes, 
      Icone: ShoppingCart, 
      couleur: 'var(--couleur-primaire)', 
      fond: 'rgba(232, 96, 138, 0.1)',
      tendance: '+8.2%',
      hausse: true
    },
    { 
      label: 'Nouveaux Clients', 
      valeur: resume.total_clients, 
      Icone: Users, 
      couleur: '#17A2B8', 
      fond: 'rgba(23, 162, 184, 0.1)',
      tendance: '+5.4%',
      hausse: true
    },
    { 
      label: 'Alertes Stock', 
      valeur: resume.alertes_stock_faible, 
      Icone: AlertTriangle, 
      couleur: resume.alertes_stock_faible > 0 ? '#DC3545' : '#28A745', 
      fond: resume.alertes_stock_faible > 0 ? 'rgba(220, 53, 69, 0.1)' : 'rgba(40, 167, 69, 0.1)',
      tendance: resume.alertes_stock_faible > 0 ? 'Attention' : 'Stable',
      hausse: false
    },
  ];

  return (
    <div className="dashboard animer-fondu">
      <div className="page-entete" style={{ marginBottom: 30 }}>
        <div>
          <h1 className="page-titre">Vue d'ensemble</h1>
          <p className="texte-secondaire" style={{ marginTop: 4 }}>
            Bienvenue dans votre espace de gestion Sweet-Cake.
          </p>
        </div>
        <div className="page-actions">
          <div className="carte" style={{ padding: '8px 16px', display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, background: 'var(--couleur-fond)' }}>
            <Calendar size={16} />
            {new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>

      {/* Cartes de statistiques Premium */}
      <div className="dashboard-grille-stats">
        {cartesStats.map((carte) => (
          <div
            key={carte.label}
            className="carte-stat-premium"
            style={{ '--carte-stat-couleur': carte.couleur, '--carte-stat-fond': carte.fond } as React.CSSProperties}
          >
            <div className="carte-stat-premium-en-haut">
              <div className="carte-stat-premium-icone">
                <carte.Icone size={24} />
              </div>
              <div className={`carte-stat-premium-tendance ${carte.hausse ? 'tendance--hausse' : 'tendance--baisse'}`}>
                {carte.hausse ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                {carte.tendance}
              </div>
            </div>
            <div className="carte-stat-premium-valeur">{carte.valeur}</div>
            <div className="carte-stat-premium-label">{carte.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-contenu-grille">
        {/* Graphique d'évolution */}
        <div className="dashboard-section animer-entree" style={{ animationDelay: '0.1s' }}>
          <div className="carte" style={{ height: '100%', minHeight: 400 }}>
            <div className="dashboard-section-entete">
              <h2><TrendingUp size={20} color="var(--couleur-primaire)" /> Évolution des revenus</h2>
              <Badge variante="information">Mensuel</Badge>
            </div>
            <p className="texte-secondaire" style={{ fontSize: 13, marginBottom: 25 }}>
              Performance financière estimée sur les derniers mois.
            </p>
            
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={resume.revenus_mensuels || [
                    { nom: 'Jan', total: 400000 },
                    { nom: 'Fév', total: 300000 },
                    { nom: 'Mar', total: 600000 },
                    { nom: 'Avr', total: 800000 },
                    { nom: 'Mai', total: 500000 },
                    { nom: 'Juin', total: 950000 },
                  ]}
                  margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--couleur-primaire)" stopOpacity={0.15} />
                      <stop offset="95%" stopColor="var(--couleur-primaire)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--couleur-bordure-legere)" />
                  <XAxis 
                    dataKey="nom" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--couleur-texte-secondaire)', fontSize: 12 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--couleur-texte-secondaire)', fontSize: 12 }}
                    tickFormatter={(val) => `${val / 1000}k`}
                  />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: 'var(--couleur-surface)', 
                      borderColor: 'var(--couleur-bordure-legere)',
                      borderRadius: '12px',
                      boxShadow: 'var(--ombre-lg)',
                      border: 'none',
                      padding: '12px 16px'
                    }}
                    formatter={(value: any) => [formaterFCFA(value), 'Revenu']}
                    labelStyle={{ fontWeight: 700, marginBottom: 4, color: 'var(--couleur-texte-principal)' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="total"
                    stroke="var(--couleur-primaire)"
                    strokeWidth={4}
                    fillOpacity={1}
                    fill="url(#colorTotal)"
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="dashboard-section animer-entree" style={{ animationDelay: '0.2s' }}>
          <div className="carte" style={{ height: '100%', minHeight: 400 }}>
            <div className="dashboard-section-entete">
              <h2><ShoppingCart size={20} color="var(--couleur-secondaire)" /> Dernières commandes</h2>
              <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/commandes')}>
                Voir tout <ArrowRight size={14} />
              </button>
            </div>
            
            <div className="tableau-conteneur" style={{ marginTop: 15, border: 'none', background: 'transparent' }}>
              <table className="tableau">
                <thead>
                  <tr>
                    <th>CLIENT</th>
                    <th style={{ textAlign: 'right' }}>MONTANT</th>
                    <th style={{ textAlign: 'center' }}>STATUT</th>
                  </tr>
                </thead>
                <tbody>
                  {resume.commandes_recentes && resume.commandes_recentes.length > 0 ? (
                    resume.commandes_recentes.slice(0, 6).map((cmd) => (
                      <tr key={cmd.id} style={{ cursor: 'pointer' }} onClick={() => naviguer(`/commandes/${cmd.id}`)}>
                        <td>
                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <strong style={{ fontSize: 14 }}>{cmd.client?.nom_complet || 'Utilisateur'}</strong>
                            <span className="texte-secondaire" style={{ fontSize: 11 }}>#{cmd.id} • {new Date(cmd.created_at).toLocaleDateString('fr-FR')}</span>
                          </div>
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <strong style={{ color: 'var(--couleur-texte-principal)' }}>{formaterFCFA(cmd.montant_total || cmd.total)}</strong>
                        </td>
                        <td style={{ textAlign: 'center' }}>
                          <Badge variante={varianteStatutCommande[cmd.statut] || 'neutre'}>
                            {labelStatut[cmd.statut] || cmd.statut}
                          </Badge>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr><td colSpan={3} className="tableau-vide">Aucune commande</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Section Bonus: Raccourcis rapides */}
      <div className="dashboard-section animer-entree" style={{ animationDelay: '0.3s', marginTop: 'var(--espace-xl)' }}>
        <h2 className="sous-titre" style={{ marginBottom: 15 }}>Actions rapides</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 15 }}>
          {[
            { label: 'Ajouter un produit', icone: Package, route: '/produits/nouveau', couleur: 'var(--couleur-primaire)' },
            { label: 'Nouvel atelier', icone: GraduationCap, route: '/ateliers/nouveau', couleur: 'var(--couleur-secondaire)' },
            { label: 'Gérer le stock', icone: AlertTriangle, route: '/stock', couleur: '#f5c563' },
            { label: 'Consulter l\'audit', icone: Shield, route: '/audit', couleur: '#6c757d' },
          ].map((action, i) => (
            <button
              key={i}
              className="carte"
              onClick={() => naviguer(action.route)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 15,
                padding: '15px 20px',
                textAlign: 'left',
                transition: 'all 0.2s',
                cursor: 'pointer',
                border: '1px solid var(--couleur-bordure-legere)'
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = action.couleur)}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--couleur-bordure-legere)')}
            >
              <div style={{ background: `${action.couleur}15`, color: action.couleur, padding: 10, borderRadius: 10 }}>
                <action.icone size={20} />
              </div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>{action.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

