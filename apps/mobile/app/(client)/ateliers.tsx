// =============================================================================
// Sweet-Cake Mobile — Écran Ateliers Client (Design Premium)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
            await api.post(`/ateliers/${atelierId}/reservations`, { nombre_places: 1 });
            Alert.alert('✅ Réservé !', 'Votre place a été réservée avec succès.');
            charger();
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Impossible de réserver');
        }
    };

    if (chargement) return <Chargement />;

    return (
        <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>
            {/* Entête */}
            <LinearGradient
                colors={[couleurs.secondaire.defaut || '#EDB95E', couleurs.secondaire.fonce || '#C6923B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.enteteGradient}
            >
                <Ionicons name="school" size={28} color="rgba(255,255,255,0.9)" />
                <Text style={styles.enteteTitre}>Nos ateliers pâtisserie</Text>
                <Text style={styles.enteteTexte}>Apprenez à créer de délicieuses gourmandises</Text>
            </LinearGradient>

            <View style={styles.padding}>
                {ateliers.map((atelier) => {
                    const capacite = atelier.capacite_max || atelier.capacite || 10;
                    const places = atelier.places_reservees || 0;
                    const placesRestantes = capacite - places;
                    const estComplet = placesRestantes <= 0;
                    const progression = (places / capacite) * 100;

                    return (
                        <View key={atelier.id} style={styles.carte}>
                            {/* Entête carte */}
                            <View style={styles.carteEntete}>
                                <View style={styles.iconeCercle}>
                                    <Ionicons name="school" size={20} color={couleurs.secondaire.fonce || couleurs.primaire.defaut} />
                                </View>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.titre}>{atelier.titre}</Text>
                                    {atelier.description && (
                                        <Text style={styles.description} numberOfLines={2}>{atelier.description}</Text>
                                    )}
                                </View>
                            </View>

                            {/* Infos */}
                            <View style={styles.infosLigne}>
                                <View style={styles.infoItem}>
                                    <Ionicons name="calendar-outline" size={16} color={couleurs.gris[500]} />
                                    <Text style={styles.infoTexte}>
                                        {new Date(atelier.date_atelier || atelier.date_debut).toLocaleDateString('fr-FR', {
                                            weekday: 'short', day: 'numeric', month: 'short',
                                        })}
                                    </Text>
                                </View>
                                <View style={styles.infoItem}>
                                    <Ionicons name="time-outline" size={16} color={couleurs.gris[500]} />
                                    <Text style={styles.infoTexte}>{atelier.duree_heures || 2}h</Text>
                                </View>
                                <Badge
                                    texte={estComplet ? 'Complet' : `${placesRestantes} places`}
                                    variante={estComplet ? 'erreur' : placesRestantes <= 3 ? 'avertissement' : 'succes'}
                                />
                            </View>

                            {/* Jauge de capacité premium */}
                            <View style={styles.jaugeConteneur}>
                                <View style={styles.jaugeFond}>
                                    <LinearGradient
                                        colors={
                                            estComplet
                                                ? [couleurs.erreur.defaut, couleurs.erreur.defaut]
                                                : progression > 70
                                                    ? [couleurs.avertissement.defaut, '#e67e22']
                                                    : [couleurs.succes.defaut, '#2ecc71']
                                        }
                                        start={{ x: 0, y: 0 }}
                                        end={{ x: 1, y: 0 }}
                                        style={[styles.jaugeRemplissage, { width: `${Math.min(progression, 100)}%` }]}
                                    />
                                </View>
                                <Text style={styles.jaugeTexte}>{places}/{capacite}</Text>
                            </View>

                            {/* Pied de carte */}
                            <View style={styles.piedCarte}>
                                <Text style={styles.prix}>{Number(atelier.prix).toLocaleString()} FCFA</Text>
                                <Bouton
                                    titre={estComplet ? 'Complet' : 'Réserver'}
                                    onPress={() => reserver(atelier.id)}
                                    taille="sm"
                                    desactive={estComplet}
                                    icone={!estComplet ? <Ionicons name="bookmark-outline" size={16} color={couleurs.blanc} /> : undefined}
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
    enteteGradient: {
        padding: 24,
        paddingTop: 28,
        borderBottomLeftRadius: 28,
        borderBottomRightRadius: 28,
        alignItems: 'center',
        gap: 6,
    },
    enteteTitre: { fontSize: 20, fontWeight: '800', color: couleurs.blanc },
    enteteTexte: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '500' },
    padding: { padding: 16 },
    carte: {
        backgroundColor: couleurs.blanc,
        borderRadius: 18,
        padding: 18,
        marginBottom: 14,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.07,
                shadowRadius: 10,
            },
            android: { elevation: 3 },
        }),
    },
    carteEntete: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 14 },
    iconeCercle: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: (couleurs.secondaire?.clair || '#FFF3CD') + '50',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    titre: { fontSize: 16, fontWeight: '700', color: couleurs.gris[900] },
    description: { fontSize: 13, color: couleurs.gris[600], marginTop: 2, lineHeight: 18 },
    infosLigne: { flexDirection: 'row', alignItems: 'center', gap: 14, marginBottom: 12 },
    infoItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    infoTexte: { fontSize: 12, color: couleurs.gris[600], fontWeight: '500' },
    jaugeConteneur: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
    jaugeFond: { flex: 1, height: 8, backgroundColor: couleurs.gris[100], borderRadius: 4, overflow: 'hidden', marginRight: 10 },
    jaugeRemplissage: { height: '100%', borderRadius: 4 },
    jaugeTexte: { fontSize: 12, color: couleurs.gris[500], fontWeight: '600', width: 40, textAlign: 'right' },
    piedCarte: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    prix: { fontSize: 18, fontWeight: '800', color: couleurs.primaire.defaut },
});
