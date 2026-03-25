// =============================================================================
// Sweet-Cake Mobile — Formulaire Article Stock (Design Premium iOS 26)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
    Platform, Alert
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import ChampSaisie from '../../src/composants/ChampSaisie';
import Bouton from '../../src/composants/Bouton';
import Chargement from '../../src/composants/Chargement';

export default function StockForm() {
    const { id } = useLocalSearchParams();
    const estEdition = !!id;

    const [nom, setNom] = useState('');
    const [unite, setUnite] = useState('');
    const [seuilMinimal, setSeuilMinimal] = useState('');
    const [quantiteInitiale, setQuantiteInitiale] = useState('');
    const [chargement, setChargement] = useState(estEdition);
    const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);

    useEffect(() => {
        if (estEdition) {
            const charger = async () => {
                try {
                    const { data } = await api.get(`/articles-stock/${id}`);
                    const a = data.donnees;
                    setNom(a.nom);
                    setUnite(a.unite);
                    setSeuilMinimal(a.seuil_minimal?.toString() || '');
                } catch (err) {
                    console.error('Erreur chargement article stock:', err);
                    Alert.alert('Erreur', 'Impossible de charger l\'article.');
                    router.back();
                } finally {
                    setChargement(false);
                }
            };
            charger();
        }
    }, [id]);

    const valider = () => {
        if (!nom.trim()) return "Le nom est requis";
        if (!unite.trim()) return "L'unité est requise (ex: kg, unité)";
        if (seuilMinimal && isNaN(Number(seuilMinimal))) return "Seuil minimal invalide";
        if (!estEdition && quantiteInitiale && isNaN(Number(quantiteInitiale))) return "Quantité initiale invalide";
        return null;
    };

    const handleSauvegarder = async () => {
        const erreur = valider();
        if (erreur) {
            Alert.alert('Champs requis', erreur);
            return;
        }

        setSauvegardeEnCours(true);
        try {
            const payload: any = {
                nom,
                unite,
                seuil_minimal: seuilMinimal ? parseFloat(seuilMinimal) : 0,
            };

            if (!estEdition && quantiteInitiale) {
                payload.quantite = parseFloat(quantiteInitiale);
            }

            if (estEdition) {
                await api.patch(`/articles-stock/${id}`, payload);
                Alert.alert('✅ Mis à jour', 'Article modifié avec succès.');
            } else {
                await api.post('/articles-stock', payload);
                Alert.alert('✅ Créé', 'Nouvel article ajouté au stock.');
            }
            router.back();
        } catch (err: any) {
            console.error('Erreur sauvegarde stock:', err);
            Alert.alert('Erreur', err.response?.data?.message || 'Une erreur est survenue.');
        } finally {
            setSauvegardeEnCours(false);
        }
    };

    if (chargement) return <Chargement />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: couleurs.blanc }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <Stack.Screen options={{ title: estEdition ? 'Modifier Article' : 'Nouvel Article' }} />
            <ScrollView
                style={styles.conteneur}
                contentContainerStyle={styles.scrollContenu}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.label}>Caractéristiques de l'article</Text>
                    <ChampSaisie
                        label="Nom de l'ingrédient / article"
                        value={nom}
                        onChangeText={setNom}
                        placeholder="Ex: Farine de blé T55"
                    />
                    <ChampSaisie
                        label="Unité de mesure"
                        value={unite}
                        onChangeText={setUnite}
                        placeholder="Ex: kg, litre, unité, gramme"
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Gestion des Seuils</Text>
                    <ChampSaisie
                        label="Seuil d'alerte (Stock faible)"
                        value={seuilMinimal}
                        onChangeText={setSeuilMinimal}
                        placeholder="Ex: 5"
                        keyboardType="numeric"
                    />
                    {!estEdition && (
                        <ChampSaisie
                            label="Quantité en stock actuelle (Optionnel)"
                            value={quantiteInitiale}
                            onChangeText={setQuantiteInitiale}
                            placeholder="Ex: 20"
                            keyboardType="numeric"
                        />
                    )}
                </View>

                <Bouton
                    titre={estEdition ? "Enregistrer les modifications" : "Ajouter au stock"}
                    onPress={handleSauvegarder}
                    chargement={sauvegardeEnCours}
                    style={styles.boutonAction}
                />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1 },
    scrollContenu: { padding: 20, paddingBottom: 60 },
    section: { marginBottom: 24 },
    label: {
        fontSize: 14,
        fontWeight: '700',
        color: couleurs.gris[500],
        marginBottom: 16,
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    boutonAction: { marginTop: 10 },
});
