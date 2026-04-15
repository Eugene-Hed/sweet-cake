// =============================================================================
// Sweet-Cake Mobile — Gestion des Commandes Admin (iOS 26 Style)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, RefreshControl,
    Platform, TouchableOpacity, Dimensions, Linking
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

    const contacterClient = (tel: string, message: string) => {
        const url = `whatsapp://send?phone=${tel}&text=${encodeURIComponent(message)}`;
        Linking.canOpenURL(url).then(supported => {
            if (supported) {
                Linking.openURL(url);
            } else {
                Linking.openURL(`tel:${tel}`);
            }
        });
    };

    return (
        <View style={styles.conteneur}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.header}
            >
                <Text style={styles.headerTitre}>GESTION DES VENTES</Text>
                <View style={styles.headerStats}>
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatValeur}>{commandes.filter(c => c.statut === 'en_attente').length}</Text>
                        <Text style={styles.headerStatLabel}>À confirmer</Text>
                    </View>
                    <View style={styles.headerStatDivider} />
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatValeur}>{commandes.length}</Text>
                        <Text style={styles.headerStatLabel}>Total (20j)</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
                refreshControl={
                    <RefreshControl
                        refreshing={rafraichissant}
                        onRefresh={() => { setRafraichissant(true); charger(); }}
                        tintColor="#e9c46a"
                    />
                }
            >
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
                                        {l.options_choisies && Object.entries(l.options_choisies).length > 0 && (
                                            <Text style={styles.optionTexte}>
                                                {Object.entries(l.options_choisies).map(([k, v]) => `${k}: ${v}`).join(' • ')}
                                            </Text>
                                        )}
                                    </View>
                                ))}
                            </View>

                            <View style={styles.pied}>
                                <View>
                                    <Text style={styles.totalLabel}>Montant Total</Text>
                                    <View style={styles.totalRow}>
                                        <Text style={styles.total}>{Number(c.montant_total).toLocaleString()} </Text>
                                        <Text style={styles.devise}>FCFA</Text>
                                    </View>
                                </View>

                                <View style={styles.actions}>
                                    <TouchableOpacity 
                                        style={styles.contactBtn}
                                        onPress={() => contacterClient(c.client?.telephone, `Bonjour ${c.client?.nom_complet}, concernant votre commande #${c.id} chez Sweet-Cake...`)}
                                    >
                                        <Ionicons name="logo-whatsapp" size={18} color="#2ecc71" />
                                    </TouchableOpacity>

                                    {c.statut === 'en_attente' && (
                                        <TouchableOpacity onPress={() => changerStatut(c.id, 'confirmee')}>
                                            <LinearGradient colors={['#b59a5d', '#8e7943']} style={styles.actionBtn}>
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
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        padding: 24,
        paddingTop: 20,
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
    headerStatItem: {
        gap: 2,
    },
    headerStatValeur: {
        fontSize: 24,
        fontWeight: '900',
        color: '#fff',
    },
    headerStatLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
    headerStatDivider: {
        width: 1,
        height: 24,
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    scroll: { flex: 1 },
    carteGlass: {
        backgroundColor: '#ffffff',
        borderRadius: 28,
        padding: 24,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.04, shadowRadius: 16 },
            android: { elevation: 3 },
        }),
    },
    entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
    id: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
    date: { fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: '500' },
    clientInfo: { 
        flexDirection: 'row', 
        alignItems: 'center', 
        gap: 14, 
        marginBottom: 20,
        backgroundColor: 'rgba(107, 73, 58, 0.03)',
        padding: 12,
        borderRadius: 16,
    },
    avatarMini: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    avatarTexte: { fontSize: 15, fontWeight: '800', color: couleurs.primaire.defaut },
    clientNom: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    clientTel: { fontSize: 13, color: '#94a3b8', marginTop: 2 },
    produitsSection: {
        backgroundColor: '#fff',
        padding: 4,
        borderRadius: 16,
        marginBottom: 20,
    },
    produitLigne: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
    puce: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e9c46a' },
    produitTexte: { fontSize: 14, color: '#475569', flex: 1, fontWeight: '500' },
    quantite: { fontWeight: '800', color: '#1e293b' },
    optionTexte: { fontSize: 11, color: '#64748b', marginLeft: 16, marginTop: -4, marginBottom: 4, fontWeight: '500' },
    pied: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9',
        paddingTop: 20
    },
    totalLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1 },
    totalRow: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
    total: { fontSize: 22, fontWeight: '900', color: couleurs.primaire.defaut },
    devise: { fontSize: 12, fontWeight: '800', color: couleurs.primaire.defaut },
    actions: { flexDirection: 'row', gap: 12, alignItems: 'center' },
    contactBtn: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(46, 204, 113, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    actionBtn: { width: 44, height: 44, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
    vide: { alignItems: 'center', justifyContent: 'center', padding: 100, gap: 16 },
    videTexte: { fontSize: 15, color: '#94a3b8', fontWeight: '600', textAlign: 'center' },
});
