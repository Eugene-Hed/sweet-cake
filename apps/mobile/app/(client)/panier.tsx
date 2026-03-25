// =============================================================================
// Sweet-Cake Mobile — Écran Panier Client
// =============================================================================

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { router } from 'expo-router';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import { usePanierStore } from '../../src/stores/panier.store';
import api from '../../src/services/api';
import Bouton from '../../src/composants/Bouton';

export default function Panier() {
    const { articles, retirer, modifierQuantite, vider, total, nombreArticles } = usePanierStore();

    const passerCommande = async () => {
        if (articles.length === 0) return;
        try {
            const lignes = articles.map((a) => ({
                produit_id: a.produit_id,
                quantite: a.quantite,
            }));
            await api.post('/commandes', {
                type_commande: 'retrait',
                lignes,
            });
            vider();
            Alert.alert(
                '✅ Commande passée !',
                'Votre commande a été enregistrée avec succès.',
                [{ text: 'Voir mes commandes', onPress: () => router.push('/(client)/profil') }],
            );
        } catch (err: any) {
            Alert.alert('Erreur', err.response?.data?.message || 'Impossible de passer la commande');
        }
    };

    if (articles.length === 0) {
        return (
            <View style={styles.vide}>
                <Text style={styles.videIcone}>🛒</Text>
                <Text style={styles.videTitre}>Votre panier est vide</Text>
                <Text style={styles.videTexte}>Parcourez notre catalogue pour ajouter des pâtisseries</Text>
                <Bouton
                    titre="Voir le catalogue"
                    onPress={() => router.push('/(client)/catalogue')}
                    style={{ marginTop: espacements.lg }}
                />
            </View>
        );
    }

    return (
        <View style={styles.conteneur}>
            <ScrollView style={styles.liste}>
                {articles.map((article) => (
                    <View key={article.produit_id} style={styles.articleCarte}>
                        <View style={styles.articleEmoji}>
                            <Text style={{ fontSize: 32 }}>🍰</Text>
                        </View>
                        <View style={styles.articleInfo}>
                            <Text style={styles.articleNom} numberOfLines={1}>{article.nom}</Text>
                            <Text style={styles.articlePrix}>{article.prix.toFixed(2)} €</Text>
                        </View>
                        <View style={styles.quantiteConteneur}>
                            <TouchableOpacity
                                style={styles.quantiteBtn}
                                onPress={() => modifierQuantite(article.produit_id, article.quantite - 1)}
                            >
                                <Text style={styles.quantiteBtnTexte}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.quantiteValeur}>{article.quantite}</Text>
                            <TouchableOpacity
                                style={styles.quantiteBtn}
                                onPress={() => modifierQuantite(article.produit_id, article.quantite + 1)}
                            >
                                <Text style={styles.quantiteBtnTexte}>+</Text>
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity onPress={() => retirer(article.produit_id)}>
                            <Text style={styles.supprimer}>✕</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Résumé */}
            <View style={styles.resume}>
                <View style={styles.resumeLigne}>
                    <Text style={styles.resumeLabel}>Articles</Text>
                    <Text style={styles.resumeValeur}>{nombreArticles()}</Text>
                </View>
                <View style={[styles.resumeLigne, styles.resumeTotal]}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValeur}>{total().toFixed(2)} €</Text>
                </View>
                <Bouton titre="Commander" onPress={passerCommande} pleineLargeur />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    liste: { flex: 1, padding: espacements.md },
    articleCarte: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: couleurs.blanc,
        borderRadius: rayons.lg,
        padding: espacements.md_sm,
        marginBottom: espacements.sm,
        borderWidth: 1,
        borderColor: couleurs.gris[200],
    },
    articleEmoji: { width: 50, height: 50, backgroundColor: couleurs.secondaire.clair, borderRadius: rayons.md, justifyContent: 'center', alignItems: 'center', marginRight: espacements.md_sm },
    articleInfo: { flex: 1 },
    articleNom: { fontSize: typographie.texte_secondaire.taille, fontWeight: '600', color: couleurs.gris[900] },
    articlePrix: { fontSize: typographie.legende.taille, color: couleurs.primaire.defaut, fontWeight: '600', marginTop: 2 },
    quantiteConteneur: { flexDirection: 'row', alignItems: 'center', marginRight: espacements.md_sm },
    quantiteBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: couleurs.gris[100], justifyContent: 'center', alignItems: 'center' },
    quantiteBtnTexte: { fontSize: 16, fontWeight: '700', color: couleurs.gris[700] },
    quantiteValeur: { fontSize: typographie.texte_corps.taille, fontWeight: '600', marginHorizontal: 10, color: couleurs.gris[900] },
    supprimer: { fontSize: 16, color: couleurs.erreur.defaut, fontWeight: '700' },
    // Résumé
    resume: {
        backgroundColor: couleurs.blanc,
        padding: espacements.lg,
        borderTopWidth: 1,
        borderTopColor: couleurs.gris[200],
    },
    resumeLigne: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
    resumeLabel: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[600] },
    resumeValeur: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[900] },
    resumeTotal: { borderTopWidth: 1, borderTopColor: couleurs.gris[200], paddingTop: 12, marginBottom: 16 },
    totalLabel: { fontSize: typographie.sous_titre.taille, fontWeight: '700', color: couleurs.gris[900] },
    totalValeur: { fontSize: typographie.sous_titre.taille, fontWeight: '700', color: couleurs.primaire.defaut },
    // Vide
    vide: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: espacements['3xl'], backgroundColor: couleurs.gris[50] },
    videIcone: { fontSize: 64, marginBottom: espacements.md },
    videTitre: { fontSize: typographie.titre_secondaire.taille, fontWeight: '700', color: couleurs.gris[900] },
    videTexte: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[500], textAlign: 'center', marginTop: 8 },
});
