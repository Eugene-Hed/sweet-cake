// =============================================================================
// App.tsx — Routeur principal
// =============================================================================

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthFournisseur } from '@/contextes/AuthContexte';
import { ThemeFournisseur } from '@/contextes/ThemeContexte';
import RouteProtegee from '@/composants/communs/RouteProtegee';
import MiseEnPageAdmin from '@/composants/mise-en-page/MiseEnPageAdmin';

// Pages
import PageConnexion from '@/pages/connexion/PageConnexion';
import PageTableauDeBord from '@/pages/tableau-de-bord/PageTableauDeBord';
import PageUtilisateurs from '@/pages/utilisateurs/PageUtilisateurs';
import PageDetailUtilisateur from '@/pages/utilisateurs/PageDetailUtilisateur';
import PageCategories from '@/pages/categories/PageCategories';
import PageFormulaireCategorie from '@/pages/categories/PageFormulaireCategorie';
import PageProduits from '@/pages/produits/PageProduits';
import PageFormulaireProduit from '@/pages/produits/PageFormulaireProduit';
import PageCommandes from '@/pages/commandes/PageCommandes';
import PageDetailCommande from '@/pages/commandes/PageDetailCommande';
import PageAteliers from '@/pages/ateliers/PageAteliers';
import PageFormulaireAtelier from '@/pages/ateliers/PageFormulaireAtelier';
import PageReservations from '@/pages/reservations/PageReservations';
import PageStock from '@/pages/stock/PageStock';
import PageFormulaireStock from '@/pages/stock/PageFormulaireStock';
import PageMouvementStock from '@/pages/stock/PageMouvementStock';
import PageAudit from '@/pages/audit/PageAudit';

const rolesAdmin = ['administrateur', 'gestionnaire'];
const roleAdminSeul = ['administrateur'];

export default function App() {
  return (
    <ThemeFournisseur>
      <AuthFournisseur>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Routes>
            {/* Page publique */}
            <Route path="/connexion" element={<PageConnexion />} />

            {/* Routes protégées avec layout admin */}
            <Route
              element={
                <RouteProtegee rolesAutorises={rolesAdmin}>
                  <MiseEnPageAdmin />
                </RouteProtegee>
              }
            >
              <Route path="/" element={<PageTableauDeBord />} />
              <Route path="/categories" element={<PageCategories />} />
              <Route path="/categories/nouveau" element={<PageFormulaireCategorie />} />
              <Route path="/categories/:id" element={<PageFormulaireCategorie />} />
              <Route path="/produits" element={<PageProduits />} />
              <Route path="/produits/nouveau" element={<PageFormulaireProduit />} />
              <Route path="/produits/:id" element={<PageFormulaireProduit />} />
              <Route path="/commandes" element={<PageCommandes />} />
              <Route path="/commandes/:id" element={<PageDetailCommande />} />
              <Route path="/ateliers" element={<PageAteliers />} />
              <Route path="/ateliers/nouveau" element={<PageFormulaireAtelier />} />
              <Route path="/ateliers/:id" element={<PageFormulaireAtelier />} />
              <Route path="/reservations" element={<PageReservations />} />

              {/* Routes admin uniquement */}
              <Route path="/utilisateurs" element={
                <RouteProtegee rolesAutorises={roleAdminSeul}><PageUtilisateurs /></RouteProtegee>
              } />
              <Route path="/utilisateurs/:id" element={
                <RouteProtegee rolesAutorises={roleAdminSeul}><PageDetailUtilisateur /></RouteProtegee>
              } />
              <Route path="/stock" element={
                <RouteProtegee rolesAutorises={roleAdminSeul}><PageStock /></RouteProtegee>
              } />
              <Route path="/stock/nouveau" element={
                <RouteProtegee rolesAutorises={roleAdminSeul}><PageFormulaireStock /></RouteProtegee>
              } />
              <Route path="/stock/:id" element={
                <RouteProtegee rolesAutorises={roleAdminSeul}><PageFormulaireStock /></RouteProtegee>
              } />
              <Route path="/stock/:id/mouvement" element={
                <RouteProtegee rolesAutorises={roleAdminSeul}><PageMouvementStock /></RouteProtegee>
              } />
              <Route path="/audit" element={
                <RouteProtegee rolesAutorises={roleAdminSeul}><PageAudit /></RouteProtegee>
              } />
            </Route>

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: 'var(--couleur-surface)',
              color: 'var(--couleur-texte-principal)',
              border: '1px solid var(--couleur-bordure-legere)',
              borderRadius: '12px',
              boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
              fontSize: '14px',
              fontFamily: 'var(--police-principale)',
            },
            success: { iconTheme: { primary: '#28A745', secondary: '#fff' } },
            error: { iconTheme: { primary: '#DC3545', secondary: '#fff' } },
          }}
        />
      </AuthFournisseur>
    </ThemeFournisseur>
  );
}
