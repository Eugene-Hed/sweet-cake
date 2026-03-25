// =============================================================================
// Sweet-Cake Mobile — Écran Profil Client
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import { useAuthStore } from '../../src/stores/auth.store';
import Badge, { BADGE_STATUT_COMMANDE, BADGE_STATUT_RESERVATION } from '../../src/composants/Badge';
import Bouton from '../../src/composants/Bouton';
import Chargement from '../../src/composants/Chargement';

export default function Profil() {
    const { utilisateur, deconnexion } = useAuthStore();
    const [commandes, setCommandes] = useState<any[]>([]);
    const [reservations, setReservations] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);

    const charger = async () => {
        try {
            const [resCom, resRev] = await Promise.all([
                api.get('/commandes/mes-commandes?limite=5'),
                api.get('/reservations/mes-reservations?limite=5').catch(() => ({ data: { donnees: [] } })),
            ]);
            setCommandes(resCom.data.donnees || []);
            setReservations(resRev.data.donnees || []);
        } catch (err) {
            console.error('Erreur profil:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    const handleDeconnexion = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Déconnexion',
                style: 'destructive',
                onPress: async () => {
                    await deconnexion();
                    router.replace('/(auth)/connexion');
                },
            },
        ]);
    };

    const annulerReservation = async (id: number) => {
        try {
            await api.post(`/reservations/${id}/annuler`);
            Alert.alert('✅', 'Réservation annulée');
            charger();
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Impossible d\'annuler');
        }
    };

    if (chargement) return <Chargement />;

    return (
        <ScrollView style={styles.conteneur}>
            {/* Carte profil */}
            <View style={styles.profilCarte}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarTexte}>
                        {utilisateur?.nom_complet?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
                <Text style={styles.nom}>{utilisateur?.nom_complet}</Text>
                <Text style={styles.email}>{utilisateur?.email}</Text>
                <Badge texte={utilisateur?.role || 'client'} variante="primaire" />
            </View>

            {/* Mes commandes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>📦 Mes commandes récentes</Text>
                {commandes.length > 0 ? commandes.map((c) => (
                    <View key={c.id} style={styles.itemCarte}>
                        <View style={styles.itemEntete}>
                            <Text style={styles.itemId}>#{c.id}</Text>
                            <Badge
                                texte={c.statut.replace('_', ' ')}
                                variante={BADGE_STATUT_COMMANDE[c.statut] || 'neutre'}
                            />
                        </View>
                        <Text style={styles.itemDate}>{new Date(c.created_at).toLocaleDateString('fr-FR')}</Text>
                        <Text style={styles.itemTotal}>{Number(c.total).toFixed(2)} €</Text>
                    </View>
                )) : (
                    <Text style={styles.aucun}>Aucune commande pour le moment</Text>
                )}
            </View>

            {/* Mes réservations */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>👩‍🍳 Mes réservations</Text>
                {reservations.length > 0 ? reservations.map((r) => (
                    <View key={r.id} style={styles.itemCarte}>
                        <View style={styles.itemEntete}>
                            <Text style={styles.itemNom}>{r.atelier?.titre || `Atelier #${r.atelier_id}`}</Text>
                            <Badge
                                texte={r.statut.replace('_', ' ')}
                                variante={BADGE_STATUT_RESERVATION[r.statut] || 'neutre'}
                            />
                        </View>
                        {r.statut !== 'annulee' && (
                            <TouchableOpacity onPress={() => annulerReservation(r.id)}>
                                <Text style={styles.annuler}>Annuler</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )) : (
                    <Text style={styles.aucun}>Aucune réservation pour le moment</Text>
                )}
            </View>

            {/* Déconnexion */}
            <View style={styles.section}>
                <Bouton titre="Se déconnecter" onPress={handleDeconnexion} variante="danger" pleineLargeur />
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    profilCarte: {
        backgroundColor: couleurs.primaire.defaut,
        padding: espacements.lg,
        paddingTop: espacements['2xl'],
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
    },
    avatar: {
        width: 72, height: 72, borderRadius: 36,
        backgroundColor: 'rgba(255,255,255,0.25)',
        justifyContent: 'center', alignItems: 'center',
        marginBottom: espacements.md,
    },
    avatarTexte: { fontSize: 28, fontWeight: '700', color: couleurs.blanc },
    nom: { fontSize: typographie.titre_secondaire.taille, fontWeight: '700', color: couleurs.blanc },
    email: { fontSize: typographie.texte_secondaire.taille, color: 'rgba(255,255,255,0.8)', marginBottom: 8 },
    section: { padding: espacements.md },
    sectionTitre: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900], marginBottom: espacements.md },
    itemCarte: {
        backgroundColor: couleurs.blanc, borderRadius: rayons.md,
        padding: espacements.md_sm, marginBottom: espacements.sm,
        borderWidth: 1, borderColor: couleurs.gris[200],
    },
    itemEntete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    itemId: { fontSize: typographie.texte_secondaire.taille, fontWeight: '700', color: couleurs.gris[900] },
    itemNom: { fontSize: typographie.texte_secondaire.taille, fontWeight: '600', color: couleurs.gris[900], flex: 1, marginRight: 8 },
    itemDate: { fontSize: typographie.legende.taille, color: couleurs.gris[500], marginTop: 4 },
    itemTotal: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.primaire.defaut, marginTop: 4 },
    annuler: { fontSize: typographie.texte_secondaire.taille, color: couleurs.erreur.defaut, fontWeight: '600', marginTop: 8 },
    aucun: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[400], textAlign: 'center', padding: espacements.lg },
});
