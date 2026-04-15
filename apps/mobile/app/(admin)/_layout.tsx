// =============================================================================
// Sweet-Cake Mobile — Layout Tabs Admin (Navigation Premium Dark)
// =============================================================================

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs, Redirect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, espacements } from '@sweet-cake/shared';
import { useAuthStore } from '../../src/stores/auth.store';

type IoniconsName = React.ComponentProps<typeof Ionicons>['name'];

const TAB_BAR_HEIGHT = Platform.OS === 'ios' ? 88 : 70;
const ICON_SIZE = 24;

function TabBarIcon({ name, color, focused }: { name: IoniconsName; color: string; focused: boolean }) {
    return (
        <View style={[styles.iconWrapper, focused && styles.iconWrapperActive]}>
            <Ionicons name={name} size={ICON_SIZE} color={color} />
            {focused && <View style={styles.activeIndicator} />}
        </View>
    );
}

export default function AdminLayout() {
    const { estConnecte, estAdmin, estChargement } = useAuthStore();

    // Pendant le chargement de la session, on n'affiche rien pour éviter les flashs de redirection
    if (estChargement) return null;

    // Protection : Redirection si non connecté ou non admin
    if (!estConnecte || !estAdmin) {
        return <Redirect href="/(client)/accueil" />;
    }

    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: '#0f172a', // Navy profond pour cohérence
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: '#e9c46a', // Titre en Or
                headerTitleStyle: {
                    fontWeight: '900',
                    fontSize: 22,
                    letterSpacing: -0.5,
                },
                tabBarActiveTintColor: '#e9c46a', // Or pour l'icône active
                tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
                tabBarStyle: {
                    backgroundColor: 'rgba(15, 23, 42, 0.95)', // Navy encore plus profond
                    borderTopWidth: 0,
                    height: 68,
                    position: 'absolute',
                    bottom: 24,
                    left: 20,
                    right: 20,
                    borderRadius: 34,
                    paddingBottom: 0,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 12 },
                            shadowOpacity: 0.5,
                            shadowRadius: 18,
                        },
                        android: {
                            elevation: 15,
                        },
                    }),
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '800',
                    marginBottom: 10,
                },
            }}
        >
            <Tabs.Screen
                name="dashboard"
                options={{
                    title: 'Dashboard',
                    tabBarLabel: 'Stats',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'analytics' : 'analytics-outline'} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="commandes"
                options={{
                    title: 'Commandes',
                    tabBarLabel: 'Ventes',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'receipt' : 'receipt-outline'} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="catalogue"
                options={{
                    headerShown: false,
                    title: 'Catalogue',
                    tabBarLabel: 'Catalogue',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'apps' : 'apps-outline'} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="plus"
                options={{
                    title: 'Plus',
                    tabBarLabel: 'Menu',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'menu' : 'menu-outline'} color={color} focused={focused} />
                    ),
                }}
            />

            {/* Écrans masqués de la barre de tâches (accessibles via navigation uniquement) */}
            <Tabs.Screen name="atelier-form" options={{ href: null }} />
            <Tabs.Screen name="ateliers-admin" options={{ href: null }} />
            <Tabs.Screen name="stock" options={{ href: null }} />
            <Tabs.Screen name="stock-form" options={{ href: null }} />
        </Tabs>
    );
}

const styles = StyleSheet.create({
    iconWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 44,
        height: 32,
        borderRadius: 16,
    },
    iconWrapperActive: {
        backgroundColor: 'rgba(233, 196, 106, 0.15)',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -6,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: couleurs.secondaire.defaut,
    },
});
