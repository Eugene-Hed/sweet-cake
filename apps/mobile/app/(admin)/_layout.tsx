// =============================================================================
// Sweet-Cake Mobile — Layout Tabs Admin
// =============================================================================

import { Tabs } from 'expo-router';
import { couleurs } from '@sweet-cake/shared';

export default function AdminLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: { backgroundColor: couleurs.gris[900] },
                headerTintColor: couleurs.blanc,
                headerTitleStyle: { fontWeight: '700' },
                tabBarActiveTintColor: couleurs.secondaire.defaut,
                tabBarInactiveTintColor: couleurs.gris[500],
                tabBarStyle: {
                    backgroundColor: couleurs.gris[900],
                    borderTopColor: couleurs.gris[800],
                    height: 60,
                    paddingBottom: 8,
                },
                tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
            }}
        >
            <Tabs.Screen name="dashboard" options={{ title: 'Dashboard', tabBarLabel: '📊 Dashboard' }} />
            <Tabs.Screen name="commandes" options={{ title: 'Commandes', tabBarLabel: '📦 Commandes' }} />
            <Tabs.Screen name="ateliers-admin" options={{ title: 'Ateliers', tabBarLabel: '👩‍🍳 Ateliers' }} />
            <Tabs.Screen name="stock" options={{ title: 'Stock', tabBarLabel: '📦 Stock' }} />
            <Tabs.Screen name="plus" options={{ title: 'Plus', tabBarLabel: '⚙️ Plus' }} />
        </Tabs>
    );
}
