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
            {/* Bannière Alerte (Style iOS 26) */}
            {alertes.length > 0 && (
                <View style={styles.alerteSection}>
                    <LinearGradient
                        colors={['#fee2e2', '#fecaca']}
                        style={styles.alerteBanniere}
                    >
                        <View style={styles.alerteEntete}>
                            <Ionicons name="warning" size={24} color="#dc2626" />
                            <Text style={styles.alerteTitre}>Stock Critique ({alertes.length})</Text>
                        </View>
                        <View style={styles.alerteListe}>
                            {alertes.slice(0, 3).map((a: any) => (
                                <Text key={a.id} style={styles.alerteTexte}>
                                    📦 {a.nom} : <Text style={{ fontWeight: '800' }}>{a.quantite}</Text> {a.unite}
                                </Text>
                            ))}
                        </View>
                    </LinearGradient>
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
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    padding: { padding: 16 },
    alerteSection: { padding: 16, paddingBottom: 0 },
    alerteBanniere: {
        borderRadius: 24,
        padding: 20,
        gap: 12,
    },
    alerteEntete: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    alerteTitre: { fontSize: 16, fontWeight: '800', color: '#991b1b' },
    alerteListe: { gap: 6 },
    alerteTexte: { fontSize: 13, color: '#b91c1c', fontWeight: '500' },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 8
    },
    sectionTitre: { fontSize: 18, fontWeight: '800', color: '#0f172a' },
    statsText: { fontSize: 13, color: '#64748b', fontWeight: '600' },
    carteGlass: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.03, shadowRadius: 8 },
            android: { elevation: 2 },
        }),
    },
    carteOuverte: {
        borderColor: couleurs.secondaire.defaut,
        borderWidth: 1.5,
    },
    carteContenu: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    iconeBox: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: '#f8fafc',
        justifyContent: 'center', alignItems: 'center',
    },
    nom: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    unite: { fontSize: 12, color: '#94a3b8', marginTop: 2, fontWeight: '500' },
    quantiteBox: { alignItems: 'flex-end', gap: 4 },
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
