// =============================================================================
// Sweet-Cake Mobile — Gestion Ateliers Admin
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import Badge, { BADGE_STATUT_RESERVATION } from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';

export default function AteliersAdmin() {
    const [ateliers, setAteliers] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);

    const charger = async () => {
        try {
            const { data } = await api.get('/ateliers');
            setAteliers(data.donnees || []);
        } catch (err) {
            console.error('Erreur ateliers admin:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    if (chargement) return <Chargement />;

    return (
        <ScrollView
            style={styles.conteneur}
            refreshControl={<RefreshControl refreshing={false} onRefresh={charger} tintColor={couleurs.secondaire.defaut} />}
        >
            <View style={styles.padding}>
                {ateliers.map((atelier) => {
                    const progression = ((atelier.places_reservees || 0) / atelier.capacite_max) * 100;
                    const reservations = atelier.reservations || [];

                    return (
                        <View key={atelier.id} style={styles.carte}>
                            {/* Entête */}
                            <Text style={styles.titre}>{atelier.titre}</Text>
                            <Text style={styles.date}>
                                📅 {new Date(atelier.date_debut).toLocaleDateString('fr-FR', {
                                    weekday: 'short', day: 'numeric', month: 'long',
                                })}
                            </Text>

                            {/* Jauge */}
                            <View style={styles.jaugeLigne}>
                                <View style={styles.jaugeFond}>
                                    <View
                                        style={[styles.jaugeBar, {
                                            width: `${Math.min(progression, 100)}%`,
                                            backgroundColor: progression >= 100
                                                ? couleurs.erreur.defaut
                                                : progression > 70
                                                    ? couleurs.avertissement.defaut
                                                    : couleurs.succes.defaut,
                                        }]}
                                    />
                                </View>
                                <Text style={styles.jaugeTexte}>
                                    {atelier.places_reservees || 0}/{atelier.capacite_max}
                                </Text>
                            </View>

                            {/* Prix + formateur */}
                            <View style={styles.infoLigne}>
                                <Text style={styles.prix}>{Number(atelier.prix).toFixed(2)} €</Text>
                                {atelier.formateur && (
                                    <Text style={styles.formateur}>
                                        👩‍🍳 {atelier.formateur.nom_complet}
                                    </Text>
                                )}
                            </View>

                            {/* Réservations */}
                            {reservations.length > 0 && (
                                <View style={styles.reservations}>
                                    <Text style={styles.reservationsTitre}>
                                        Réservations ({reservations.length})
                                    </Text>
                                    {reservations.map((r: any) => (
                                        <View key={r.id} style={styles.reservationLigne}>
                                            <Text style={styles.reservationClient}>
                                                {r.client?.nom_complet || `Client #${r.client_id}`}
                                            </Text>
                                            <Badge
                                                texte={r.statut.replace('_', ' ')}
                                                variante={BADGE_STATUT_RESERVATION[r.statut] || 'neutre'}
                                            />
                                        </View>
                                    ))}
                                </View>
                            )}
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
        backgroundColor: couleurs.blanc, borderRadius: rayons.lg,
        padding: espacements.md, marginBottom: espacements.md,
        borderWidth: 1, borderColor: couleurs.gris[200],
    },
    titre: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900] },
    date: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], marginTop: 4, marginBottom: 12 },
    jaugeLigne: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    jaugeFond: { flex: 1, height: 8, backgroundColor: couleurs.gris[200], borderRadius: 4, overflow: 'hidden', marginRight: 8 },
    jaugeBar: { height: '100%', borderRadius: 4 },
    jaugeTexte: { fontSize: typographie.legende.taille, color: couleurs.gris[500], fontWeight: '600', width: 44, textAlign: 'right' },
    infoLigne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    prix: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.primaire.defaut },
    formateur: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600] },
    reservations: { borderTopWidth: 1, borderTopColor: couleurs.gris[200], paddingTop: 12, marginTop: 4 },
    reservationsTitre: { fontSize: typographie.texte_secondaire.taille, fontWeight: '600', color: couleurs.gris[700], marginBottom: 8 },
    reservationLigne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
    reservationClient: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600] },
});
