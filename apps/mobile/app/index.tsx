// =============================================================================
// Sweet-Cake Mobile — Index (redirection conditionnelle)
// =============================================================================

import { Redirect } from 'expo-router';
import { useAuthStore } from '../src/stores/auth.store';
import Chargement from '../src/composants/Chargement';

export default function Index() {
    const { estConnecte, estAdmin, estChargement } = useAuthStore();

    if (estChargement) {
        return <Chargement message="Démarrage..." />;
    }

    if (!estConnecte) {
        return <Redirect href="/(auth)/connexion" />;
    }

    if (estAdmin) {
        return <Redirect href="/(admin)/dashboard" />;
    }

    return <Redirect href="/(client)/accueil" />;
}
