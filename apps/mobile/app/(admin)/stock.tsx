// =============================================================================
// Sweet-Cake Mobile — Gestion Stock Admin (iOS 26 Style)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity,
    Alert, TextInput, RefreshControl, Platform
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import Badge from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';

export default function StockAdmin() {
    const [articles, setArticles] = useState<any[]>([]);
    const [alertes, setAlertes] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);
    const [mouvementOuvert, setMouvementOuvert] = useState<number | null>(null);
    const [quantiteMouvement, setQuantiteMouvement] = useState('');

    const charger = async () => {
        try {
            const [resArticles, resAlertes] = await Promise.all([
                api.get('/articles-stock'),
                api.get('/alertes-stock').catch(() => ({ data: { donnees: [] } })),
            ]);
            setArticles(resArticles.data.donnees || []);
            setAlertes(resAlertes.data.donnees || []);
        } catch (err) {
            console.error('Erreur stock admin:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    const ajouterMouvement = async (articleId: number, type: string) => {
        const qte = parseFloat(quantiteMouvement);
        if (!qte || qte <= 0) {
            Alert.alert('Erreur', 'Entrez une quantité valide');
            return;
        }
        try {
            await api.post(`/articles-stock/${articleId}/mouvements`, {
                type_mouvement: type,
                quantite: qte,
                raison: `Mouvement ${type} depuis l'app mobile`,
            });
            Alert.alert('✅ Terminé', `${type === 'entree' ? 'Entrée' : 'Sortie'} de ${qte} enregistrée`);
            setMouvementOuvert(null);
            setQuantiteMouvement('');
            charger();
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Action impossible');
        }
    };

    if (chargement) return <Chargement />;

    return (
        <View style={styles.conteneur}>
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.header}
            >
                <Text style={styles.headerTitre}>GESTION DES STOCKS</Text>
                <View style={styles.headerStats}>
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatValeur}>{alertes.length}</Text>
                        <Text style={styles.headerStatLabel}>Critiques</Text>
                    </View>
                    <View style={styles.headerStatDivider} />
                    <View style={styles.headerStatItem}>
                        <Text style={styles.headerStatValeur}>{articles.length}</Text>
                        <Text style={styles.headerStatLabel}>Articles</Text>
                    </View>
                </View>
            </LinearGradient>

            <ScrollView
                style={styles.scroll}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
                refreshControl={
                    <RefreshControl
                        refreshing={false}
                        onRefresh={charger}
                        tintColor="#e9c46a"
                    />
                }
            >
                {/* Bannière Alerte Premium */}
                {alertes.length > 0 && (
                    <View style={styles.alerteSection}>
                        <View style={styles.alertePremium}>
                            <View style={styles.alerteEntete}>
                                <View style={styles.warningIconBox}>
                                    <Ionicons name="warning" size={20} color="#fff" />
                                </View>
                                <Text style={styles.alerteTitre}>Réapprovisionnement requis</Text>
                            </View>
                            <View style={styles.alerteListe}>
                                {alertes.slice(0, 3).map((a: any) => (
                                    <View key={a.id} style={styles.alerteItem}>
                                        <View style={styles.alerteDot} />
                                        <Text style={styles.alerteTexte}>
                                            {a.nom} (<Text style={{ fontWeight: '800' }}>{Number(a.quantite)}</Text>)
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>
                )}

            <View style={styles.padding}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitre}>Inventaire des Articles</Text>
                    <Text style={styles.statsText}>{articles.length} articles</Text>
                </View>

                {articles.map((article) => {
                    const estFaible = Number(article.quantite) <= Number(article.seuil_minimal || 0);
                    const estOuvert = mouvementOuvert === article.id;

                    return (
                        <View key={article.id} style={[styles.carteGlass, estOuvert && styles.carteOuverte]}>
                            <TouchableOpacity
                                onPress={() => {
                                    setMouvementOuvert(estOuvert ? null : article.id);
                                    setQuantiteMouvement('');
                                }}
                                activeOpacity={0.7}
                            >
                                <View style={styles.carteContenu}>
                                    <View style={styles.iconeBox}>
                                        <Ionicons
                                            name={estFaible ? "alert-circle" : "cube"}
                                            size={22}
                                            color={estFaible ? "#ef4444" : "#64748b"}
                                        />
                                    </View>

                                    <View style={{ flex: 1 }}>
                                        <Text style={styles.nom}>{article.nom}</Text>
                                        <Text style={styles.unite}>{article.unite || 'unité'}</Text>
                                    </View>

                                    <View style={styles.quantiteBox}>
                                        <Text style={[styles.quantiteValeur, estFaible && { color: '#ef4444' }]}>
                                            {Number(article.quantite).toString()}
                                        </Text>
                                        <TouchableOpacity
                                            onPress={() => router.push(`/(admin)/stock-form?id=${article.id}`)}
                                            style={{ marginRight: 10 }}
                                        >
                                            <Ionicons name="pencil" size={16} color={couleurs.secondaire.defaut} />
                                        </TouchableOpacity>
                                        <Ionicons
                                            name={estOuvert ? "chevron-up" : "chevron-down"}
                                            size={16}
                                            color="#94a3b8"
                                        />
                                    </View>
                                </View>
                            </TouchableOpacity>

                            {/* Panel Actions Rapides */}
                            {estOuvert && (
                                <View style={styles.mouvementPanel}>
                                    <View style={styles.inputZone}>
                                        <TextInput
                                            style={styles.input}
                                            placeholder="Quantité..."
                                            value={quantiteMouvement}
                                            onChangeText={setQuantiteMouvement}
                                            keyboardType="numeric"
                                            placeholderTextColor="#94a3b8"
                                        />
                                        <Text style={styles.inputUnitLabel}>{article.unite}</Text>
                                    </View>

                                    <View style={styles.boutonLigne}>
                                        <TouchableOpacity
                                            style={styles.btnAction}
                                            onPress={() => ajouterMouvement(article.id, 'entree')}
                                        >
                                            <LinearGradient colors={['#27ae60', '#2ecc71']} style={styles.btnGradient}>
                                                <Ionicons name="add" size={20} color="#fff" />
                                                <Text style={styles.btnTexte}>Entrée</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={styles.btnAction}
                                            onPress={() => ajouterMouvement(article.id, 'sortie')}
                                        >
                                            <LinearGradient colors={['#ef4444', '#dc2626']} style={styles.btnGradient}>
                                                <Ionicons name="remove" size={20} color="#fff" />
                                                <Text style={styles.btnTexte}>Sortie</Text>
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        </View>
                    );
                })}
            </View>

            {/* Bouton Flottant Ajout Article */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => router.push('/(admin)/stock-form')}
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
    headerStatItem: { gap: 2 },
    headerStatValeur: { fontSize: 24, fontWeight: '900', color: '#fff' },
    headerStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.5)', fontWeight: '600' },
    headerStatDivider: { width: 1, height: 24, backgroundColor: 'rgba(255,255,255,0.1)' },
    scroll: { flex: 1 },
    padding: { padding: 16 },
    alerteSection: { paddingHorizontal: 16, marginTop: 16 },
    alertePremium: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        borderLeftWidth: 6,
        borderLeftColor: '#ef4444',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10 },
            android: { elevation: 2 },
        }),
    },
    alerteEntete: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 12 },
    warningIconBox: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: '#ef4444',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alerteTitre: { fontSize: 15, fontWeight: '700', color: '#0f172a' },
    alerteListe: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    alerteItem: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#fef2f2', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
    alerteDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: '#ef4444' },
    alerteTexte: { fontSize: 12, color: '#ef4444', fontWeight: '600' },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8
    },
    sectionTitre: { fontSize: 17, fontWeight: '800', color: '#0f172a' },
    statsText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
    carteGlass: {
        backgroundColor: '#fff',
        borderRadius: 28,
        padding: 20,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.03, shadowRadius: 10 },
            android: { elevation: 2 },
        }),
    },
    carteOuverte: {
        borderColor: '#e9c46a',
        borderWidth: 1.5,
        backgroundColor: '#fff',
    },
    carteContenu: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    iconeBox: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: '#f8fafc',
        justifyContent: 'center', alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    nom: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    unite: { fontSize: 12, color: '#94a3b8', marginTop: 2, fontWeight: '500' },
    quantiteBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    quantiteValeur: { fontSize: 22, fontWeight: '900', color: '#0f172a' },
    mouvementPanel: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: '#f1f5f9'
    },
    inputZone: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f8fafc',
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 50,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 16,
    },
    input: { flex: 1, fontSize: 16, fontWeight: '700', color: '#0f172a' },
    inputUnitLabel: { fontSize: 14, color: '#64748b', fontWeight: '600', marginLeft: 8 },
    boutonLigne: { flexDirection: 'row', gap: 12 },
    btnAction: { flex: 1 },
    btnGradient: {
        height: 50,
        borderRadius: 14,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    btnTexte: { color: '#fff', fontSize: 15, fontWeight: '800' },
    fab: {
        position: 'absolute',
        bottom: 100,
        right: 24,
        width: 60,
        height: 60,
        borderRadius: 30,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.2, shadowRadius: 10 },
            android: { elevation: 6 },
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
