// =============================================================================
// Sweet-Cake Mobile — Gestion Ateliers Admin (iOS 26 Style)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, RefreshControl,
    Platform, TouchableOpacity
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import Badge, { BADGE_STATUT_RESERVATION } from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';

export default function AteliersAdmin() {
    const [ateliers, setAteliers] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);

    const charger = async () => {
        try {
            const { data } = await api.get('/ateliers');
            setAteliers(data.donnees || []);
        } catch (err) {
            console.error('Erreur ateliers admin:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    if (chargement) return <Chargement />;

    return (
        <View style={styles.conteneur}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.header}
            >
                <Text style={styles.headerTitre}>GESTION DES ATELIERS</Text>
                <View style={styles.headerStats}>
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatValeur}>{ateliers.length}</Text>
                        <Text style={styles.headerStatLabel}>Total</Text>
                    </View>
                    <View style={styles.headerStatDivider} />
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatValeur}>
                            {ateliers.reduce((acc, a) => acc + (a.places_reservees || 0), 0)}
                        </Text>
                        <Text style={styles.headerStatLabel}>Réservations</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
                refreshControl={
                    <RefreshControl refreshing={false} onRefresh={charger} tintColor="#e9c46a" />
                }
            >
                {ateliers.length > 0 ? (
                    ateliers.map((atelier) => {
                        return (
                            <View key={atelier.id} style={styles.carteGlass}>
                                <View style={styles.entete}>
                                    <View style={styles.infos}>
                                        <Text style={styles.titre} numberOfLines={2}>{atelier.titre}</Text>
                                        <Text style={styles.date}>
                                            {new Date(atelier.date_atelier).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })} • {atelier.heure_debut}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.details}>
                                    <View style={styles.detailItem}>
                                        <Ionicons name="people-outline" size={16} color="#64748b" />
                                        <Text style={styles.detailTexte}>{atelier.places_reservees || 0}/{atelier.capacite}</Text>
                                    </View>
                                    <View style={styles.detailItem}>
                                        <Ionicons name="cash-outline" size={16} color="#64748b" />
                                        <Text style={styles.detailTexte}>{Number(atelier.prix).toLocaleString()} FCFA</Text>
                                    </View>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.btnModifier}
                                        onPress={() => router.push(`/(admin)/atelier-form?id=${atelier.id}`)}
                                    >
                                        <Text style={styles.btnTexteModif}>Modifier</Text>
                                        <Ionicons name="pencil" size={16} color="#64748b" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.vide}>
                        <Ionicons name="school-outline" size={64} color="#cbd5e1" />
                        <Text style={styles.videTexte}>Aucun atelier planifié</Text>
                    </View>
                )}
            </ScrollView>

            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(admin)/atelier-form')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={['#e9c46a', '#f4a261']}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={32} color="#0f172a" />
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        padding: 24,
        paddingTop: 60,
        backgroundColor: '#0f172a',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    headerTitre: {
        fontSize: 12,
        fontWeight: '800',
        color: '#e9c46a',
        letterSpacing: 2,
        marginBottom: 16,
    },
    headerStats: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
    },
    headerStatItem: { gap: 2 },
    headerStatValeur: { fontSize: 24, fontWeight: '900', color: '#fff' },
    headerStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
    headerStatDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.1)' },
    scroll: { flex: 1 },
    carteGlass: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10 },
            android: { elevation: 2 },
        }),
    },
    entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    infos: { flex: 1, marginRight: 12 },
    titre: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
    date: { fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: '500' },
    details: { 
        flexDirection: 'row', 
        gap: 20, 
        marginTop: 16,
        backgroundColor: '#f8fafc',
        padding: 16,
        borderRadius: 16,
    },
    detailItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
    detailTexte: { fontSize: 13, fontWeight: '700', color: '#475569' },
    actions: { flexDirection: 'row', gap: 12, marginTop: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 16 },
    btnAction: { flex: 1 },
    btnGradient: {
        height: 48,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    btnModifier: {
        height: 48,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    btnTexte: { color: '#fff', fontSize: 14, fontWeight: '800' },
    btnTexteModif: { color: '#64748b', fontSize: 14, fontWeight: '800' },
    vide: { alignItems: 'center', justifyContent: 'center', padding: 100, gap: 16 },
    videTexte: { fontSize: 15, color: '#94a3b8', fontWeight: '600', textAlign: 'center' },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 12 },
            android: { elevation: 8 },
        }),
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
