// =============================================================================
// Sweet-Cake Mobile — Formulaire Atelier (Design Premium iOS 26)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, KeyboardAvoidingView,
    Platform, Alert, TouchableOpacity
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import ChampSaisie from '../../src/composants/ChampSaisie';
import Bouton from '../../src/composants/Bouton';
import Chargement from '../../src/composants/Chargement';

export default function AtelierForm() {
    const { id } = useLocalSearchParams();
    const estEdition = !!id;

    const [titre, setTitre] = useState('');
    const [description, setDescription] = useState('');
    const [dateAtelier, setDateAtelier] = useState(new Date());
    const [heureDebut, setHeureDebut] = useState(new Date());
    const [heureFin, setHeureFin] = useState(new Date());
    const [capacite, setCapacite] = useState('');
    const [prix, setPrix] = useState('');
    const [chargement, setChargement] = useState(estEdition);
    const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);

    // Modes pour les pickers (iOS/Android handling)
    const [montrerDatePicker, setMontrerDatePicker] = useState(false);
    const [montrerHeureDebutPicker, setMontrerHeureDebutPicker] = useState(false);
    const [montrerHeureFinPicker, setMontrerHeureFinPicker] = useState(false);

    useEffect(() => {
        if (estEdition) {
            const charger = async () => {
                try {
                    const { data } = await api.get(`/ateliers/${id}`);
                    const a = data.donnees;
                    setTitre(a.titre);
                    setDescription(a.description || '');
                    setDateAtelier(new Date(a.date_atelier));

                    // Parsing des heures (HH:mm)
                    const [hD, mD] = a.heure_debut.split(':');
                    const dD = new Date();
                    dD.setHours(parseInt(hD), parseInt(mD));
                    setHeureDebut(dD);

                    const [hF, mF] = a.heure_fin.split(':');
                    const dF = new Date();
                    dF.setHours(parseInt(hF), parseInt(mF));
                    setHeureFin(dF);

                    setCapacite(a.capacite.toString());
                    setPrix(a.prix.toString());
                } catch (err) {
                    console.error('Erreur chargement atelier:', err);
                    Alert.alert('Erreur', 'Impossible de charger les données de l\'atelier.');
                    router.back();
                } finally {
                    setChargement(false);
                }
            };
            charger();
        }
    }, [id]);

    const valider = () => {
        if (!titre.trim()) return "Le titre est requis";
        if (!capacite.trim() || isNaN(Number(capacite))) return "Capacité invalide";
        if (!prix.trim() || isNaN(Number(prix))) return "Prix invalide";
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
            const formatHeure = (date: Date) => {
                return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            };

            const payload = {
                titre,
                description,
                date_atelier: dateAtelier.toISOString().split('T')[0],
                heure_debut: formatHeure(heureDebut),
                heure_fin: formatHeure(heureFin),
                capacite: parseInt(capacite),
                prix: parseFloat(prix),
            };

            if (estEdition) {
                await api.patch(`/ateliers/${id}`, payload);
                Alert.alert('✅ Mis à jour', 'L\'atelier a été modifié avec succès.');
            } else {
                await api.post('/ateliers', payload);
                Alert.alert('✅ Créé', 'L\'atelier a été planifié avec succès.');
            }
            router.back();
        } catch (err: any) {
            console.error('Erreur sauvegarde atelier:', err);
            Alert.alert('Erreur', err.response?.data?.message || 'Une erreur est survenue lors de la sauvegarde.');
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
            <Stack.Screen options={{ title: estEdition ? 'Modifier Atelier' : 'Nouvel Atelier' }} />
            <ScrollView
                style={styles.conteneur}
                contentContainerStyle={styles.scrollContenu}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.section}>
                    <Text style={styles.label}>Informations Générales</Text>
                    <ChampSaisie
                        label="Titre de l'atelier"
                        value={titre}
                        onChangeText={setTitre}
                        placeholder="Ex: Perfectionnement Macarons"
                    />
                    <ChampSaisie
                        label="Description (Optionnelle)"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Détails du programme..."
                        multiline
                        nbLignes={4}
                    />
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Date et Horaires</Text>

                    {/* Date Picker */}
                    <TouchableOpacity
                        style={styles.selecteurRdv}
                        onPress={() => setMontrerDatePicker(true)}
                    >
                        <Ionicons name="calendar-outline" size={20} color={couleurs.primaire.defaut} />
                        <View style={styles.selecteurInfo}>
                            <Text style={styles.selecteurTexteLabel}>Date</Text>
                            <Text style={styles.selecteurValeur}>{dateAtelier.toLocaleDateString('fr-FR')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={16} color={couleurs.gris[400]} />
                    </TouchableOpacity>

                    {montrerDatePicker && (
                        <DateTimePicker
                            value={dateAtelier}
                            mode="date"
                            display="default"
                            onChange={(event, selectedDate) => {
                                setMontrerDatePicker(false);
                                if (selectedDate) setDateAtelier(selectedDate);
                            }}
                        />
                    )}

                    <View style={styles.ligneHeures}>
                        <TouchableOpacity
                            style={[styles.selecteurRdv, { flex: 1, marginRight: 8 }]}
                            onPress={() => setMontrerHeureDebutPicker(true)}
                        >
                            <View style={styles.selecteurInfo}>
                                <Text style={styles.selecteurTexteLabel}>Début</Text>
                                <Text style={styles.selecteurValeur}>
                                    {heureDebut.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.selecteurRdv, { flex: 1, marginLeft: 8 }]}
                            onPress={() => setMontrerHeureFinPicker(true)}
                        >
                            <View style={styles.selecteurInfo}>
                                <Text style={styles.selecteurTexteLabel}>Fin</Text>
                                <Text style={styles.selecteurValeur}>
                                    {heureFin.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    {montrerHeureDebutPicker && (
                        <DateTimePicker
                            value={heureDebut}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedTime) => {
                                setMontrerHeureDebutPicker(false);
                                if (selectedTime) setHeureDebut(selectedTime);
                            }}
                        />
                    )}

                    {montrerHeureFinPicker && (
                        <DateTimePicker
                            value={heureFin}
                            mode="time"
                            is24Hour={true}
                            display="default"
                            onChange={(event, selectedTime) => {
                                setMontrerHeureFinPicker(false);
                                if (selectedTime) setHeureFin(selectedTime);
                            }}
                        />
                    )}
                </View>

                <View style={styles.section}>
                    <Text style={styles.label}>Tarification et Capacité</Text>
                    <View style={styles.ligneChamps}>
                        <View style={{ flex: 1, marginRight: 10 }}>
                            <ChampSaisie
                                label="Capacité"
                                value={capacite}
                                onChangeText={setCapacite}
                                placeholder="8"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={{ flex: 1.5 }}>
                            <ChampSaisie
                                label="Prix (FCFA)"
                                value={prix}
                                onChangeText={setPrix}
                                placeholder="25000"
                                keyboardType="numeric"
                            />
                        </View>
                    </View>
                </View>

                <Bouton
                    titre={estEdition ? "Enregistrer les modifications" : "Planifier l'atelier"}
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
    selecteurRdv: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: couleurs.gris[50],
        borderRadius: 16,
        padding: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: couleurs.gris[100],
    },
    selecteurInfo: { flex: 1, marginLeft: 12 },
    selecteurTexteLabel: { fontSize: 12, color: couleurs.gris[400], fontWeight: '600' },
    selecteurValeur: { fontSize: 16, fontWeight: '700', color: couleurs.gris[900], marginTop: 2 },
    ligneHeures: { flexDirection: 'row' },
    ligneChamps: { flexDirection: 'row' },
    boutonAction: { marginTop: 10 },
});
