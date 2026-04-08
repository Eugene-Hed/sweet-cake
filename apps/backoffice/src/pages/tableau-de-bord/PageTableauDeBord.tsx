// =============================================================================
// Page Tableau de Bord
// =============================================================================

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, Package, GraduationCap, Users, AlertTriangle, DollarSign } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { tableauDeBordService } from '@/services/tableau-de-bord.service';
import Badge, { varianteStatutCommande, labelStatut } from '@/composants/communs/Badge';
import type { ResumeTableauDeBord } from '@/types';
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

  const cartesStats = [
    { label: 'Commandes', valeur: resume.total_commandes, Icone: ShoppingCart, couleur: '#E8608A', fond: '#F8A4C820' },
    { label: 'Revenus estimés', valeur: `${resume.revenus_estimes?.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`, Icone: DollarSign, couleur: '#28A745', fond: '#D4EDDA' },
    { label: 'Produits', valeur: resume.total_produits, Icone: Package, couleur: '#F5C563', fond: '#FFF0D4' },
    { label: 'Ateliers', valeur: resume.total_ateliers, Icone: GraduationCap, couleur: '#17A2B8', fond: '#D1ECF1' },
    { label: 'Clients', valeur: resume.total_clients, Icone: Users, couleur: '#D4883E', fond: '#F5D0A9' },
    { label: 'Alertes stock', valeur: resume.alertes_stock_faible, Icone: AlertTriangle, couleur: resume.alertes_stock_faible > 0 ? '#DC3545' : '#28A745', fond: resume.alertes_stock_faible > 0 ? '#F8D7DA' : '#D4EDDA' },
  ];

  return (
    <div className="dashboard animer-fondu">
      <div className="page-entete">
        <h1 className="page-titre">Tableau de bord</h1>
      </div>

      <div className="dashboard-grille-stats">
        {cartesStats.map((carte) => (
          <div
            key={carte.label}
            className="carte-stat"
            style={{ '--carte-stat-couleur': carte.couleur, '--carte-stat-fond': carte.fond } as React.CSSProperties}
          >
            <div className="carte-stat-icone">
              <carte.Icone size={24} />
            </div>
            <div className="carte-stat-valeur">{carte.valeur}</div>
            <div className="carte-stat-label">{carte.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-section animer-glissement" style={{ animationDelay: '100ms' }}>
        <div className="carte">
          <h2 className="sous-titre" style={{ marginBottom: 20 }}>Évolution des revenus (estimés)</h2>
          <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={resume.revenus_mensuels || [
                  { nom: 'Jan', total: 4000 },
                  { nom: 'Féb', total: 3000 },
                  { nom: 'Mar', total: 6000 },
                  { nom: 'Avr', total: 8000 },
                  { nom: 'Mai', total: 5000 },
                  { nom: 'Juin', total: 9000 },
                ]}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--couleur-primaire)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--couleur-primaire)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--couleur-bordure-legere)" />
                <XAxis 
                  dataKey="nom" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--couleur-texte-secondaire)', fontSize: 12 }}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'var(--couleur-texte-secondaire)', fontSize: 12 }}
                  tickFormatter={(val) => `${val}€`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'var(--couleur-surface)', 
                    borderColor: 'var(--couleur-bordure-legere)',
                    borderRadius: '8px',
                    boxShadow: 'var(--ombre-md)',
                    color: 'var(--couleur-texte-principal)'
                  }}
                  itemStyle={{ color: 'var(--couleur-primaire)' }}
                />
                <Area
                  type="monotone"
                  dataKey="total"
                  stroke="var(--couleur-primaire)"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#colorTotal)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="dashboard-section animer-glissement" style={{ animationDelay: '200ms' }}>
        <div className="dashboard-section-entete">
          <h2 className="sous-titre">Commandes récentes</h2>
          <button className="bouton bouton--fantome bouton--sm" onClick={() => naviguer('/commandes')}>
            Voir tout
          </button>
        </div>

        <div className="tableau-conteneur">
          <table className="tableau">
            <thead>
              <tr>
                <th>N°</th>
                <th>Client</th>
                <th>Type</th>
                <th>Total</th>
                <th>Statut</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {resume.commandes_recentes && resume.commandes_recentes.length > 0 ? (
                resume.commandes_recentes.map((cmd) => (
                  <tr key={cmd.id} style={{ cursor: 'pointer' }} onClick={() => naviguer(`/commandes/${cmd.id}`)}>
                    <td><strong>#{cmd.id}</strong></td>
                    <td>{cmd.client?.nom_complet || '—'}</td>
                    <td style={{ textTransform: 'capitalize' }}>{cmd.type_commande}</td>
                    <td><strong>{Number(cmd.total).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</strong></td>
                    <td>
                      <Badge variante={varianteStatutCommande[cmd.statut] || 'neutre'}>
                        {labelStatut[cmd.statut] || cmd.statut}
                      </Badge>
                    </td>
                    <td className="texte-secondaire">{new Date(cmd.created_at).toLocaleDateString('fr-FR')}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={6} className="tableau-vide">Aucune commande récente</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
