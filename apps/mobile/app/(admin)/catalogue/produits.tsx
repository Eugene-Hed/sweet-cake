// =============================================================================
// Sweet-Cake Mobile — Gestion des Produits Admin (iOS 26 Style)
// =============================================================================

import React, { useCallback, useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity,
    Alert, Platform, TextInput, Dimensions, Image
} from 'react-native';

import api, { obtenirImageUri } from '../../../src/services/api';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import Chargement from '../../../src/composants/Chargement';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProduitsAdmin() {
    const [produits, setProduits] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);
    const [recherche, setRecherche] = useState('');

    const charger = async () => {
        try {
            const { data } = await api.get('/produits?limite=100');
            setProduits(data.donnees || []);
        } catch (err) {
            console.error('Erreur produits admin:', err);
        } finally {
            setChargement(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            charger();
        }, [])
    );

    const supprimerProduit = (id: number, nom: string) => {
        Alert.alert('Supprimer', `Voulez-vous vraiment supprimer "${nom}" ?`, [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/produits/${id}`);
                        charger();
                    } catch (err) {
                        Alert.alert('Erreur', 'Impossible de supprimer');
                    }
                },
            },
        ]);
    };

    const produitsFiltrés = produits.filter(p =>
        p.nom.toLowerCase().includes(recherche.toLowerCase()) ||
        p.categorie?.nom?.toLowerCase().includes(recherche.toLowerCase())
    );

    if (chargement) return <Chargement />;

    return (
        <View style={styles.conteneur}>
            {/* Header / Recherche */}
            <View style={styles.header}>
                <View style={styles.rechercheBox}>
                    <Ionicons name="search" size={20} color="#94a3b8" />
                    <TextInput
                        style={styles.rechercheInput}
                        placeholder="Rechercher..."
                        value={recherche}
                        onChangeText={setRecherche}
                        placeholderTextColor="#94a3b8"
                    />
                </View>
                <TouchableOpacity
                    style={styles.btnAjouter}
                    onPress={() => router.push({ pathname: '/(admin)/catalogue/produit-form', params: { id: 'nouveau' } })}
                >
                    <LinearGradient colors={['#b59a5d', '#8e7943']} style={styles.btnAjouterGradient}>
                        <Ionicons name="add" size={24} color="#fff" />
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.liste}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 150 }}
            >
                {produitsFiltrés.length > 0 ? (
                    produitsFiltrés.map((p) => (
                        <View key={p.id} style={styles.carteGlass}>
                            <View style={styles.carteContenu}>
                                <View style={styles.imageMiniature}>
                                    {p.image_url ? (
                                        <Image
                                            source={{ uri: obtenirImageUri(p.image_url) || undefined }}
                                            style={styles.image}
                                            resizeMode="cover"
                                        />
                                    ) : (
                                        <View style={styles.imageVide}>
                                            <Ionicons name="image-outline" size={24} color="#94a3b8" />
                                        </View>
                                    )}
                                </View>

                                <View style={styles.infoCol}>
                                    <Text style={styles.catNom}>{p.categorie?.nom || 'GÉNÉRAL'}</Text>
                                    <Text style={styles.prodNom} numberOfLines={1}>{p.nom}</Text>
                                    <Text style={styles.prodPrix}>{Number(p.prix).toLocaleString()} FCFA</Text>
                                </View>

                                <View style={styles.actionsCol}>
                                    <TouchableOpacity
                                        style={styles.iconBtn}
                                        onPress={() => router.push({ pathname: '/(admin)/catalogue/produit-form', params: { id: p.id } })}
                                    >
                                        <Ionicons name="pencil" size={18} color={couleurs.primaire.defaut} />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.iconBtn, styles.deleteBtn]}
                                        onPress={() => supprimerProduit(p.id, p.nom)}
                                    >
                                        <Ionicons name="trash" size={18} color="#ef4444" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.vide}>
                        <Ionicons name="fast-food-outline" size={64} color="#e2e8f0" />
                        <Text style={styles.videTexte}>Aucun produit trouvé</Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    header: {
        flexDirection: 'row',
        padding: 16,
        backgroundColor: '#fff',
        alignItems: 'center',
        gap: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    rechercheBox: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f1f5f9',
        borderRadius: 14,
        paddingHorizontal: 12,
        height: 48,
    },
    rechercheInput: {
        flex: 1,
        height: '100%',
        marginLeft: 8,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600'
    },
    btnAjouter: {
        width: 48,
        height: 48,
        borderRadius: 14,
        overflow: 'hidden',
    },
    btnAjouterGradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    liste: { padding: 16 },
    carteGlass: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 18,
        marginBottom: 14,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 },
            android: { elevation: 2 },
        }),
    },
    carteContenu: { flexDirection: 'row', alignItems: 'center', gap: 14 },
    imageMiniature: {
        width: 64,
        height: 64,
        borderRadius: 16,
        backgroundColor: '#f8fafc',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#f1f5f9',
    },
    image: { flex: 1 },
    imageVide: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    infoCol: { flex: 1 },
    catNom: { fontSize: 10, fontWeight: '800', color: couleurs.primaire.defaut, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 },
    prodNom: { fontSize: 17, fontWeight: '700', color: '#0f172a' },
    prodPrix: { fontSize: 15, fontWeight: '800', color: '#64748b', marginTop: 4 },
    actionsCol: { flexDirection: 'row', gap: 10 },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    deleteBtn: { backgroundColor: '#fff1f2', borderColor: '#ffe4e6' },
    vide: { alignItems: 'center', justifyContent: 'center', padding: 80, gap: 16 },
    videTexte: { fontSize: 15, color: '#94a3b8', fontWeight: '600' },
});
