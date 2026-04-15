// =============================================================================
// Sweet-Cake Mobile — Détails d'une Commande
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../../../src/services/api';
import Badge, { BADGE_STATUT_COMMANDE } from '../../../../src/composants/Badge';
import Chargement from '../../../../src/composants/Chargement';
import Bouton from '../../../../src/composants/Bouton';

export default function DetailsCommande() {
    const { id } = useLocalSearchParams();
    const [commande, setCommande] = useState<any>(null);
    const [chargement, setChargement] = useState(true);

    useEffect(() => {
        const charger = async () => {
            try {
                const { data } = await api.get(`/commandes/${id}`);
                setCommande(data.donnees);
            } catch (err) {
                console.error('Erreur chargement commande:', err);
                Alert.alert('Erreur', 'Impossible de charger les détails de la commande.');
                router.back();
            } finally {
                setChargement(false);
            }
        };
        charger();
    }, [id]);

    if (chargement) return <Chargement />;
    if (!commande) return null;

    return (
        <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLigne}>
                    <Text style={styles.titre}>Commande #{commande.id}</Text>
                    <Badge
                        texte={commande.statut.replace('_', ' ')}
                        variante={BADGE_STATUT_COMMANDE[commande.statut] || 'neutre'}
                    />
                </View>
                <Text style={styles.date}>Passée le {new Date(commande.created_at).toLocaleDateString('fr-FR', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</Text>
            </View>

            {/* Articles */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>Articles</Text>
                {commande.lignes?.map((ligne: any) => (
                    <View key={ligne.id} style={styles.articleLigne}>
                        <View style={styles.articleEmoji}>
                            <Text style={{ fontSize: 24 }}>🍰</Text>
                        </View>
                        <View style={styles.articleInfos}>
                            <Text style={styles.articleNom}>{ligne.produit?.nom || 'Produit'}</Text>
                            {ligne.options_choisies && Object.entries(ligne.options_choisies).length > 0 && (
                                <Text style={styles.articleOptions}>
                                    {Object.entries(ligne.options_choisies).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                </Text>
                            )}
                            <Text style={styles.articleQuantite}>Quantité : {ligne.quantite}</Text>
                        </View>
                        <Text style={styles.articlePrix}>{(Number(ligne.prix_unitaire) * ligne.quantite).toLocaleString()} FCFA</Text>
                    </View>
                ))}
            </View>

            {/* Total */}
            <View style={styles.sectionTotal}>
                <View style={styles.totalLigne}>
                    <Text style={styles.totalLabel}>Total payé</Text>
                    <Text style={styles.totalValeur}>{Number(commande.montant_total).toLocaleString()} FCFA</Text>
                </View>
            </View>

            {/* Infos Livraison/Retrait */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>Informations</Text>
                <View style={styles.infoBox}>
                    <Ionicons name="location-outline" size={20} color={couleurs.gris[600]} />
                    <View>
                        <Text style={styles.infoLabel}>Mode de retrait</Text>
                        <Text style={styles.infoValeur}>Retrait en boutique (Mfou, Awae)</Text>
                    </View>
                </View>
                <View style={styles.infoBox}>
                    <Ionicons name="call-outline" size={20} color={couleurs.gris[600]} />
                    <View>
                        <Text style={styles.infoLabel}>Besoin d'aide ?</Text>
                        <Text style={styles.infoValeur}>Contactez-nous au +237 692 042 589</Text>
                    </View>
                </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
                <Bouton
                    titre="Retour à mes commandes"
                    onPress={() => router.back()}
                    variante="secondaire"
                    pleineLargeur
                />
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    header: {
        padding: 24,
        backgroundColor: couleurs.blanc,
        borderBottomWidth: 1,
        borderBottomColor: couleurs.gris[100],
    },
    headerLigne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
    titre: { fontSize: 22, fontWeight: '800', color: couleurs.gris[900] },
    date: { fontSize: 14, color: couleurs.gris[500] },
    section: { padding: 24 },
    sectionTitre: { fontSize: 17, fontWeight: '700', color: couleurs.gris[900], marginBottom: 16 },
    articleLigne: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: couleurs.blanc,
        borderRadius: 16,
        padding: 12,
        marginBottom: 10,
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
            android: { elevation: 2 },
        }),
    },
    articleEmoji: {
        width: 48, height: 48, borderRadius: 12,
        backgroundColor: couleurs.primaire.clair + '30',
        justifyContent: 'center', alignItems: 'center',
        marginRight: 12,
    },
    articleInfos: { flex: 1 },
    articleNom: { fontSize: 15, fontWeight: '600', color: couleurs.gris[900] },
    articleOptions: { fontSize: 12, color: couleurs.primaire.defaut, fontWeight: '600' },
    articleQuantite: { fontSize: 13, color: couleurs.gris[500], marginTop: 2 },
    articlePrix: { fontSize: 15, fontWeight: '700', color: couleurs.primaire.defaut },
    sectionTotal: {
        marginHorizontal: 24,
        padding: 20,
        backgroundColor: couleurs.gris[900],
        borderRadius: 20,
    },
    totalLigne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    totalLabel: { fontSize: 16, color: 'rgba(255,255,255,0.7)', fontWeight: '600' },
    totalValeur: { fontSize: 20, fontWeight: '800', color: couleurs.blanc },
    infoBox: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: couleurs.blanc,
        padding: 16,
        borderRadius: 16,
        marginBottom: 10,
    },
    infoLabel: { fontSize: 12, color: couleurs.gris[500], fontWeight: '600' },
    infoValeur: { fontSize: 14, color: couleurs.gris[900], fontWeight: '600', marginTop: 2 },
    actions: { paddingHorizontal: 24, marginTop: 10 },
});
