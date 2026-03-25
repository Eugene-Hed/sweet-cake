// =============================================================================
// Sweet-Cake Mobile — Écran Ateliers Client
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import Badge from '../../src/composants/Badge';
import Bouton from '../../src/composants/Bouton';
import Chargement from '../../src/composants/Chargement';

export default function Ateliers() {
    const [ateliers, setAteliers] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);

    const charger = async () => {
        try {
            const { data } = await api.get('/ateliers');
            setAteliers(data.donnees || []);
        } catch (err) {
            console.error('Erreur ateliers:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    const reserver = async (atelierId: number) => {
        try {
            await api.post('/reservations', { atelier_id: atelierId });
            Alert.alert('✅ Réservé !', 'Votre place a été réservée avec succès.');
            charger();
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Impossible de réserver');
        }
    };

    if (chargement) return <Chargement />;

    return (
        <ScrollView style={styles.conteneur}>
            <View style={styles.padding}>
                {ateliers.map((atelier) => {
                    const placesRestantes = atelier.capacite_max - (atelier.places_reservees || 0);
                    const estComplet = placesRestantes <= 0;
                    const progression = ((atelier.places_reservees || 0) / atelier.capacite_max) * 100;

                    return (
                        <View key={atelier.id} style={styles.carte}>
                            <View style={styles.entete}>
                                <Text style={styles.titre}>{atelier.titre}</Text>
                                <Badge
                                    texte={estComplet ? 'Complet' : `${placesRestantes} places`}
                                    variante={estComplet ? 'erreur' : placesRestantes <= 3 ? 'avertissement' : 'succes'}
                                />
                            </View>

                            {atelier.description && (
                                <Text style={styles.description} numberOfLines={2}>{atelier.description}</Text>
                            )}

                            <Text style={styles.date}>
                                📅 {new Date(atelier.date_debut).toLocaleDateString('fr-FR', {
                                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                                })}
                            </Text>

                            {/* Jauge de capacité */}
                            <View style={styles.jaugeConteneur}>
                                <View style={styles.jaugeFond}>
                                    <View
                                        style={[
                                            styles.jaugeRemplissage,
                                            {
                                                width: `${Math.min(progression, 100)}%`,
                                                backgroundColor: estComplet
                                                    ? couleurs.erreur.defaut
                                                    : progression > 70
                                                        ? couleurs.avertissement.defaut
                                                        : couleurs.succes.defaut,
                                            },
                                        ]}
                                    />
                                </View>
                                <Text style={styles.jaugeTexte}>{atelier.places_reservees || 0}/{atelier.capacite_max}</Text>
                            </View>

                            <View style={styles.piedCarte}>
                                <Text style={styles.prix}>{Number(atelier.prix).toFixed(2)} €</Text>
                                <Bouton
                                    titre={estComplet ? 'Complet' : 'Réserver'}
                                    onPress={() => reserver(atelier.id)}
                                    taille="sm"
                                    desactive={estComplet}
                                />
                            </View>
                        </View>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    padding: { padding: espacements.md },
    carte: {
        backgroundColor: couleurs.blanc,
        borderRadius: rayons.lg,
        padding: espacements.md,
        marginBottom: espacements.md,
        borderWidth: 1,
        borderColor: couleurs.gris[200],
    },
    entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
    titre: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900], flex: 1, marginRight: 8 },
    description: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], marginBottom: 8 },
    date: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], marginBottom: 12 },
    jaugeConteneur: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    jaugeFond: { flex: 1, height: 6, backgroundColor: couleurs.gris[200], borderRadius: 3, overflow: 'hidden', marginRight: 8 },
    jaugeRemplissage: { height: '100%', borderRadius: 3 },
    jaugeTexte: { fontSize: typographie.legende.taille, color: couleurs.gris[500], width: 40, textAlign: 'right' },
    piedCarte: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    prix: { fontSize: typographie.sous_titre.taille, fontWeight: '700', color: couleurs.primaire.defaut },
});
