// =============================================================================
// Sweet-Cake Mobile — Écran Catalogue Client
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TextInput, TouchableOpacity, RefreshControl } from 'react-native';
import { router } from 'expo-router';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import { CarteProduit } from '../../src/composants/Carte';
import Chargement from '../../src/composants/Chargement';

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
        <ScrollView style={styles.conteneur}>
            {/* Barre de recherche */}
            <View style={styles.barreRecherche}>
                <TextInput
                    style={styles.inputRecherche}
                    placeholder="🔍 Rechercher un produit..."
                    value={recherche}
                    onChangeText={setRecherche}
                    placeholderTextColor={couleurs.gris[400]}
                />
            </View>

            {/* Chips catégories */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsConteneur}>
                <TouchableOpacity
                    style={[styles.chip, !categorieActive && styles.chipActive]}
                    onPress={() => setCategorieActive(null)}
                >
                    <Text style={[styles.chipTexte, !categorieActive && styles.chipTexteActive]}>Tout</Text>
                </TouchableOpacity>
                {categories.map((cat) => (
                    <TouchableOpacity
                        key={cat.id}
                        style={[styles.chip, categorieActive === cat.id && styles.chipActive]}
                        onPress={() => setCategorieActive(categorieActive === cat.id ? null : cat.id)}
                    >
                        <Text style={[styles.chipTexte, categorieActive === cat.id && styles.chipTexteActive]}>
                            {cat.nom}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Grille produits */}
            <View style={styles.grille}>
                {produits.length > 0 ? (
                    produits.map((p) => (
                        <CarteProduit
                            key={p.id}
                            nom={p.nom}
                            prix={Number(p.prix)}
                            image_url={p.image_url}
                            categorie={p.categorie?.nom}
                            onPress={() => router.push(`/(client)/catalogue/${p.id}`)}
                        />
                    ))
                ) : (
                    <View style={styles.vide}>
                        <Text style={styles.videTexte}>Aucun produit trouvé</Text>
                    </View>
                )}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    barreRecherche: { padding: espacements.md, paddingBottom: 0 },
    inputRecherche: {
        backgroundColor: couleurs.blanc,
        borderRadius: rayons.lg,
        padding: espacements.md_sm,
        fontSize: typographie.texte_corps.taille,
        borderWidth: 1,
        borderColor: couleurs.gris[200],
        color: couleurs.gris[900],
    },
    chipsConteneur: { paddingHorizontal: espacements.md, paddingVertical: espacements.md },
    chip: {
        paddingHorizontal: espacements.md,
        paddingVertical: espacements.sm,
        borderRadius: rayons.complet,
        backgroundColor: couleurs.blanc,
        borderWidth: 1,
        borderColor: couleurs.gris[200],
        marginRight: espacements.sm,
    },
    chipActive: { backgroundColor: couleurs.primaire.defaut, borderColor: couleurs.primaire.defaut },
    chipTexte: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], fontWeight: '500' },
    chipTexteActive: { color: couleurs.blanc },
    grille: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', paddingHorizontal: espacements.md, paddingBottom: 40 },
    vide: { width: '100%', padding: espacements['3xl'], alignItems: 'center' },
    videTexte: { fontSize: typographie.texte_corps.taille, color: couleurs.gris[400] },
});
