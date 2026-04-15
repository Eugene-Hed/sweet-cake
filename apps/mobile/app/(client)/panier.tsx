// =============================================================================
// Sweet-Cake Mobile — Écran Panier Client (Design Premium)
// =============================================================================

import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
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
                options_choisies: a.options_choisies,
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
                <View style={styles.videIconeWrapper}>
                    <Ionicons name="cart-outline" size={56} color={couleurs.gris[300]} />
                </View>
                <Text style={styles.videTitre}>Votre panier est vide</Text>
                <Text style={styles.videTexte}>Parcourez notre catalogue pour ajouter de délicieuses pâtisseries</Text>
                <Bouton
                    titre="Voir le catalogue"
                    onPress={() => router.push('/(client)/catalogue')}
                    taille="lg"
                    style={{ marginTop: 24 }}
                    icone={<Ionicons name="storefront-outline" size={20} color={couleurs.blanc} />}
                />
            </View>
        );
    }

    return (
        <View style={styles.conteneur}>
            <ScrollView style={styles.liste} showsVerticalScrollIndicator={false}>
                {/* Entête */}
                <View style={styles.entete}>
                    <Text style={styles.enteteTitre}>{nombreArticles()} article{nombreArticles() > 1 ? 's' : ''}</Text>
                    <TouchableOpacity onPress={() => {
                        Alert.alert('Vider le panier', 'Êtes-vous sûr ?', [
                            { text: 'Annuler', style: 'cancel' },
                            { text: 'Vider', style: 'destructive', onPress: vider },
                        ]);
                    }}>
                        <Text style={styles.viderTexte}>Tout supprimer</Text>
                    </TouchableOpacity>
                </View>

                {articles.map((article) => (
                    <View key={article.produit_id} style={styles.articleCarte}>
                        <View style={styles.articleEmoji}>
                            <Text style={{ fontSize: 28 }}>🍰</Text>
                        </View>
                        <View style={styles.articleInfo}>
                            <Text style={styles.articleNom} numberOfLines={1}>{article.nom}</Text>
                            {article.options_choisies && Object.entries(article.options_choisies).length > 0 && (
                                <View style={styles.optionsListe}>
                                    {Object.entries(article.options_choisies).map(([label, valeur]) => (
                                        <Text key={label} style={styles.optionItemTexte}>
                                            {label}: <Text style={{ color: couleurs.gris[800] }}>{valeur}</Text>
                                        </Text>
                                    ))}
                                </View>
                            )}
                            <Text style={styles.articlePrix}>{article.prix.toLocaleString()} FCFA</Text>
                        </View>
                        <View style={styles.quantiteConteneur}>
                            <TouchableOpacity
                                style={styles.quantiteBtn}
                                onPress={() => modifierQuantite(article.produit_id, article.quantite - 1, article.options_choisies)}
                            >
                                <Ionicons name="remove" size={16} color={couleurs.gris[700]} />
                            </TouchableOpacity>
                            <Text style={styles.quantiteValeur}>{article.quantite}</Text>
                            <TouchableOpacity
                                style={[styles.quantiteBtn, styles.quantiteBtnPlus]}
                                onPress={() => modifierQuantite(article.produit_id, article.quantite + 1, article.options_choisies)}
                            >
                                <Ionicons name="add" size={16} color={couleurs.blanc} />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity
                            onPress={() => retirer(article.produit_id, article.options_choisies)}
                            style={styles.supprimerBtn}
                        >
                            <Ionicons name="trash-outline" size={18} color={couleurs.erreur.defaut} />
                        </TouchableOpacity>
                    </View>
                ))}
            </ScrollView>

            {/* Résumé premium */}
            <View style={styles.resume}>
                <View style={styles.resumeLigne}>
                    <Text style={styles.resumeLabel}>Sous-total</Text>
                    <Text style={styles.resumeValeur}>{total().toLocaleString()} FCFA</Text>
                </View>
                <View style={styles.resumeLigne}>
                    <Text style={styles.resumeLabel}>Livraison</Text>
                    <Text style={[styles.resumeValeur, { color: couleurs.succes.defaut }]}>Retrait gratuit</Text>
                </View>
                <View style={styles.totalLigne}>
                    <Text style={styles.totalLabel}>Total</Text>
                    <Text style={styles.totalValeur}>{total().toLocaleString()} FCFA</Text>
                </View>
                <Bouton
                    titre="Commander maintenant"
                    onPress={passerCommande}
                    pleineLargeur
                    taille="lg"
                    icone={<Ionicons name="checkmark-circle" size={20} color={couleurs.blanc} />}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    liste: { flex: 1, padding: 16 },
    entete: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    enteteTitre: { fontSize: 16, fontWeight: '700', color: couleurs.gris[900] },
    viderTexte: { fontSize: 13, color: couleurs.erreur.defaut, fontWeight: '600' },
    articleCarte: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: couleurs.blanc,
        borderRadius: 16,
        padding: 14,
        marginBottom: 10,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 2 },
        }),
    },
    articleEmoji: {
        width: 52,
        height: 52,
        backgroundColor: couleurs.secondaire.clair + '60',
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    articleInfo: { flex: 1 },
    articleNom: { fontSize: 14, fontWeight: '600', color: couleurs.gris[900], marginBottom: 2 },
    optionsListe: { marginBottom: 4 },
    optionItemTexte: { fontSize: 11, color: couleurs.gris[500], fontWeight: '500' },
    articlePrix: { fontSize: 13, color: couleurs.primaire.defaut, fontWeight: '700' },
    quantiteConteneur: { flexDirection: 'row', alignItems: 'center', marginRight: 10 },
    quantiteBtn: {
        width: 30,
        height: 30,
        borderRadius: 10,
        backgroundColor: couleurs.gris[100],
        justifyContent: 'center',
        alignItems: 'center',
    },
    quantiteBtnPlus: {
        backgroundColor: couleurs.primaire.defaut,
    },
    quantiteValeur: {
        fontSize: 15,
        fontWeight: '700',
        marginHorizontal: 10,
        color: couleurs.gris[900],
        minWidth: 20,
        textAlign: 'center',
    },
    supprimerBtn: {
        padding: 6,
    },
    // Résumé
    resume: {
        backgroundColor: couleurs.blanc,
        padding: 20,
        paddingBottom: 28,
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: -4 },
                shadowOpacity: 0.06,
                shadowRadius: 12,
            },
            android: { elevation: 8 },
        }),
    },
    resumeLigne: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    resumeLabel: { fontSize: 14, color: couleurs.gris[500], fontWeight: '500' },
    resumeValeur: { fontSize: 14, color: couleurs.gris[700], fontWeight: '600' },
    totalLigne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: couleurs.gris[100],
        paddingTop: 14,
        marginBottom: 18,
        marginTop: 4,
    },
    totalLabel: { fontSize: 18, fontWeight: '800', color: couleurs.gris[900] },
    totalValeur: { fontSize: 18, fontWeight: '800', color: couleurs.primaire.defaut },
    // Vide
    vide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 40,
        backgroundColor: couleurs.gris[50],
    },
    videIconeWrapper: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: couleurs.gris[100],
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    videTitre: { fontSize: 20, fontWeight: '800', color: couleurs.gris[900] },
    videTexte: { fontSize: 14, color: couleurs.gris[500], textAlign: 'center', marginTop: 8, lineHeight: 20 },
});
