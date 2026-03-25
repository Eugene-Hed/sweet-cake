// =============================================================================
// Sweet-Cake Mobile — Écran Accueil Client
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, FlatList, RefreshControl } from 'react-native';
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
            refreshControl={
                <RefreshControl
                    refreshing={rafraichissant}
                    onRefresh={() => { setRafraichissant(true); chargerDonnees(); }}
                    tintColor={couleurs.primaire.defaut}
                />
            }
        >
            {/* Hero */}
            <View style={styles.hero}>
                <Text style={styles.heroSalut}>
                    Bonjour {utilisateur?.nom_complet?.split(' ')[0] || 'Gourmand'} 👋
                </Text>
                <Text style={styles.heroTexte}>
                    Découvrez nos pâtisseries artisanales
                </Text>
            </View>

            {/* Produits vedettes */}
            <View style={styles.section}>
                <EnteteSection
                    titre="Nos pâtisseries"
                    actionTexte="Voir tout"
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
                    actionTexte="Voir tout"
                    onAction={() => router.push('/(client)/ateliers')}
                />
                {ateliers.map((a) => (
                    <View key={a.id} style={styles.carteAtelier}>
                        <Text style={styles.atelierTitre}>{a.titre}</Text>
                        <Text style={styles.atelierDate}>
                            📅 {new Date(a.date_debut).toLocaleDateString('fr-FR')}
                        </Text>
                        <View style={styles.atelierInfoLigne}>
                            <Text style={styles.atelierCapacite}>
                                👥 {a.places_reservees || 0}/{a.capacite_max} places
                            </Text>
                            <Text style={styles.atelierPrix}>{Number(a.prix).toFixed(2)} €</Text>
                        </View>
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
        backgroundColor: couleurs.primaire.defaut,
        padding: espacements.lg,
        paddingTop: espacements['3xl'],
        paddingBottom: espacements['2xl'],
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    heroSalut: { fontSize: typographie.titre_secondaire.taille, fontWeight: '700', color: couleurs.blanc },
    heroTexte: { fontSize: typographie.texte_corps.taille, color: 'rgba(255,255,255,0.85)', marginTop: 4 },
    section: { paddingHorizontal: espacements.md },
    grilleProduits: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
    carteAtelier: {
        backgroundColor: couleurs.blanc,
        borderRadius: 12,
        padding: espacements.md,
        marginBottom: espacements.md,
        borderWidth: 1,
        borderColor: couleurs.gris[200],
    },
    atelierTitre: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900] },
    atelierDate: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], marginTop: 4 },
    atelierInfoLigne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
    atelierCapacite: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[500] },
    atelierPrix: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.primaire.defaut },
});
