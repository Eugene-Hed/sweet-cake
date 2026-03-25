// =============================================================================
// Sweet-Cake Mobile — Écran Accueil Client (Design Premium)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { couleurs, espacements, typographie } from '@sweet-cake/shared';
import api from '../../src/services/api';
import { CarteProduit } from '../../src/composants/Carte';
import EnteteSection from '../../src/composants/EnteteSection';
import Chargement from '../../src/composants/Chargement';
import { useAuthStore } from '../../src/stores/auth.store';

export default function Accueil() {
    const utilisateur = useAuthStore((s) => s.utilisateur);
    const [produits, setProduits] = useState<any[]>([]);
    const [ateliers, setAteliers] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);
    const [rafraichissant, setRafraichissant] = useState(false);

    const chargerDonnees = async () => {
        try {
            const [resProduits, resAteliers] = await Promise.all([
                api.get('/produits?limite=6'),
                api.get('/ateliers?limite=3'),
            ]);
            setProduits(resProduits.data.donnees || []);
            setAteliers(resAteliers.data.donnees || []);
        } catch (err) {
            console.error('Erreur chargement accueil:', err);
        } finally {
            setChargement(false);
            setRafraichissant(false);
        }
    };

    useEffect(() => { chargerDonnees(); }, []);

    if (chargement) return <Chargement />;

    return (
        <ScrollView
            style={styles.conteneur}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={rafraichissant}
                    onRefresh={() => { setRafraichissant(true); chargerDonnees(); }}
                    tintColor={couleurs.primaire.defaut}
                />
            }
        >
            {/* Hero with gradient */}
            <LinearGradient
                colors={[couleurs.primaire.defaut, couleurs.primaire.fonce]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.hero}
            >
                <View style={styles.heroContenu}>
                    <View style={styles.heroTexteBloc}>
                        <Text style={styles.heroSalut}>
                            Bonjour {utilisateur?.nom_complet?.split(' ')[0] || 'Gourmand'} 👋
                        </Text>
                        <Text style={styles.heroTexte}>
                            Découvrez nos pâtisseries artisanales faites avec amour
                        </Text>
                    </View>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.heroLogo}
                        resizeMode="contain"
                    />
                </View>

                {/* Quick stats */}
                <View style={styles.statsBar}>
                    <View style={styles.statItem}>
                        <Ionicons name="cafe" size={18} color={couleurs.secondaire.defaut} />
                        <Text style={styles.statTexte}>{produits.length} produits</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="school" size={18} color={couleurs.secondaire.defaut} />
                        <Text style={styles.statTexte}>{ateliers.length} ateliers</Text>
                    </View>
                    <View style={styles.statDivider} />
                    <View style={styles.statItem}>
                        <Ionicons name="location" size={18} color={couleurs.secondaire.defaut} />
                        <Text style={styles.statTexte}>Mfou</Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Produits vedettes */}
            <View style={styles.section}>
                <EnteteSection
                    titre="Nos pâtisseries"
                    actionTexte="Voir tout →"
                    onAction={() => router.push('/(client)/catalogue')}
                />
                <View style={styles.grilleProduits}>
                    {produits.map((p) => (
                        <CarteProduit
                            key={p.id}
                            nom={p.nom}
                            prix={Number(p.prix)}
                            image_url={p.image_url}
                            categorie={p.categorie?.nom}
                            onPress={() => router.push(`/(client)/catalogue/${p.id}`)}
                        />
                    ))}
                </View>
            </View>

            {/* Ateliers à venir */}
            <View style={styles.section}>
                <EnteteSection
                    titre="Ateliers à venir"
                    actionTexte="Voir tout →"
                    onAction={() => router.push('/(client)/ateliers')}
                />
                {ateliers.map((a) => (
                    <View key={a.id} style={styles.carteAtelier}>
                        <LinearGradient
                            colors={[couleurs.secondaire.clair + '60', couleurs.secondaire.clair + '20']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.atelierGradient}
                        >
                            <View style={styles.atelierIcone}>
                                <Ionicons name="school" size={22} color={couleurs.secondaire.fonce} />
                            </View>
                        </LinearGradient>
                        <View style={styles.atelierContenu}>
                            <Text style={styles.atelierTitre}>{a.titre}</Text>
                            <View style={styles.atelierMeta}>
                                <View style={styles.atelierMetaItem}>
                                    <Ionicons name="calendar-outline" size={14} color={couleurs.gris[500]} />
                                    <Text style={styles.atelierMetaTexte}>
                                        {new Date(a.date_atelier).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                                    </Text>
                                </View>
                                <View style={styles.atelierMetaItem}>
                                    <Ionicons name="people-outline" size={14} color={couleurs.gris[500]} />
                                    <Text style={styles.atelierMetaTexte}>
                                        {a.places_reservees || 0}/{a.capacite} places
                                    </Text>
                                </View>
                            </View>
                        </View>
                        <Text style={styles.atelierPrix}>{Number(a.prix).toLocaleString()} FCFA</Text>
                    </View>
                ))}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    hero: {
        paddingTop: 20,
        paddingBottom: 20,
        paddingHorizontal: 20,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
    },
    heroContenu: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    heroTexteBloc: {
        flex: 1,
        marginRight: 12,
    },
    heroSalut: {
        fontSize: 22,
        fontWeight: '800',
        color: couleurs.blanc,
        marginBottom: 4,
    },
    heroTexte: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.8)',
        lineHeight: 20,
    },
    heroLogo: {
        width: 70,
        height: 56,
        opacity: 0.9,
    },
    statsBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: 16,
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: 14,
        paddingVertical: 10,
    },
    statItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    statTexte: {
        color: couleurs.blanc,
        fontSize: 12,
        fontWeight: '600',
    },
    statDivider: {
        width: 1,
        height: 18,
        backgroundColor: 'rgba(255,255,255,0.3)',
    },
    section: {
        paddingHorizontal: 16,
    },
    grilleProduits: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    carteAtelier: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: couleurs.blanc,
        borderRadius: 16,
        marginBottom: 12,
        overflow: 'hidden',
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    atelierGradient: {
        width: 64,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 80,
    },
    atelierIcone: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: couleurs.blanc,
        justifyContent: 'center',
        alignItems: 'center',
    },
    atelierContenu: {
        flex: 1,
        padding: 12,
    },
    atelierTitre: {
        fontSize: 15,
        fontWeight: '700',
        color: couleurs.gris[900],
        marginBottom: 6,
    },
    atelierMeta: {
        flexDirection: 'row',
        gap: 14,
    },
    atelierMetaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    atelierMetaTexte: {
        fontSize: 12,
        color: couleurs.gris[500],
        fontWeight: '500',
    },
    atelierPrix: {
        fontSize: 14,
        fontWeight: '800',
        color: couleurs.primaire.defaut,
        paddingRight: 14,
    },
});
