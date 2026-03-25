// =============================================================================
// Sweet-Cake Mobile — Gestion des Commandes Admin (iOS 26 Style)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, RefreshControl,
    Platform, TouchableOpacity, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import Badge, { BADGE_STATUT_COMMANDE } from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CommandesAdmin() {
    const [commandes, setCommandes] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);
    const [rafraichissant, setRafraichissant] = useState(false);

    const charger = async () => {
        try {
            const { data } = await api.get('/commandes?limite=20');
            setCommandes(data.donnees || []);
        } catch (err) {
            console.error('Erreur commandes admin:', err);
        } finally {
            setChargement(false);
            setRafraichissant(false);
        }
    };

    useEffect(() => { charger(); }, []);

    const changerStatut = async (id: number, nouveauStatut: string) => {
        try {
            await api.patch(`/commandes/${id}/statut`, { statut: nouveauStatut });
            charger();
        } catch (err) {
            console.error('Erreur statut:', err);
        }
    };

    if (chargement) return <Chargement />;

    return (
        <ScrollView
            style={styles.conteneur}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            refreshControl={
                <RefreshControl
                    refreshing={rafraichissant}
                    onRefresh={() => { setRafraichissant(true); charger(); }}
                    tintColor={couleurs.secondaire.defaut}
                />
            }
        >
            <View style={styles.padding}>
                {commandes.length > 0 ? (
                    commandes.map((c) => (
                        <View key={c.id} style={styles.carteGlass}>
                            <View style={styles.entete}>
                                <View>
                                    <Text style={styles.id}>Commande #{c.id}</Text>
                                    <Text style={styles.date}>
                                        {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </Text>
                                </View>
                                <Badge
                                    texte={c.statut.replace('_', ' ')}
                                    variante={BADGE_STATUT_COMMANDE[c.statut] || 'neutre'}
                                />
                            </View>

                            <View style={styles.clientInfo}>
                                <View style={styles.avatarMini}>
                                    <Text style={styles.avatarTexte}>{c.client?.nom_complet?.charAt(0) || '?'}</Text>
                                </View>
                                <View>
                                    <Text style={styles.clientNom}>{c.client?.nom_complet || 'Client inconnu'}</Text>
                                    <Text style={styles.clientTel}>{c.client?.telephone || 'Pas de numéro'}</Text>
                                </View>
                            </View>

                            <View style={styles.produitsSection}>
                                {c.lignes?.map((l: any, idx: number) => (
                                    <View key={idx} style={styles.produitLigne}>
                                        <View style={styles.puce} />
                                        <Text style={styles.produitTexte} numberOfLines={1}>
                                            <Text style={styles.quantite}>{l.quantite}x</Text> {l.produit?.nom}
                                        </Text>
                                    </View>
                                ))}
                            </View>

                            <View style={styles.pied}>
                                <View>
                                    <Text style={styles.totalLabel}>Total TTC</Text>
                                    <Text style={styles.total}>{Number(c.montant_total).toLocaleString()} FCFA</Text>
                                </View>

                                <View style={styles.actions}>
                                    {c.statut === 'en_attente' && (
                                        <TouchableOpacity onPress={() => changerStatut(c.id, 'confirmee')}>
                                            <LinearGradient colors={['#27ae60', '#2ecc71']} style={styles.actionBtn}>
                                                <Ionicons name="checkmark" size={20} color="#fff" />
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                    {c.statut === 'confirmee' && (
                                        <TouchableOpacity onPress={() => changerStatut(c.id, 'en_preparation')}>
                                            <LinearGradient colors={['#e67e22', '#f39c12']} style={styles.actionBtn}>
                                                <Ionicons name="hammer-outline" size={20} color="#fff" />
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                    {c.statut === 'en_preparation' && (
                                        <TouchableOpacity onPress={() => changerStatut(c.id, 'prete')}>
                                            <LinearGradient colors={['#2980b9', '#3498db']} style={styles.actionBtn}>
                                                <Ionicons name="gift-outline" size={20} color="#fff" />
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.vide}>
                        <Ionicons name="receipt-outline" size={64} color={couleurs.gris[300]} />
                        <Text style={styles.videTexte}>Aucune commande pour le moment</Text>
                    </View>
                )}
            </View>
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
    entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
    id: { fontSize: 16, fontWeight: '800', color: '#0f172a' },
    date: { fontSize: 13, color: '#64748b', marginTop: 2 },
    clientInfo: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 16 },
    avatarMini: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#f1f5f9',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatarTexte: { fontSize: 14, fontWeight: '700', color: couleurs.primaire.defaut },
    clientNom: { fontSize: 15, fontWeight: '700', color: '#1e293b' },
    clientTel: { fontSize: 12, color: '#94a3b8' },
    produitsSection: {
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 16,
        marginBottom: 16,
    },
    produitLigne: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
    puce: { width: 4, height: 4, borderRadius: 2, backgroundColor: couleurs.primaire.defaut },
    produitTexte: { fontSize: 13, color: '#475569', flex: 1 },
    quantite: { fontWeight: '800', color: '#1e293b' },
    pied: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 16
    },
    totalLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 0.5 },
    total: { fontSize: 20, fontWeight: '900', color: couleurs.primaire.defaut, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 10 },
    actionBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    vide: { alignItems: 'center', justifyContent: 'center', padding: 100, gap: 16 },
    videTexte: { fontSize: 15, color: '#94a3b8', fontWeight: '600', textAlign: 'center' },
});
