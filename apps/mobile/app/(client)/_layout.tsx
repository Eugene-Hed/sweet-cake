// =============================================================================
// Sweet-Cake Mobile — Layout Tabs Client
// =============================================================================

import { Tabs } from 'expo-router';
import { couleurs } from '@sweet-cake/shared';

export default function ClientLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: couleurs.blanc },
                headerTitleStyle: { fontWeight: '700', color: couleurs.gris[900] },
                tabBarActiveTintColor: couleurs.primaire.defaut,
                tabBarInactiveTintColor: couleurs.gris[400],
                tabBarStyle: {
                    backgroundColor: couleurs.blanc,
                    borderTopColor: couleurs.gris[200],
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tabs.Screen name="accueil" options={{ title: 'Accueil', tabBarIcon: () => null, tabBarLabel: '🏠 Accueil' }} />
            <Tabs.Screen name="catalogue" options={{ title: 'Catalogue', tabBarLabel: '🍰 Catalogue' }} />
            <Tabs.Screen name="ateliers" options={{ title: 'Ateliers', tabBarLabel: '👩‍🍳 Ateliers' }} />
            <Tabs.Screen name="panier" options={{ title: 'Panier', tabBarLabel: '🛒 Panier' }} />
            <Tabs.Screen name="profil" options={{ title: 'Profil', tabBarLabel: '👤 Profil' }} />
        </Tabs>
    );
}
