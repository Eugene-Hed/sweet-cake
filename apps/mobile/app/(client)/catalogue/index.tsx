// =============================================================================
// Sweet-Cake Mobile — Écran Catalogue Client (Design Premium)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, RefreshControl, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api, { obtenirImageUri } from '../../../src/services/api';
import { CarteProduit } from '../../../src/composants/Carte';
import Chargement from '../../../src/composants/Chargement';
import EnteteSection from '../../../src/composants/EnteteSection';

export default function Catalogue() {
    const [produits, setProduits] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [categorieActive, setCategorieActive] = useState<number | null>(null);
    const [recherche, setRecherche] = useState('');
    const [chargement, setChargement] = useState(true);

    const chargerDonnees = async () => {
        try {
            const [resCat, resProd] = await Promise.all([
                api.get('/categories'),
                api.get('/produits', {
                    params: {
                        limite: 50,
                        ...(categorieActive ? { categorie_id: categorieActive } : {}),
                        ...(recherche ? { recherche } : {}),
                    },
                }),
            ]);
            setCategories(resCat.data.donnees || []);
            setProduits(resProd.data.donnees || []);
        } catch (err) {
            console.error('Erreur catalogue:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { chargerDonnees(); }, [categorieActive, recherche]);

    if (chargement && produits.length === 0) return <Chargement />;

    return (
        <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>
            {/* Barre de recherche premium */}
            <View style={styles.barreRecherche}>
                <View style={styles.inputConteneur}>
                    <Ionicons name="search-outline" size={20} color={couleurs.gris[400]} />
                    <TextInput
                        style={styles.inputRecherche}
                        placeholder="Rechercher un produit..."
                        value={recherche}
                        onChangeText={setRecherche}
                        placeholderTextColor={couleurs.gris[400]}
                    />
                    {recherche.length > 0 && (
                        <TouchableOpacity onPress={() => setRecherche('')}>
                            <Ionicons name="close-circle" size={20} color={couleurs.gris[400]} />
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Chips catégories premium */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.chipsConteneur}
            >
                <TouchableOpacity
                    style={[styles.chip, !categorieActive && styles.chipActive]}
                    onPress={() => setCategorieActive(null)}
                    activeOpacity={0.7}
                >
                    <Ionicons
                        name="apps"
                        size={16}
                        color={!categorieActive ? couleurs.blanc : couleurs.gris[600]}
                    />
                    <Text style={[styles.chipTexte, !categorieActive && styles.chipTexteActive]}>Tout</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.chip, categorieActive === cat.id && styles.chipActive]}
                        onPress={() => setCategorieActive(categorieActive === cat.id ? null : cat.id)}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.chipTexte, categorieActive === cat.id && styles.chipTexteActive]}>
                            {cat.nom}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Compteur de résultats */}
            <View style={styles.compteur}>
                <Text style={styles.compteurTexte}>
                    {produits.length} produit{produits.length > 1 ? 's' : ''}
                    {categorieActive ? ` • ${categories.find(c => c.id === categorieActive)?.nom || ''}` : ''}
                </Text>
            </View>

            {/* Grille produits */}
            <View style={styles.grille}>
                {produits.length > 0 ? (
                    produits.map((p) => (
                        <CarteProduit
                            key={p.id}
                            nom={p.nom}
                            prix={Number(p.prix)}
                            image_url={obtenirImageUri(p.image_url) || undefined}
                            categorie={p.categorie?.nom}
                            onPress={() => router.push(`/(client)/catalogue/${p.id}`)}
                        />
                    ))
                ) : (
                    <View style={styles.vide}>
                        <Ionicons name="search" size={48} color={couleurs.gris[300]} />
                        <Text style={styles.videTitre}>Aucun produit trouvé</Text>
                        <Text style={styles.videTexte}>Essayez un autre filtre ou recherche</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    barreRecherche: {
        padding: 16,
        paddingBottom: 0,
    },
    inputConteneur: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: couleurs.blanc,
        borderRadius: 14,
        paddingHorizontal: 14,
        height: 48,
        gap: 10,
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
    inputRecherche: {
        flex: 1,
        fontSize: 15,
        color: couleurs.gris[900],
    },
    chipsConteneur: {
        paddingHorizontal: 16,
        paddingVertical: 14,
        gap: 8,
    },
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 50,
        backgroundColor: couleurs.blanc,
        gap: 6,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.04,
                shadowRadius: 4,
            },
            android: { elevation: 1 },
        }),
    },
    chipActive: {
        backgroundColor: couleurs.primaire.defaut,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.primaire.defaut,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.3,
                shadowRadius: 6,
            },
            android: { elevation: 4 },
        }),
    },
    chipTexte: { fontSize: 13, color: couleurs.gris[600], fontWeight: '600' },
    chipTexteActive: { color: couleurs.blanc },
    compteur: {
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    compteurTexte: {
        fontSize: 13,
        color: couleurs.gris[500],
        fontWeight: '500',
    },
    grille: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 40,
    },
    vide: {
        width: '100%',
        paddingVertical: 60,
        alignItems: 'center',
    },
    videTitre: { fontSize: 17, fontWeight: '700', color: couleurs.gris[700], marginTop: 12 },
    videTexte: { fontSize: 14, color: couleurs.gris[400], marginTop: 4 },
});
