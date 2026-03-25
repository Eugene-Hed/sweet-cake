// =============================================================================
// Sweet-Cake Mobile — Écran Plus (Admin)
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import { useAuthStore } from '../../src/stores/auth.store';
import Badge from '../../src/composants/Badge';
import Bouton from '../../src/composants/Bouton';

export default function PlusAdmin() {
    const { utilisateur, deconnexion } = useAuthStore();
    const [utilisateurs, setUtilisateurs] = useState<any[]>([]);
    const [journaux, setJournaux] = useState<any[]>([]);

    useEffect(() => {
        const charger = async () => {
            try {
                const [resUsers, resLogs] = await Promise.all([
                    api.get('/utilisateurs?limite=10'),
                    api.get('/journaux-audit?limite=10').catch(() => ({ data: { donnees: [] } })),
                ]);
                setUtilisateurs(resUsers.data.donnees || []);
                setJournaux(resLogs.data.donnees || []);
            } catch (err) {
                console.error('Erreur plus:', err);
            }
        };
        charger();
    }, []);

    const handleDeconnexion = () => {
        Alert.alert('Déconnexion', 'Voulez-vous vraiment vous déconnecter ?', [
            { text: 'Annuler', style: 'cancel' },
            {
                text: 'Déconnexion', style: 'destructive',
                onPress: async () => { await deconnexion(); router.replace('/(auth)/connexion'); },
            },
        ]);
    };

    const ROLES_COULEURS: Record<string, string> = {
        administrateur: 'primaire',
        client: 'neutre',
    };

    return (
        <ScrollView style={styles.conteneur}>
            {/* Profil admin */}
            <View style={styles.profilCarte}>
                <View style={styles.avatar}>
                    <Text style={styles.avatarTexte}>
                        {utilisateur?.nom_complet?.charAt(0)?.toUpperCase() || '?'}
                    </Text>
                </View>
                <View>
                    <Text style={styles.nom}>{utilisateur?.nom_complet}</Text>
                    <Text style={styles.email}>{utilisateur?.email}</Text>
                </View>
            </View>

            {/* Actions Administrateur */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>🛠️ Gestion & Inventaire</Text>
                <View style={styles.actionsGrille}>
                    <TouchableOpacity style={styles.actionCarte} onPress={() => router.push('/(admin)/catalogue/produits')}>
                        <View style={[styles.actionIcone, { backgroundColor: couleurs.primaire.clair + '20' }]}>
                            <Ionicons name="cafe" size={24} color={couleurs.primaire.defaut} />
                        </View>
                        <Text style={styles.actionTexte}>Produits</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCarte} onPress={() => router.push('/(admin)/catalogue/categories')}>
                        <View style={[styles.actionIcone, { backgroundColor: couleurs.secondaire.clair + '40' }]}>
                            <Ionicons name="apps" size={24} color={couleurs.secondaire.fonce} />
                        </View>
                        <Text style={styles.actionTexte}>Catégories</Text>
                    </TouchableOpacity>
                </View>
                <View style={[styles.actionsGrille, { marginTop: 12 }]}>
                    <TouchableOpacity style={styles.actionCarte} onPress={() => router.push('/(admin)/ateliers-admin')}>
                        <View style={[styles.actionIcone, { backgroundColor: '#e0f2fe' }]}>
                            <Ionicons name="school" size={24} color="#0369a1" />
                        </View>
                        <Text style={styles.actionTexte}>Ateliers</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCarte} onPress={() => router.push('/(admin)/stock')}>
                        <View style={[styles.actionIcone, { backgroundColor: '#fef3c7' }]}>
                            <Ionicons name="cube" size={24} color="#b45309" />
                        </View>
                        <Text style={styles.actionTexte}>Stock</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Utilisateurs */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>👥 Utilisateurs ({utilisateurs.length})</Text>
                {utilisateurs.map((u) => (
                    <View key={u.id} style={styles.userLigne}>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.userNom}>{u.nom_complet}</Text>
                            <Text style={styles.userEmail}>{u.email}</Text>
                        </View>
                        <Badge texte={u.role} variante={(ROLES_COULEURS[u.role] as any) || 'neutre'} />
                    </View>
                ))}
            </View>

            {/* Journaux d'audit */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>📋 Journaux d'audit récents</Text>
                {journaux.length > 0 ? journaux.map((j: any) => (
                    <View key={j.id} style={styles.logCarte}>
                        <Text style={styles.logAction}>{j.action}</Text>
                        <Text style={styles.logDetails}>{j.entite} #{j.entite_id}</Text>
                        <Text style={styles.logDate}>
                            {new Date(j.created_at).toLocaleString('fr-FR')}
                        </Text>
                    </View>
                )) : (
                    <Text style={styles.aucun}>Aucun journal disponible</Text>
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
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: couleurs.gris[900],
        padding: espacements.lg, paddingTop: espacements.xl,
    },
    avatar: {
        width: 52, height: 52, borderRadius: 26,
        backgroundColor: couleurs.secondaire.defaut,
        justifyContent: 'center', alignItems: 'center',
        marginRight: espacements.md,
    },
    avatarTexte: { fontSize: 20, fontWeight: '700', color: couleurs.gris[900] },
    nom: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.blanc },
    email: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[400] },
    section: { padding: espacements.md },
    sectionTitre: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900], marginBottom: espacements.md },
    actionsGrille: { flexDirection: 'row', gap: 12 },
    actionCarte: {
        flex: 1,
        backgroundColor: couleurs.blanc,
        borderRadius: 16,
        padding: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: couleurs.gris[200],
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6 },
            android: { elevation: 2 },
        }),
    },
    actionIcone: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionTexte: { fontSize: 13, fontWeight: '700', color: couleurs.gris[800] },
    userLigne: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: couleurs.blanc, borderRadius: rayons.md,
        padding: espacements.md_sm, marginBottom: espacements.sm,
        borderWidth: 1, borderColor: couleurs.gris[200],
    },
    userNom: { fontSize: typographie.texte_secondaire.taille, fontWeight: '600', color: couleurs.gris[900] },
    userEmail: { fontSize: typographie.legende.taille, color: couleurs.gris[500] },
    logCarte: {
        backgroundColor: couleurs.blanc, borderRadius: rayons.md,
        padding: espacements.md_sm, marginBottom: espacements.sm,
        borderWidth: 1, borderColor: couleurs.gris[200],
    },
    logAction: { fontSize: typographie.texte_secondaire.taille, fontWeight: '600', color: couleurs.gris[900] },
    logDetails: { fontSize: typographie.legende.taille, color: couleurs.gris[600], marginTop: 2 },
    logDate: { fontSize: typographie.legende.taille, color: couleurs.gris[400], marginTop: 2 },
    aucun: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[400], textAlign: 'center', padding: espacements.lg },
});
