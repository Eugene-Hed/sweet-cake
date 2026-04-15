// =============================================================================
// Sweet-Cake Mobile — Écran Profil Client (Design Premium)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../../src/services/api';
import { useAuthStore } from '../../../src/stores/auth.store';
import Badge, { BADGE_STATUT_COMMANDE, BADGE_STATUT_RESERVATION } from '../../../src/composants/Badge';
import Bouton from '../../../src/composants/Bouton';
import Chargement from '../../../src/composants/Chargement';

export default function Profil() {
    const { utilisateur, deconnexion } = useAuthStore();
    const [commandes, setCommandes] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);

    const charger = async () => {
        try {
            const [resCom, resRev] = await Promise.all([
                api.get('/commandes/mes-commandes?limite=5'),
                api.get('/reservations/mes-reservations?limite=5').catch(() => ({ data: { donnees: [] } })),
            ]);
            setCommandes(resCom.data.donnees || []);
            setReservations(resRev.data.donnees || []);
        } catch (err) {
            console.error('Erreur profil:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    const handleDeconnexion = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Déconnexion',
                style: 'destructive',
                onPress: async () => {
                    await deconnexion();
                    router.replace('/(auth)/connexion');
                },
            },
        ]);
    };

    const annulerReservation = async (id: number) => {
        try {
            await api.post(`/reservations/${id}/annuler`);
            Alert.alert('✅', 'Réservation annulée');
            charger();
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Impossible d\'annuler');
        }
    };

    if (chargement) return <Chargement />;

    return (
        <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>
            {/* Carte profil premium */}
            <LinearGradient
                colors={[couleurs.primaire.defaut, couleurs.primaire.fonce]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.profilGradient}
            >
                <View style={styles.avatar}>
                    <Text style={styles.avatarTexte}>
                        {utilisateur?.nom_complet?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.nom}>{utilisateur?.nom_complet}</Text>
                <Text style={styles.email}>{utilisateur?.email}</Text>
                <View style={styles.roleBadge}>
                    <Ionicons name="shield-checkmark" size={14} color={couleurs.secondaire.fonce} />
                    <Text style={styles.roleBadgeTexte}>{utilisateur?.role || 'client'}</Text>
                </View>
            </LinearGradient>

            {/* Quick actions */}
            <View style={styles.quickActions}>
                <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(client)/catalogue')}>
                    <View style={[styles.quickActionIcone, { backgroundColor: couleurs.primaire.clair + '20' }]}>
                        <Ionicons name="storefront" size={20} color={couleurs.primaire.defaut} />
                    </View>
                    <Text style={styles.quickActionTexte}>Catalogue</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(client)/panier')}>
                    <View style={[styles.quickActionIcone, { backgroundColor: couleurs.secondaire.clair + '40' }]}>
                        <Ionicons name="cart" size={20} color={couleurs.secondaire.fonce} />
                    </View>
                    <Text style={styles.quickActionTexte}>Panier</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.quickAction} onPress={() => router.push('/(client)/ateliers')}>
                    <View style={[styles.quickActionIcone, { backgroundColor: couleurs.succes.clair + '40' }]}>
                        <Ionicons name="school" size={20} color={couleurs.succes.fonce} />
                    </View>
                    <Text style={styles.quickActionTexte}>Ateliers</Text>
                </TouchableOpacity>
            </View>

            {/* Mes commandes */}
            <View style={styles.section}>
                <View style={styles.sectionEntete}>
                    <Ionicons name="receipt-outline" size={20} color={couleurs.gris[900]} />
                    <Text style={styles.sectionTitre}>Mes commandes</Text>
                </View>
                {commandes.length > 0 ? commandes.map((c) => (
                    <TouchableOpacity
                        key={c.id}
                        style={styles.itemCarte}
                        onPress={() => router.push(`/(client)/profil/commandes/${c.id}`)}
                    >
                        <View style={styles.itemEntete}>
                            <View style={styles.itemIdBloc}>
                                <Text style={styles.itemId}>Commande #{c.id}</Text>
                                <Text style={styles.itemDate}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</Text>
                            </View>
                            <Badge
                                texte={c.statut.replace('_', ' ')}
                                variante={BADGE_STATUT_COMMANDE[c.statut] || 'neutre'}
                            />
                        </View>
                        <View style={styles.itemPied}>
                            <Text style={styles.itemTotal}>{Number(c.montant_total).toLocaleString()} FCFA</Text>
                        </View>
                    </TouchableOpacity>
                )) : (
                    <View style={styles.aucunConteneur}>
                        <Ionicons name="receipt-outline" size={32} color={couleurs.gris[300]} />
                        <Text style={styles.aucun}>Aucune commande pour le moment</Text>
                    </View>
                )}
            </View>

            {/* Mes réservations */}
            <View style={styles.section}>
                <View style={styles.sectionEntete}>
                    <Ionicons name="calendar-outline" size={20} color={couleurs.gris[900]} />
                    <Text style={styles.sectionTitre}>Mes réservations</Text>
                </View>
                {reservations.length > 0 ? reservations.map((r) => (
                    <View key={r.id} style={styles.itemCarte}>
                        <View style={styles.itemEntete}>
                            <Text style={styles.itemNom}>{r.atelier?.titre || `Atelier #${r.atelier_id}`}</Text>
                            <Badge
                                texte={r.statut.replace('_', ' ')}
                                variante={BADGE_STATUT_RESERVATION[r.statut] || 'neutre'}
                            />
                        </View>
                        {r.statut !== 'annulee' && (
                            <TouchableOpacity onPress={() => annulerReservation(r.id)} style={styles.annulerBtn}>
                                <Ionicons name="close-circle-outline" size={16} color={couleurs.erreur.defaut} />
                                <Text style={styles.annuler}>Annuler</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )) : (
                    <View style={styles.aucunConteneur}>
                        <Ionicons name="calendar-outline" size={32} color={couleurs.gris[300]} />
                        <Text style={styles.aucun}>Aucune réservation pour le moment</Text>
                    </View>
                )}
            </View>

            {/* Déconnexion */}
            <View style={styles.section}>
                <Bouton
                    titre="Se déconnecter"
                    onPress={handleDeconnexion}
                    variante="danger"
                    pleineLargeur
                    taille="lg"
                    icone={<Ionicons name="log-out-outline" size={20} color={couleurs.blanc} />}
                />
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    profilGradient: {
        padding: 24,
        paddingTop: 32,
        alignItems: 'center',
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderWidth: 3,
        borderColor: 'rgba(255,255,255,0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    avatarTexte: { fontSize: 32, fontWeight: '800', color: couleurs.blanc },
    nom: { fontSize: 22, fontWeight: '800', color: couleurs.blanc },
    email: { fontSize: 14, color: 'rgba(255,255,255,0.75)', marginTop: 2, marginBottom: 10 },
    roleBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 20,
        gap: 4,
    },
    roleBadgeTexte: { fontSize: 12, fontWeight: '700', color: couleurs.blanc, textTransform: 'capitalize' },
    quickActions: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingVertical: 18,
        paddingHorizontal: 16,
        marginTop: -14,
        marginHorizontal: 16,
        backgroundColor: couleurs.blanc,
        borderRadius: 18,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 12,
            },
            android: { elevation: 4 },
        }),
    },
    quickAction: { alignItems: 'center' },
    quickActionIcone: {
        width: 44,
        height: 44,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 6,
    },
    quickActionTexte: { fontSize: 12, fontWeight: '600', color: couleurs.gris[700] },
    section: { padding: 16, paddingBottom: 4 },
    sectionEntete: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        marginBottom: 14,
    },
    sectionTitre: { fontSize: 17, fontWeight: '700', color: couleurs.gris[900] },
    itemCarte: {
        backgroundColor: couleurs.blanc,
        borderRadius: 14,
        padding: 14,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 6,
            },
            android: { elevation: 2 },
        }),
    },
    itemEntete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemIdBloc: { flex: 1 },
    itemId: { fontSize: 14, fontWeight: '700', color: couleurs.gris[900] },
    itemNom: { fontSize: 14, fontWeight: '600', color: couleurs.gris[900], flex: 1, marginRight: 8 },
    itemDate: { fontSize: 12, color: couleurs.gris[500], marginTop: 2 },
    itemPied: { marginTop: 8 },
    itemTotal: { fontSize: 16, fontWeight: '800', color: couleurs.primaire.defaut },
    annulerBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 10 },
    annuler: { fontSize: 13, color: couleurs.erreur.defaut, fontWeight: '600' },
    aucunConteneur: { alignItems: 'center', paddingVertical: 28 },
    aucun: { fontSize: 14, color: couleurs.gris[400], marginTop: 8 },
});
