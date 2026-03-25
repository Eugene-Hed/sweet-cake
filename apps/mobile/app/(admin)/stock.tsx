// =============================================================================
// Sweet-Cake Mobile — Gestion Stock Admin
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, TextInput, RefreshControl } from 'react-native';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../src/services/api';
import Badge from '../../src/composants/Badge';
import Chargement from '../../src/composants/Chargement';

export default function StockAdmin() {
    const [articles, setArticles] = useState<any[]>([]);
    const [alertes, setAlertes] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);
    const [mouvementOuvert, setMouvementOuvert] = useState<number | null>(null);
    const [quantiteMouvement, setQuantiteMouvement] = useState('');

    const charger = async () => {
        try {
            const [resArticles, resAlertes] = await Promise.all([
                api.get('/articles-stock'),
                api.get('/alertes-stock').catch(() => ({ data: { donnees: [] } })),
            ]);
            setArticles(resArticles.data.donnees || []);
            setAlertes(resAlertes.data.donnees || []);
        } catch (err) {
            console.error('Erreur stock admin:', err);
        } finally {
            setChargement(false);
        }
    };

    useEffect(() => { charger(); }, []);

    const ajouterMouvement = async (articleId: number, type: string) => {
        const qte = parseInt(quantiteMouvement);
        if (!qte || qte <= 0) {
            Alert.alert('Erreur', 'Entrez une quantité valide');
            return;
        }
        try {
            await api.post(`/articles-stock/${articleId}/mouvements`, {
                type_mouvement: type,
                quantite: qte,
                raison: `Mouvement ${type} depuis l'app mobile`,
            });
            Alert.alert('✅', `${type === 'entree' ? 'Entrée' : 'Sortie'} de ${qte} unité(s)`);
            setMouvementOuvert(null);
            setQuantiteMouvement('');
            charger();
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Mouvement impossible');
        }
    };

    if (chargement) return <Chargement />;

    return (
        <ScrollView
            style={styles.conteneur}
            refreshControl={<RefreshControl refreshing={false} onRefresh={charger} tintColor={couleurs.secondaire.defaut} />}
        >
            {/* Alertes */}
            {alertes.length > 0 && (
                <View style={styles.alerteBanniere}>
                    <Text style={styles.alerteTitre}>⚠️ Alertes stock faible ({alertes.length})</Text>
                    {alertes.map((a: any) => (
                        <Text key={a.id} style={styles.alerteItem}>
                            • {a.nom} : {a.quantite_actuelle} / seuil {a.seuil_alerte}
                        </Text>
                    ))}
                </View>
            )}

            <View style={styles.padding}>
                {articles.map((article) => {
                    const estFaible = article.quantite_actuelle <= (article.seuil_alerte || 0);
                    const estOuvert = mouvementOuvert === article.id;

                    return (
                        <TouchableOpacity
                            key={article.id}
                            style={styles.carte}
                            onPress={() => {
                                setMouvementOuvert(estOuvert ? null : article.id);
                                setQuantiteMouvement('');
                            }}
                            activeOpacity={0.8}
                        >
                            <View style={styles.entete}>
                                <View style={{ flex: 1 }}>
                                    <Text style={styles.nom}>{article.nom}</Text>
                                    <Text style={styles.unite}>{article.unite || 'unité'}</Text>
                                </View>
                                <View style={styles.stockInfo}>
                                    <Text style={[styles.quantite, estFaible && styles.quantiteFaible]}>
                                        {article.quantite_actuelle}
                                    </Text>
                                    {estFaible && <Badge texte="Stock faible" variante="erreur" />}
                                </View>
                            </View>

                            {/* Panel mouvement */}
                            {estOuvert && (
                                <View style={styles.mouvementPanel}>
                                    <Text style={styles.mouvementTitre}>Nouveau mouvement</Text>
                                    <TextInput
                                        style={styles.mouvementInput}
                                        placeholder="Quantité"
                                        value={quantiteMouvement}
                                        onChangeText={setQuantiteMouvement}
                                        keyboardType="numeric"
                                        placeholderTextColor={couleurs.gris[400]}
                                    />
                                    <View style={styles.mouvementActions}>
                                        <TouchableOpacity
                                            style={[styles.mouvementBtn, styles.mouvementEntree]}
                                            onPress={() => ajouterMouvement(article.id, 'entree')}
                                        >
                                            <Text style={styles.mouvementBtnTexte}>+ Entrée</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.mouvementBtn, styles.mouvementSortie]}
                                            onPress={() => ajouterMouvement(article.id, 'sortie')}
                                        >
                                            <Text style={styles.mouvementBtnTexte}>− Sortie</Text>
                                        </TouchableOpacity>
                                    </View>
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
    alerteBanniere: {
        backgroundColor: couleurs.avertissement.clair,
        padding: espacements.md,
        margin: espacements.md,
        borderRadius: rayons.md,
        borderWidth: 1,
        borderColor: couleurs.avertissement.defaut,
    },
    alerteTitre: { fontSize: typographie.texte_secondaire.taille, fontWeight: '700', color: couleurs.avertissement.fonce, marginBottom: 4 },
    alerteItem: { fontSize: typographie.legende.taille, color: couleurs.avertissement.fonce, marginTop: 2 },
    carte: {
        backgroundColor: couleurs.blanc, borderRadius: rayons.lg,
        padding: espacements.md, marginBottom: espacements.md,
        borderWidth: 1, borderColor: couleurs.gris[200],
    },
    entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
    nom: { fontSize: typographie.texte_corps.taille, fontWeight: '700', color: couleurs.gris[900] },
    unite: { fontSize: typographie.legende.taille, color: couleurs.gris[500], marginTop: 2 },
    stockInfo: { alignItems: 'flex-end' },
    quantite: { fontSize: typographie.titre_secondaire.taille, fontWeight: '700', color: couleurs.gris[900] },
    quantiteFaible: { color: couleurs.erreur.defaut },
    mouvementPanel: { marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: couleurs.gris[200] },
    mouvementTitre: { fontSize: typographie.texte_secondaire.taille, fontWeight: '600', color: couleurs.gris[700], marginBottom: 8 },
    mouvementInput: {
        borderWidth: 1, borderColor: couleurs.gris[300], borderRadius: rayons.md,
        padding: espacements.md_sm, fontSize: typographie.texte_corps.taille,
        color: couleurs.gris[900], backgroundColor: couleurs.gris[50], marginBottom: 8,
    },
    mouvementActions: { flexDirection: 'row', gap: 8 },
    mouvementBtn: { flex: 1, paddingVertical: 10, borderRadius: rayons.md, alignItems: 'center' },
    mouvementEntree: { backgroundColor: couleurs.succes.defaut },
    mouvementSortie: { backgroundColor: couleurs.erreur.defaut },
    mouvementBtnTexte: { color: couleurs.blanc, fontWeight: '700', fontSize: typographie.texte_secondaire.taille },
});
