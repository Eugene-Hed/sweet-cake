// =============================================================================
// Sweet-Cake Mobile — Gestion Commandes Admin
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import { TRANSITIONS_STATUT_COMMANDE } from '@sweet-cake/shared';
import api from '../../src/services/api';
import Badge, { BADGE_STATUT_COMMANDE } from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';

const LABELS_STATUT: Record<string, string> = {
    en_attente: 'En attente',
    confirmee: 'Confirmée',
    en_preparation: 'En préparation',
    prete: 'Prête',
    terminee: 'Terminée',
    annulee: 'Annulée',
};

export default function CommandesAdmin() {
    const [commandes, setCommandes] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);
    const [commandeOuverte, setCommandeOuverte] = useState<number | null>(null);

    const charger = async () => {
        try {
            const { data } = await api.get('/commandes?limite=50');
            setCommandes(data.donnees || []);
        } catch (err) {
            console.error('Erreur commandes admin:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    const changerStatut = async (id: number, nouveauStatut: string) => {
        try {
            await api.patch(`/commandes/${id}/statut`, { statut: nouveauStatut });
            Alert.alert('✅', `Statut changé en "${LABELS_STATUT[nouveauStatut]}"`);
            charger();
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Changement impossible');
        }
    };

    if (chargement) return <Chargement />;

    return (
        <ScrollView
            style={styles.conteneur}
            refreshControl={<RefreshControl refreshing={false} onRefresh={charger} tintColor={couleurs.secondaire.defaut} />}
        >
            <View style={styles.padding}>
                <Text style={styles.compteur}>{commandes.length} commande(s)</Text>

                {commandes.map((c) => {
                    const transitions = TRANSITIONS_STATUT_COMMANDE[c.statut] || [];
                    const estOuverte = commandeOuverte === c.id;

                    return (
                        <TouchableOpacity
                            key={c.id}
                            style={styles.carte}
                            onPress={() => setCommandeOuverte(estOuverte ? null : c.id)}
                            activeOpacity={0.8}
                        >
                            <View style={styles.entete}>
                                <View>
                                    <Text style={styles.id}>Commande #{c.id}</Text>
                                    <Text style={styles.client}>{c.client?.nom_complet || '—'}</Text>
                                </View>
                                <Badge
                                    texte={LABELS_STATUT[c.statut] || c.statut}
                                    variante={BADGE_STATUT_COMMANDE[c.statut] || 'neutre'}
                                />
                            </View>

                            <View style={styles.details}>
                                <Text style={styles.detailTexte}>
                                    📅 {new Date(c.created_at).toLocaleDateString('fr-FR')}
                                </Text>
                                <Text style={styles.total}>{Number(c.total).toFixed(2)} €</Text>
                            </View>

                            {/* Lignes commande (affiché si ouvert) */}
                            {estOuverte && (
                                <View style={styles.expansion}>
                                    <Text style={styles.expansionTitre}>Articles :</Text>
                                    {(c.lignes || []).map((l: any, i: number) => (
                                        <Text key={i} style={styles.ligneProduit}>
                                            • {l.produit?.nom || `Produit #${l.produit_id}`} × {l.quantite} — {Number(l.prix_unitaire).toFixed(2)} €
                                        </Text>
                                    ))}

                                    {/* Actions de statut */}
                                    {transitions.length > 0 && (
                                        <View style={styles.actions}>
                                            {transitions.map((s) => (
                                                <TouchableOpacity
                                                    key={s}
                                                    style={[
                                                        styles.actionBtn,
                                                        s === 'annulee' && styles.actionBtnDanger,
                                                    ]}
                                                    onPress={() => changerStatut(c.id, s)}
                                                >
                                                    <Text
                                                        style={[
                                                            styles.actionBtnTexte,
                                                            s === 'annulee' && styles.actionBtnTexteDanger,
                                                        ]}
                                                    >
                                                        {s === 'annulee' ? '✕ Annuler' : `→ ${LABELS_STATUT[s]}`}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                        </View>
                                    )}
                                </View>
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    padding: { padding: espacements.md },
    compteur: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[500], marginBottom: espacements.md },
    carte: {
        backgroundColor: couleurs.blanc, borderRadius: rayons.lg,
        padding: espacements.md, marginBottom: espacements.md,
        borderWidth: 1, borderColor: couleurs.gris[200],
    },
    entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    id: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900] },
    client: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], marginTop: 2 },
    details: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12, alignItems: 'center' },
    detailTexte: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[500] },
    total: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.primaire.defaut },
    expansion: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: couleurs.gris[200] },
    expansionTitre: { fontSize: typographie.texte_secondaire.taille, fontWeight: '600', color: couleurs.gris[700], marginBottom: 4 },
    ligneProduit: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600], marginBottom: 2 },
    actions: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 12, gap: 8 },
    actionBtn: {
        paddingHorizontal: 14, paddingVertical: 8, borderRadius: rayons.md,
        backgroundColor: couleurs.primaire.clair,
    },
    actionBtnDanger: { backgroundColor: couleurs.erreur.clair },
    actionBtnTexte: { fontSize: typographie.legende.taille, fontWeight: '600', color: couleurs.primaire.fonce },
    actionBtnTexteDanger: { color: couleurs.erreur.fonce },
});
