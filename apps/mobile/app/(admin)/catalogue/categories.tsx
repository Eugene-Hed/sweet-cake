// =============================================================================
// Sweet-Cake Mobile — Gestion des Catégories Admin (iOS 26 Style)
// =============================================================================

import React, { useCallback, useState } from 'react';
import {
    View, Text, ScrollView, StyleSheet, TouchableOpacity,
    Alert, Platform
} from 'react-native';
import { useFocusEffect, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../../src/services/api';
import Chargement from '../../../src/composants/Chargement';

export default function CategoriesAdmin() {
    const [categories, setCategories] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);

    const charger = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data.donnees || []);
        } catch (err) {
            console.error('Erreur categories admin:', err);
        } finally {
            setChargement(false);
        }
    };

    useFocusEffect(
        useCallback(() => {
            charger();
        }, [])
    );

    const supprimerCategorie = (id: number, nom: string) => {
        Alert.alert('Supprimer', `Voulez-vous vraiment supprimer "${nom}" ?`, [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Supprimer', style: 'destructive',
                onPress: async () => {
                    try {
                        await api.delete(`/categories/${id}`);
                        charger();
                    } catch (err) {
                        Alert.alert('Erreur', 'Impossible de supprimer cette catégorie (liée à des produits)');
                    }
                },
            },
        ]);
    };

    if (chargement) return <Chargement />;

    return (
        <View style={styles.conteneur}>
            <View style={styles.header}>
                <View>
                    <Text style={styles.titre}>Catégories</Text>
                    <Text style={styles.sousTitre}>{categories.length} au total</Text>
                </View>
                <TouchableOpacity
                    style={styles.btnAjouter}
                    onPress={() => router.push({ pathname: '/(admin)/catalogue/categorie-form', params: { id: 'nouveau' } })}
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
                {categories.length > 0 ? (
                    categories.map((c) => (
                        <View key={c.id} style={styles.carteGlass}>
                            <View style={styles.iconeRond}>
                                <Ionicons name="bookmark" size={20} color={couleurs.primaire.defaut} />
                            </View>
                            <View style={styles.info}>
                                <Text style={styles.nom}>{c.nom}</Text>
                            </View>
                            <View style={styles.actions}>
                                <TouchableOpacity
                                    style={styles.iconBtn}
                                    onPress={() => router.push({ pathname: '/(admin)/catalogue/categorie-form', params: { id: c.id } })}
                                >
                                    <Ionicons name="pencil" size={18} color="#64748b" />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.iconBtn, styles.deleteBtn]}
                                    onPress={() => supprimerCategorie(c.id, c.nom)}
                                >
                                    <Ionicons name="trash" size={18} color="#ef4444" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                ) : (
                    <View style={styles.vide}>
                        <Ionicons name="list-outline" size={64} color="#e2e8f0" />
                        <Text style={styles.videTexte}>Aucune catégorie</Text>
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
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 24,
        paddingBottom: 20,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9'
    },
    titre: { fontSize: 24, fontWeight: '900', color: '#0f172a' },
    sousTitre: { fontSize: 13, color: '#64748b', fontWeight: '600', marginTop: 2 },
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
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.03, shadowRadius: 10 },
            android: { elevation: 2 },
        }),
    },
    iconeRond: {
        width: 44, height: 44, borderRadius: 14,
        backgroundColor: '#f8fafc',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 14,
    },
    info: { flex: 1 },
    nom: { fontSize: 16, fontWeight: '700', color: '#1e293b' },
    actions: { flexDirection: 'row', gap: 10 },
    iconBtn: {
        width: 38,
        height: 38,
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
