// =============================================================================
// Sweet-Cake Mobile — Layout Tabs Client (Navigation Premium)
// =============================================================================

import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, espacements } from '@sweet-cake/shared';

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

export default function ClientLayout() {
    return (
        <Tabs
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: couleurs.blanc,
                    elevation: 0,
                    shadowOpacity: 0,
                    borderBottomWidth: 0,
                },
                headerTitleStyle: {
                    fontWeight: '700',
                    fontSize: 18,
                    color: couleurs.gris[900],
                },
                tabBarActiveTintColor: couleurs.primaire.defaut,
                tabBarInactiveTintColor: couleurs.gris[400],
                tabBarStyle: {
                    backgroundColor: couleurs.blanc,
                    borderTopWidth: 0,
                    height: TAB_BAR_HEIGHT,
                    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
                    paddingTop: 10,
                    ...Platform.select({
                        ios: {
                            shadowColor: couleurs.noir,
                            shadowOffset: { width: 0, height: -4 },
                            shadowOpacity: 0.08,
                            shadowRadius: 12,
                        },
                        android: {
                            elevation: 12,
                        },
                    }),
                },
                tabBarLabelStyle: {
                    fontSize: 11,
                    fontWeight: '600',
                    marginTop: 2,
                },
                tabBarItemStyle: {
                    paddingVertical: 2,
                },
            }}
        >
            <Tabs.Screen
                name="accueil"
                options={{
                    title: 'Accueil',
                    tabBarLabel: 'Accueil',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'home' : 'home-outline'} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="catalogue"
                options={{
                    title: 'Catalogue',
                    tabBarLabel: 'Catalogue',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'grid' : 'grid-outline'} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="ateliers"
                options={{
                    title: 'Ateliers',
                    tabBarLabel: 'Ateliers',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'school' : 'school-outline'} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="panier"
                options={{
                    title: 'Panier',
                    tabBarLabel: 'Panier',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'cart' : 'cart-outline'} color={color} focused={focused} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profil"
                options={{
                    title: 'Profil',
                    tabBarLabel: 'Profil',
                    tabBarIcon: ({ color, focused }) => (
                        <TabBarIcon name={focused ? 'person' : 'person-outline'} color={color} focused={focused} />
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
        width: 48,
        height: 28,
        borderRadius: 14,
    },
    iconWrapperActive: {
        backgroundColor: couleurs.primaire.clair + '30',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: -6,
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: couleurs.primaire.defaut,
    },
});
