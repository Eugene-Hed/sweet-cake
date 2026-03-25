// =============================================================================
// Sweet-Cake Mobile — Dashboard Admin
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, RefreshControl } from 'react-native';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import { CarteStatistique } from '../../src/composants/Carte';
import Badge, { BADGE_STATUT_COMMANDE } from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';

export default function Dashboard() {
    const [resume, setResume] = useState<any>(null);
    const [chargement, setChargement] = useState(true);
    const [rafraichissant, setRafraichissant] = useState(false);

    const charger = async () => {
        try {
            const { data } = await api.get('/tableau-de-bord/resume');
            setResume(data.donnees);
        } catch (err) {
            console.error('Erreur dashboard:', err);
        } finally {
            setChargement(false);
            setRafraichissant(false);
        }
    };

    useEffect(() => { charger(); }, []);

    if (chargement) return <Chargement />;

    return (
        <ScrollView
            style={styles.conteneur}
            refreshControl={
                <RefreshControl
                    refreshing={rafraichissant}
                    onRefresh={() => { setRafraichissant(true); charger(); }}
                    tintColor={couleurs.secondaire.defaut}
                />
            }
        >
            {/* Bannière */}
            <View style={styles.banniere}>
                <Text style={styles.banniereTitre}>🍰 Sweet-Cake Admin</Text>
                <Text style={styles.banniereTexte}>Tableau de bord</Text>
            </View>

            {/* Stats */}
            <View style={styles.statsGrille}>
                <CarteStatistique titre="Commandes" valeur={resume?.total_commandes || 0} icone="📦" />
                <CarteStatistique titre="Produits" valeur={resume?.total_produits || 0} icone="🍰" />
                <CarteStatistique titre="Ateliers" valeur={resume?.total_ateliers || 0} icone="👩‍🍳" />
                <CarteStatistique titre="Clients" valeur={resume?.total_clients || 0} icone="👥" />
                <CarteStatistique
                    titre="Revenus"
                    valeur={`${(resume?.revenus_estimes || 0).toFixed(0)} €`}
                    icone="💰"
                />
                <CarteStatistique
                    titre="Alertes stock"
                    valeur={resume?.alertes_stock_faible || 0}
                    icone="⚠️"
                />
            </View>

            {/* Commandes récentes */}
            <View style={styles.section}>
                <Text style={styles.sectionTitre}>Commandes récentes</Text>
                {(resume?.commandes_recentes || []).slice(0, 5).map((c: any) => (
                    <View key={c.id} style={styles.commandeCarte}>
                        <View style={styles.commandeEntete}>
                            <Text style={styles.commandeId}>#{c.id}</Text>
                            <Badge
                                texte={c.statut?.replace('_', ' ') || ''}
                                variante={BADGE_STATUT_COMMANDE[c.statut] || 'neutre'}
                            />
                        </View>
                        <Text style={styles.commandeClient}>{c.client?.nom_complet || 'Client'}</Text>
                        <View style={styles.commandePied}>
                            <Text style={styles.commandeDate}>
                                {new Date(c.created_at).toLocaleDateString('fr-FR')}
                            </Text>
                            <Text style={styles.commandeTotal}>{Number(c.total).toFixed(2)} €</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={{ height: 40 }} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    banniere: {
        backgroundColor: couleurs.gris[900],
        padding: espacements.lg,
        paddingTop: espacements.xl,
        paddingBottom: espacements['2xl'],
    },
    banniereTitre: { fontSize: typographie.titre_secondaire.taille, fontWeight: '700', color: couleurs.blanc },
    banniereTexte: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[400], marginTop: 4 },
    statsGrille: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        padding: espacements.md,
        marginTop: -espacements.lg,
    },
    section: { paddingHorizontal: espacements.md, marginTop: espacements.md },
    sectionTitre: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900], marginBottom: espacements.md },
    commandeCarte: {
        backgroundColor: couleurs.blanc, borderRadius: rayons.md,
        padding: espacements.md_sm, marginBottom: espacements.sm,
        borderWidth: 1, borderColor: couleurs.gris[200],
    },
    commandeEntete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    commandeId: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900] },
    commandeClient: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], marginTop: 4 },
    commandePied: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 },
    commandeDate: { fontSize: typographie.legende.taille, color: couleurs.gris[400] },
    commandeTotal: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.primaire.defaut },
});
