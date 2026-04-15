// =============================================================================
// Sweet-Cake Mobile — Écran Plus (Admin)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import { useAuthStore } from '../../src/stores/auth.store';
import Badge from '../../src/composants/Badge';
import Bouton from '../../src/composants/Bouton';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PlusAdmin() {
    const { utilisateur, deconnexion } = useAuthStore();
    const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
    const [journaux, setJournaux] = useState<any[]>([]);

    useEffect(() => {
        const charger = async () => {
            try {
                const [resUsers, resLogs] = await Promise.all([
                    api.get('/utilisateurs?limite=10'),
                    api.get('/journaux-audit?limite=10').catch(() => ({ data: { donnees: [] } })),
                ]);
                setUtilisateurs(resUsers.data.donnees || []);
                setJournaux(resLogs.data.donnees || []);
            } catch (err) {
                console.error('Erreur plus:', err);
            }
        };
        charger();
    }, []);

    const handleDeconnexion = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Déconnexion', style: 'destructive',
                onPress: async () => { await deconnexion(); router.replace('/(auth)/connexion'); },
            },
        ]);
    };

    const ROLES_COULEURS: Record<string, string> = {
        administrateur: 'primaire',
        client: 'neutre',
    };

    return (
        <View style={styles.conteneur}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Profil admin Premium Header */}
                <LinearGradient
                    colors={['#0f172a', '#1e293b']}
                    style={styles.profilCarte}
                >
                    <View style={styles.profilContenu}>
                        <View style={styles.avatar}>
                            <LinearGradient colors={['#e9c46a', '#f4a261']} style={styles.avatarGradient}>
                                <Text style={styles.avatarTexte}>
                                    {utilisateur?.nom_complet?.charAt(0)?.toUpperCase() || 'A'}
                                </Text>
                            </LinearGradient>
                        </View>
                        <View>
                            <Text style={styles.nom}>{utilisateur?.nom_complet}</Text>
                            <Text style={styles.email}>{utilisateur?.email}</Text>
                            <View style={styles.roleBadge}>
                                <Ionicons name="shield-checkmark" size={12} color="#e9c46a" />
                                <Text style={styles.roleTexte}>ADMINISTRATEUR PRINCIPAL</Text>
                            </View>
                        </View>
                    </View>
                </LinearGradient>

                <View style={styles.corps}>
                    {/* Actions Administrateur - Grille Moderne */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitre}>GESTION GÉNÉRALE</Text>
                        <View style={styles.grille}>
                            <TouchableOpacity style={styles.tuile} onPress={() => router.push('/(admin)/catalogue/produits')}>
                                <View style={[styles.tuileIcone, { backgroundColor: 'rgba(107, 73, 58, 0.08)' }]}>
                                    <Ionicons name="cafe" size={26} color={couleurs.primaire.defaut} />
                                </View>
                                <Text style={styles.tuileTexte}>Produits</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.tuile} onPress={() => router.push('/(admin)/stock')}>
                                <View style={[styles.tuileIcone, { backgroundColor: '#fef3c7' }]}>
                                    <Ionicons name="cube" size={26} color="#b45309" />
                                </View>
                                <Text style={styles.tuileTexte}>Stock</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.tuile} onPress={() => router.push('/(admin)/ateliers-admin')}>
                                <View style={[styles.tuileIcone, { backgroundColor: '#e0f2fe' }]}>
                                    <Ionicons name="school" size={26} color="#0369a1" />
                                </View>
                                <Text style={styles.tuileTexte}>Ateliers</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.tuile} onPress={() => router.push('/(admin)/catalogue/categories')}>
                                <View style={[styles.tuileIcone, { backgroundColor: 'rgba(233, 196, 106, 0.15)' }]}>
                                    <Ionicons name="apps" size={26} color="#8e7943" />
                                </View>
                                <Text style={styles.tuileTexte}>Catégories</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Utilisateurs */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitre}>UTILISATEURS RÉCENTS ({utilisateurs.length})</Text>
                        {utilisateurs.map((u) => (
                            <View key={u.id} style={styles.userLigne}>
                                <View style={styles.userAvatar}>
                                    <Text style={styles.userAvatarTexte}>{u.nom_complet?.charAt(0)}</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.userNom}>{u.nom_complet}</Text>
                                    <Text style={styles.userEmail}>{u.email}</Text>
                                </View>
                                <Badge texte={u.role.toUpperCase()} variante={(ROLES_COULEURS[u.role] as any) || 'neutre'} />
                            </View>
                        ))}
                    </View>

                    {/* Journaux d'audit */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitre}>JOURNAUX D'ACTIVITÉ</Text>
                        {journaux.length > 0 ? journaux.map((j: any) => (
                            <View key={j.id} style={styles.logCarte}>
                                <View style={styles.logDot} />
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.logAction}>{j.action}</Text>
                                    <Text style={styles.logDetails}>{j.entite} • #{j.entite_id}</Text>
                                </View>
                                <Text style={styles.logDate}>
                                    {new Date(j.created_at).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' })}
                                </Text>
                            </View>
                        )) : (
                            <View style={styles.videBox}>
                                <Text style={styles.aucun}>Aucun journal d'audit disponible</Text>
                            </View>
                        )}
                    </View>

                    {/* Déconnexion */}
                    <View style={styles.sectionDeconnexion}>
                        <TouchableOpacity style={styles.deconnexionBtn} onPress={handleDeconnexion}>
                            <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                            <Text style={styles.deconnexionTexte}>Fermer la session administrative</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={{ height: 100 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    profilCarte: {
        padding: 32,
        paddingTop: Platform.OS === 'ios' ? 70 : 40,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    profilContenu: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 20,
    },
    avatar: {
        width: 72,
        height: 72,
        borderRadius: 36,
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.15)',
        padding: 4,
    },
    avatarGradient: {
        flex: 1,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarTexte: { fontSize: 28, fontWeight: '900', color: couleurs.blanc },
    nom: { fontSize: 20, fontWeight: '800', color: couleurs.blanc },
    email: { fontSize: 13, color: 'rgba(255,255,255,0.6)', marginTop: 2 },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(233, 196, 106, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 8,
        alignSelf: 'flex-start',
    },
    roleTexte: { fontSize: 9, fontWeight: '800', color: '#e9c46a', letterSpacing: 0.5 },
    corps: { paddingHorizontal: 16 },
    section: { marginTop: 24 },
    sectionTitre: { fontSize: 13, fontWeight: '800', color: '#94a3b8', letterSpacing: 1.5, marginBottom: 16, paddingLeft: 4 },
    grille: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    tuile: {
        width: (SCREEN_WIDTH - 32 - 12) / 2,
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 10 },
            android: { elevation: 2 },
        }),
    },
    tuileIcone: {
        width: 56,
        height: 56,
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    tuileTexte: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    userLigne: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 12,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    userAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
    userAvatarTexte: { fontSize: 14, fontWeight: '800', color: '#64748b' },
    userNom: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
    userEmail: { fontSize: 12, color: '#94a3b8', marginTop: 1 },
    logCarte: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        marginBottom: 8,
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    logDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e9c46a' },
    logAction: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
    logDetails: { fontSize: 12, color: '#64748b', marginTop: 2 },
    logDate: { fontSize: 11, color: '#94a3b8', fontWeight: '600' },
    videBox: { padding: 20, alignItems: 'center' },
    aucun: { fontSize: 13, color: '#94a3b8', fontWeight: '500' },
    sectionDeconnexion: { marginTop: 32, paddingBottom: 20 },
    deconnexionBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: '#fff1f2',
        padding: 16,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ffe4e6',
    },
    deconnexionTexte: { fontSize: 15, fontWeight: '700', color: '#ef4444' },
});
