// =============================================================================
// Sweet-Cake Mobile — Dashboard Admin (iOS 26 Next Gen)
// =============================================================================

import React, { useEffect, useState, useRef } from 'react';
import {
    View, Text, ScrollView, StyleSheet, RefreshControl,
    Platform, TouchableOpacity, Animated, Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import { CarteStatistique } from '../../src/composants/Carte';
import Badge, { BADGE_STATUT_COMMANDE } from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';
import GraphiqueLigne from '../../src/composants/GraphiqueLigne';
import GraphiqueBarres from '../../src/composants/GraphiqueBarres';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Petit composant interne pour l'anneau de progression
const AnneauProgression = ({ pourcentage, couleur }: { pourcentage: number; couleur: string }) => (
    <View style={styles.anneauConteneur}>
        <View style={[styles.anneauFond, { borderColor: 'rgba(255,255,255,0.05)' }]} />
        <View style={[styles.anneauActif, { borderColor: couleur, transform: [{ rotate: '-90deg' }] }]} />
        <Text style={styles.anneauTexte}>{pourcentage}%</Text>
    </View>
);

export default function Dashboard() {
    const [resume, setResume] = useState<any>(null);
    const [chargement, setChargement] = useState(true);
    const [rafraichissant, setRafraichissant] = useState(false);

    // Animation d'entrée
    const fadeAnim = useRef(new Animated.Value(0)).current;

    const charger = async () => {
        try {
            const { data } = await api.get('/tableau-de-bord/resume');
            setResume(data.donnees);

            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 800,
                useNativeDriver: true,
            }).start();
        } catch (err) {
            console.error('Erreur dashboard:', err);
        } finally {
            setChargement(false);
            setRafraichissant(false);
        }
    };

    useEffect(() => { charger(); }, []);

    if (chargement) return <Chargement />;

    const aDesVentes = resume?.stats_hebdo?.length > 0;
    const aDesCategories = resume?.stats_categories?.length > 0;

    return (
        <ScrollView
            style={styles.conteneur}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
            refreshControl={
                <RefreshControl
                    refreshing={rafraichissant}
                    onRefresh={() => { setRafraichissant(true); charger(); }}
                    tintColor={couleurs.secondaire.defaut}
                />
            }
        >
            {/* Header Futuriste (Glassmorphism) */}
            <LinearGradient
                colors={['#0f172a', '#1e293b']}
                style={styles.header}
            >
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerSalut}>TABLEAU DE BORD</Text>
                        <Text style={styles.headerNom}>Sweet-Cake Admin</Text>
                    </View>
                    <TouchableOpacity style={styles.profilBouton}>
                        <LinearGradient
                            colors={['#e9c46a', '#f4a261']}
                            style={styles.avatar}
                        >
                            <Ionicons name="person" size={20} color="#fff" />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                {/* Main Metric Card with Progress */}
                <Animated.View style={[styles.mainMetric, { opacity: fadeAnim }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.metricLabel}>Chiffre d'affaires mensuel</Text>
                        <Text style={styles.metricValeur}>
                            {resume?.revenus_estimes > 0
                                ? Number(resume.revenus_estimes).toLocaleString()
                                : '0'} FCFA
                        </Text>
                        <View style={styles.metricFooter}>
                            <View style={styles.trendBadge}>
                                <Ionicons name="trending-up" size={12} color="#2ecc71" />
                                <Text style={styles.trendTexte}>+12.5%</Text>
                            </View>
                            <Text style={styles.objectifLabel}>Objectif: 1M FCFA</Text>
                        </View>
                    </View>
                    <AnneauProgression 
                        pourcentage={Math.min(100, Math.round(((resume?.revenus_estimes || 0) / 1000000) * 100))} 
                        couleur="#e9c46a" 
                    />
                </Animated.View>

                {/* Graphique de tendance (Ligne) */}
                <View style={styles.chartContainer}>
                    <Text style={styles.chartTitre}>Évolution des Ventes (7j)</Text>
                    {aDesVentes ? (
                        <GraphiqueLigne
                            donnees={resume.stats_hebdo}
                            hauteur={100}
                            couleurLine="#e9c46a"
                        />
                    ) : (
                        <View style={styles.chartVide}>
                            <Text style={styles.chartVideTexte}>Aucune vente enregistrée cette semaine</Text>
                        </View>
                    )}
                </View>
            </LinearGradient>

            {/* Quick Stats Grid */}
            <View style={styles.statsGrille}>
                <CarteStatistique
                    titre="Commandes"
                    valeur={resume?.total_commandes || 0}
                    icone="📦"
                    couleurIcone="#e76f51"
                />
                <CarteStatistique
                    titre="Produits"
                    valeur={resume?.total_produits || 0}
                    icone="🍰"
                    couleurIcone={couleurs.primaire.defaut}
                />
                <CarteStatistique
                    titre="Ateliers"
                    valeur={resume?.total_ateliers || 0}
                    icone="👩‍🍳"
                    couleurIcone="#e9c46a"
                />
                <CarteStatistique
                    titre="Clients"
                    valeur={resume?.total_clients || 0}
                    icone="👥"
                    couleurIcone="#264653"
                />
            </View>

            {/* Section Graphique Barres - Répartition */}
            <View style={styles.glassSection}>
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitre}>Répartition par Catégorie</Text>
                    <Ionicons name="pie-chart-outline" size={20} color={couleurs.gris[400]} />
                </View>
                {aDesCategories ? (
                    <GraphiqueBarres donnees={resume.stats_categories} unite="Produits" />
                ) : (
                    <Text style={styles.videTexte}>Créez des catégories pour voir la répartition</Text>
                )}
            </View>

            {/* Alertes Stock (si besoin) */}
            {(resume?.alertes_stock_faible || 0) > 0 && (
                <TouchableOpacity style={styles.alerteCard}>
                    <LinearGradient
                        colors={['#fee2e2', '#fecaca']}
                        style={styles.alerteGradient}
                    >
                        <Ionicons name="warning" size={24} color="#dc2626" />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.alerteTitre}>Alerte de Stock</Text>
                            <Text style={styles.alerteDescription}>
                                {resume.alertes_stock_faible} article(s) à réapprovisionner
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#dc2626" />
                    </LinearGradient>
                </TouchableOpacity>
            )}

            {/* Commandes Récentes */}
            <View style={styles.sectionRecente}>
                <View style={[styles.sectionHeader, { paddingHorizontal: 0 }]}>
                    <Text style={styles.sectionTitre}>Dernières Activités</Text>
                    <TouchableOpacity>
                        <Text style={styles.voirTout}>Tout voir</Text>
                    </TouchableOpacity>
                </View>

                {resume?.commandes_recentes?.length > 0 ? (
                    resume.commandes_recentes.slice(0, 4).map((c: any) => (
                        <TouchableOpacity 
                            key={c.id} 
                            style={styles.activiteItem}
                            onPress={() => router.push('/(admin)/commandes')}
                            activeOpacity={0.7}
                        >
                            <View style={styles.activiteIcone}>
                                <Ionicons name="cart" size={20} color={couleurs.primaire.defaut} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.activiteTitre}>{c.client?.nom_complet || 'Client MK'}</Text>
                                <Text style={styles.activiteHeure}>
                                    {new Date(c.created_at).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} • {new Date(c.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={styles.activiteMontant}>+{Number(c.montant_total || 0).toLocaleString()} F</Text>
                                <Ionicons name="chevron-forward" size={14} color={couleurs.gris[300]} />
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <View style={styles.videContainer}>
                        <Ionicons name="sparkles-outline" size={48} color={couleurs.gris[300]} />
                        <Text style={styles.videTexte}>En attente de vos premières ventes...</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        padding: 24,
        paddingTop: 60,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        gap: 24,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    headerSalut: {
        fontSize: 12,
        fontWeight: '800',
        color: '#e9c46a',
        letterSpacing: 2,
    },
    headerNom: {
        fontSize: 24,
        fontWeight: '800',
        color: '#fff',
        marginTop: 4,
    },
    profilBouton: {
        width: 48,
        height: 48,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    avatar: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainMetric: {
        backgroundColor: 'rgba(255,255,255,0.06)',
        borderRadius: 28,
        padding: 24,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    metricFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginTop: 10,
    },
    objectifLabel: {
        fontSize: 11,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
    },
    anneauConteneur: {
        width: 60,
        height: 60,
        justifyContent: 'center',
        alignItems: 'center',
    },
    anneauFond: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 6,
    },
    anneauActif: {
        position: 'absolute',
        width: 60,
        height: 60,
        borderRadius: 30,
        borderWidth: 6,
        borderTopColor: 'transparent',
        borderLeftColor: 'transparent',
    },
    anneauTexte: {
        fontSize: 12,
        fontWeight: '800',
        color: '#fff',
    },
    metricLabel: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '600',
    },
    metricValeur: {
        fontSize: 30,
        fontWeight: '900',
        color: '#fff',
        marginTop: 4,
    },
    trendBadge: {
        backgroundColor: 'rgba(46, 204, 113, 0.15)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    trendTexte: {
        color: '#2ecc71',
        fontSize: 12,
        fontWeight: '700',
    },
    chartContainer: {
        marginTop: 10,
    },
    chartTitre: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        fontWeight: '700',
        marginBottom: 10,
    },
    statsGrille: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        marginTop: -30,
    },
    glassSection: {
        backgroundColor: '#fff',
        marginHorizontal: 16,
        marginTop: 24,
        borderRadius: 24,
        padding: 20,
        ...Platform.select({
            ios: {
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 10,
            },
            android: { elevation: 3 },
        }),
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    sectionTitre: {
        fontSize: 18,
        fontWeight: '800',
        color: '#0f172a',
    },
    alerteCard: {
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: 20,
        overflow: 'hidden',
    },
    alerteGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        gap: 12,
    },
    alerteTitre: {
        fontSize: 15,
        fontWeight: '700',
        color: '#991b1b',
    },
    alerteDescription: {
        fontSize: 13,
        color: '#b91c1c',
        marginTop: 2,
    },
    sectionRecente: {
        paddingHorizontal: 16,
        marginTop: 24,
    },
    voirTout: {
        fontSize: 14,
        color: couleurs.secondaire.defaut,
        fontWeight: '700',
    },
    activiteItem: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginBottom: 12,
    },
    activiteIcone: {
        width: 44,
        height: 44,
        borderRadius: 14,
        backgroundColor: 'rgba(107, 73, 58, 0.08)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    activiteTitre: {
        fontSize: 15,
        fontWeight: '700',
        color: '#1e293b',
    },
    activiteHeure: {
        fontSize: 12,
        color: '#64748b',
        marginTop: 2,
    },
    activiteMontant: {
        fontSize: 16,
        fontWeight: '800',
        color: '#2ecc71',
    },
    videContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
        gap: 12,
    },
    videTexte: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '600',
        textAlign: 'center',
    },
    chartVide: {
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderStyle: 'dashed',
        borderColor: 'rgba(255,255,255,0.2)',
    },
    chartVideTexte: {
        color: 'rgba(255,255,255,0.4)',
        fontSize: 12,
        fontWeight: '600',
    }
});
