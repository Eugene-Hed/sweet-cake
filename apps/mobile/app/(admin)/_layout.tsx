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
                    backgroundColor: couleurs.gris[900],
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTintColor: couleurs.blanc,
                headerTitleStyle: {
                    fontWeight: '800',
                    fontSize: 20,
                    letterSpacing: 0.5,
                },
                tabBarActiveTintColor: couleurs.secondaire.defaut,
                tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
                tabBarStyle: {
                    backgroundColor: 'rgba(15, 23, 42, 0.9)', // Navy profond avec transparence
                    borderTopWidth: 0,
                    height: 64,
                    position: 'absolute',
                    bottom: 24,
                    left: 20,
                    right: 20,
                    borderRadius: 32,
                    paddingBottom: 0,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: 8 },
                            shadowOpacity: 0.4,
                            shadowRadius: 15,
                        },
                        android: {
                            elevation: 12,
                        },
                    }),
                },
                tabBarLabelStyle: {
                    fontSize: 10,
                    fontWeight: '700',
                    marginBottom: 8,
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
