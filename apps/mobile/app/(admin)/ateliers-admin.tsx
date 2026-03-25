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
        <ScrollView
            style={styles.conteneur}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
                <RefreshControl
                    refreshing={false}
                    onRefresh={charger}
                    tintColor={couleurs.secondaire.defaut}
                />
            }
        >
            <View style={styles.padding}>
                {ateliers.length > 0 ? (
                    ateliers.map((atelier) => {
                        const progression = ((atelier.places_reservees || 0) / (atelier.capacite || 1)) * 100;
                        const reservations = atelier.reservations_atelier || [];

                        return (
                            <View key={atelier.id} style={styles.carteGlass}>
                                {/* Entête */}
                                <View style={styles.entete}>
                                    <View style={styles.dateBadge}>
                                        <Text style={styles.dateJour}>
                                            {new Date(atelier.date_atelier).getDate()}
                                        </Text>
                                        <Text style={styles.dateMois}>
                                            {new Date(atelier.date_atelier).toLocaleDateString('fr-FR', { month: 'short' }).toUpperCase()}
                                        </Text>
                                    </View>
                                    <View style={{ flex: 1, marginLeft: 14 }}>
                                        <Text style={styles.titre} numberOfLines={2}>{atelier.titre}</Text>
                                        <Text style={styles.horaire}>
                                            {atelier.heure_debut} - {atelier.heure_fin}
                                        </Text>
                                    </View>
                                </View>

                                {/* Jauge de remplissage */}
                                <View style={styles.jaugeConteneur}>
                                    <View style={styles.jaugeLabels}>
                                        <Text style={styles.jaugeLabel}>Remplissage</Text>
                                        <Text style={[styles.jaugeValeur, progression >= 100 && { color: '#dc2626' }]}>
                                            {atelier.places_reservees || 0}/{atelier.capacite}
                                        </Text>
                                    </View>
                                    <View style={styles.jaugePiste}>
                                        <LinearGradient
                                            colors={progression >= 100 ? ['#ef4444', '#dc2626'] : ['#e9c46a', '#f4a261']}
                                            start={{ x: 0, y: 0 }}
                                            end={{ x: 1, y: 0 }}
                                            style={[styles.jaugeBarre, { width: `${Math.min(progression, 100)}%` }]}
                                        />
                                    </View>
                                </View>

                                {/* Participants */}
                                {reservations.length > 0 ? (
                                    <View style={styles.participantsSection}>
                                        <Text style={styles.sectionTitre}>Participants</Text>
                                        <View style={styles.avatarsLigne}>
                                            {reservations.slice(0, 5).map((r: any, idx: number) => (
                                                <View key={idx} style={[styles.avatarMini, { marginLeft: idx === 0 ? 0 : -10 }]}>
                                                    <Text style={styles.avatarTexte}>{r.client?.nom_complet?.charAt(0) || '?'}</Text>
                                                </View>
                                            ))}
                                            {reservations.length > 5 && (
                                                <View style={[styles.avatarMini, styles.avatarPlus, { marginLeft: -10 }]}>
                                                    <Text style={styles.avatarTextePlus}>+{reservations.length - 5}</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                ) : (
                                    <View style={styles.videAtelier}>
                                        <Text style={styles.videAtelierTexte}>Aucune réservation pour le moment</Text>
                                    </View>
                                )}

                                <View style={styles.pied}>
                                    <Text style={styles.prix}>{Number(atelier.prix).toLocaleString()} FCFA</Text>
                                    <TouchableOpacity
                                        style={styles.detailBtn}
                                        onPress={() => router.push(`/(admin)/atelier-form?id=${atelier.id}`)}
                                    >
                                        <Text style={styles.detailBtnTexte}>Modifier</Text>
                                        <Ionicons name="pencil" size={14} color={couleurs.secondaire.defaut} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    })
                ) : (
                    <View style={styles.vide}>
                        <Ionicons name="school-outline" size={64} color={couleurs.gris[300]} />
                        <Text style={styles.videTexte}>Aucun atelier planifié</Text>
                    </View>
                )}
            </View>

            {/* Bouton Flottant Ajout */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(admin)/atelier-form')}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={[couleurs.secondaire.defaut, couleurs.secondaire.fonce]}
                    style={styles.fabGradient}
                >
                    <Ionicons name="add" size={32} color={couleurs.blanc} />
                </LinearGradient>
            </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    padding: { padding: 16 },
    carteGlass: {
        backgroundColor: '#ffffff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 12 },
            android: { elevation: 3 },
        }),
    },
    entete: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    dateBadge: {
        width: 50,
        height: 56,
        borderRadius: 16,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateJour: { fontSize: 20, fontWeight: '900', color: couleurs.primaire.defaut },
    dateMois: { fontSize: 10, fontWeight: '800', color: '#64748b', marginTop: -2 },
    titre: { fontSize: 17, fontWeight: '800', color: '#0f172a', lineHeight: 22 },
    horaire: { fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: '600' },
    jaugeConteneur: { marginBottom: 20 },
    jaugeLabels: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    jaugeLabel: { fontSize: 12, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase' },
    jaugeValeur: { fontSize: 13, fontWeight: '800', color: '#1e293b' },
    jaugePiste: { height: 8, backgroundColor: '#f1f5f9', borderRadius: 4, overflow: 'hidden' },
    jaugeBarre: { height: '100%', borderRadius: 4 },
    participantsSection: { marginBottom: 20 },
    sectionTitre: { fontSize: 13, fontWeight: '700', color: '#475569', marginBottom: 10 },
    avatarsLigne: { flexDirection: 'row', alignItems: 'center' },
    avatarMini: {
        width: 32, height: 32, borderRadius: 16,
        backgroundColor: couleurs.secondaire.defaut,
        borderWidth: 2, borderColor: '#fff',
        justifyContent: 'center', alignItems: 'center'
    },
    avatarTexte: { fontSize: 12, fontWeight: '800', color: '#fff' },
    avatarPlus: { backgroundColor: '#f1f5f9', borderColor: '#fff' },
    avatarTextePlus: { fontSize: 11, fontWeight: '800', color: '#64748b' },
    videAtelier: { paddingVertical: 10, borderTopWidth: 1, borderTopColor: '#f8fafc' },
    videAtelierTexte: { fontSize: 13, color: '#94a3b8', fontStyle: 'italic' },
    pied: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 16
    },
    prix: { fontSize: 18, fontWeight: '900', color: couleurs.primaire.defaut },
    detailBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    detailBtnTexte: { fontSize: 14, fontWeight: '700', color: couleurs.secondaire.defaut },
    vide: { alignItems: 'center', justifyContent: 'center', padding: 100, gap: 16 },
    videTexte: { fontSize: 15, color: '#94a3b8', fontWeight: '600', textAlign: 'center' },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 64,
        height: 64,
        borderRadius: 32,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.3, shadowRadius: 12 },
            android: { elevation: 8 },
        }),
    },
    fabGradient: {
        width: '100%',
        height: '100%',
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
