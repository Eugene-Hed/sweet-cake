// =============================================================================
// Sweet-Cake Mobile — Formulaire Catégorie Admin (iOS 26 Style)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Platform, Dimensions, KeyboardAvoidingView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../../src/services/api';
import ChampSaisie from '../../../src/composants/ChampSaisie';
import Chargement from '../../../src/composants/Chargement';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function CategorieForm() {
    const { id } = useLocalSearchParams();
    const estEdition = id && id !== 'nouveau';

    const [nom, setNom] = useState('');
    const [chargement, setChargement] = useState(true);
    const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);

    useEffect(() => {
        const chargerDonnees = async () => {
            if (!estEdition) {
                setChargement(false);
                return;
            }
            try {
                const res = await api.get(`/categories/${id}`);
                setNom(res.data.donnees.nom);
            } catch (err) {
                console.error('Erreur chargement:', err);
                Alert.alert('Erreur', 'Données indisponibles');
                router.back();
            } finally {
                setChargement(false);
            }
        };
        chargerDonnees();
    }, [id]);

    const enregistrer = async () => {
        if (!nom.trim()) {
            Alert.alert('Attention', 'Le nom est obligatoire');
            return;
        }

        setSauvegardeEnCours(true);
        try {
            if (estEdition) {
                await api.patch(`/categories/${id}`, { nom });
            } else {
                await api.post('/categories', { nom });
            }
            router.back();
        } catch (err: any) {
            Alert.alert('Erreur', "Échec de l'enregistrement");
        } finally {
            setSauvegardeEnCours(false);
        }
    };

    if (chargement) return <Chargement />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView style={styles.conteneur} contentContainerStyle={styles.contenu}>
                <View style={styles.formCard}>
                    <Text style={styles.sectionLabel}>Détails de la catégorie</Text>

                    <ChampSaisie
                        label="NOM DE LA CATÉGORIE"
                        value={nom}
                        onChangeText={setNom}
                        placeholder="Ex: Gâteaux d'anniversaire"
                        autoFocus
                    />

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={enregistrer}
                        disabled={sauvegardeEnCours}
                    >
                        <LinearGradient
                            colors={['#b59a5d', '#8e7943']}
                            style={styles.saveGradient}
                        >
                            {sauvegardeEnCours ? (
                                <Text style={styles.saveBtnText}>Traitement...</Text>
                            ) : (
                                <Text style={styles.saveBtnText}>
                                    {estEdition ? "Enregistrer les modifications" : "Créer la catégorie"}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                        <Text style={styles.cancelBtnText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    contenu: { padding: 16 },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        marginTop: 20,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
            android: { elevation: 4 },
        }),
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94a3b8',
        marginBottom: 20,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    saveBtn: {
        borderRadius: 18,
        overflow: 'hidden',
        marginTop: 20,
    },
    saveGradient: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
    cancelBtn: { padding: 16, alignItems: 'center', marginTop: 8 },
    cancelBtnText: { color: '#94a3b8', fontWeight: '700', fontSize: 14 },
});
