// =============================================================================
// Sweet-Cake Mobile — Détails du Produit
// =============================================================================

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Platform, Alert } from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api, { obtenirImageUri } from '../../../src/services/api';
import Bouton from '../../../src/composants/Bouton';
import Chargement from '../../../src/composants/Chargement';
import { usePanierStore } from '../../../src/stores/panier.store';

export default function DetailsProduit() {
    const { id } = useLocalSearchParams();
    const [produit, setProduit] = useState<any>(null);
    const [chargement, setChargement] = useState(true);
    const [quantite, setQuantite] = useState(1);
    const [optionsChoisies, setOptionsChoisies] = useState<Record<string, string>>({});
    const ajouterAuPanier = usePanierStore((s) => s.ajouter);

    useEffect(() => {
        const charger = async () => {
            try {
                const { data } = await api.get(`/produits/${id}`);
                setProduit(data.donnees);
                if (data.donnees.options_produit?.length > 0) {
                    const defaut: Record<string, string> = {};
                    data.donnees.options_produit.forEach((o: any) => {
                        const vals = o.valeurs.split(',').map((v: string) => v.trim());
                        if (vals.length > 0) defaut[o.nom] = vals[0];
                    });
                    setOptionsChoisies(defaut);
                }
            } catch (err) {
                console.error('Erreur chargement produit:', err);
                Alert.alert('Erreur', 'Impossible de charger les détails du produit.');
                router.back();
            } finally {
                setChargement(false);
            }
        };
        charger();
    }, [id]);

    const handleAjouter = () => {
        if (!produit) return;
        ajouterAuPanier({
            produit_id: produit.id,
            nom: produit.nom,
            prix: Number(produit.prix),
            image_url: produit.image_url,
            options_choisies: optionsChoisies,
        }, quantite);
        Alert.alert('✅ Ajouté !', `${quantite}x ${produit.nom} ajouté(s) au panier.`, [
            { text: 'Continuer les achats', style: 'cancel' },
            { text: 'Voir le panier', onPress: () => router.push('/(client)/panier') },
        ]);
    };

    if (chargement) return <Chargement />;
    if (!produit) return null;

    return (
        <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>
            {/* Header avec Image */}
            <View style={styles.imageConteneur}>
                <Image
                    source={produit.image_url
                        ? { uri: obtenirImageUri(produit.image_url) || undefined }
                        : require('../../../assets/logo.png')
                    }
                    style={styles.image}
                    resizeMode="cover"
                />
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.6)']}
                    style={styles.imageOverlay}
                />
                <TouchableOpacity style={styles.retourBtn} onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={24} color={couleurs.blanc} />
                </TouchableOpacity>
            </View>

            {/* Corps */}
            <View style={styles.corps}>
                <View style={styles.enteteInfo}>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.categorie}>{produit.categorie?.nom}</Text>
                        <Text style={styles.nom}>{produit.nom}</Text>
                    </View>
                    <Text style={styles.prix}>{Number(produit.prix).toLocaleString()} FCFA</Text>
                </View>

                {/* Description */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitre}>Description</Text>
                    <Text style={styles.description}>
                        {produit.description || "Une délicieuse création artisanale de Sweet-Cake by MK, préparée avec des ingrédients frais et locaux. Idéal pour vos moments de gourmandise."}
                    </Text>
                </View>

                {/* Avantages */}
                <View style={styles.avantages}>
                    <View style={styles.avantage}>
                        <Ionicons name="leaf-outline" size={20} color={couleurs.succes.defaut} />
                        <Text style={styles.avantageTexte}>Frais & Naturel</Text>
                    </View>
                    <View style={styles.avantage}>
                        <Ionicons name="heart-outline" size={20} color={couleurs.primaire.defaut} />
                        <Text style={styles.avantageTexte}>Fait Main</Text>
                    </View>
                    <View style={styles.avantage}>
                        <Ionicons name="bicycle-outline" size={20} color={couleurs.secondaire.fonce} />
                        <Text style={styles.avantageTexte}>Retrait rapide</Text>
                    </View>
                </View>

                {/* Options de Personnalisation */}
                {produit.options_produit?.map((opt: any) => (
                    <View key={opt.id} style={styles.section}>
                        <View style={styles.enteteOption}>
                            <Text style={styles.sectionTitre}>{opt.nom}</Text>
                            {opt.est_obligatoire && <Text style={styles.obligatoire}>Requis</Text>}
                        </View>
                        <View style={styles.optionsChips}>
                            {opt.valeurs.split(',').map((valRaw: string) => {
                                const val = valRaw.trim();
                                const estSelectionne = optionsChoisies[opt.nom] === val;
                                return (
                                    <TouchableOpacity
                                        key={val}
                                        style={[styles.optionChip, estSelectionne && styles.optionChipActive]}
                                        onPress={() => setOptionsChoisies({ ...optionsChoisies, [opt.nom]: val })}
                                    >
                                        <Text style={[styles.optionChipTexte, estSelectionne && styles.optionChipTexteActive]}>
                                            {val}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </View>
                    </View>
                ))}

                {/* Sélection Quantité */}
                <View style={styles.quantiteSection}>
                    <Text style={styles.sectionTitre}>Quantité</Text>
                    <View style={styles.quantiteSelecteur}>
                        <TouchableOpacity
                            style={styles.quantiteBtn}
                            onPress={() => setQuantite(Math.max(1, quantite - 1))}
                        >
                            <Ionicons name="remove" size={20} color={couleurs.gris[700]} />
                        </TouchableOpacity>
                        <Text style={styles.quantiteValeur}>{quantite}</Text>
                        <TouchableOpacity
                            style={[styles.quantiteBtn, styles.quantiteBtnAction]}
                            onPress={() => setQuantite(quantite + 1)}
                        >
                            <Ionicons name="add" size={20} color={couleurs.blanc} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

            {/* Footer Fixe (ou fin de scroll) */}
            <View style={styles.footer}>
                <Bouton
                    titre="Ajouter au panier"
                    onPress={handleAjouter}
                    pleineLargeur
                    taille="lg"
                    icone={<Ionicons name="cart" size={24} color={couleurs.blanc} />}
                />
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: couleurs.blanc,
    },
    imageConteneur: {
        width: '100%',
        height: 350,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    imageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
    },
    retourBtn: {
        position: 'absolute',
        top: Platform.OS === 'ios' ? 60 : 40,
        left: 20,
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: 'rgba(0,0,0,0.3)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    corps: {
        flex: 1,
        backgroundColor: couleurs.blanc,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        marginTop: -32,
        padding: 24,
    },
    enteteInfo: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    categorie: {
        fontSize: 13,
        fontWeight: '700',
        color: couleurs.primaire.defaut,
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4,
    },
    nom: {
        fontSize: 26,
        fontWeight: '800',
        color: couleurs.gris[900],
    },
    prix: {
        fontSize: 22,
        fontWeight: '900',
        color: couleurs.primaire.defaut,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitre: {
        fontSize: 17,
        fontWeight: '700',
        color: couleurs.gris[900],
        marginBottom: 10,
    },
    description: {
        fontSize: 15,
        color: couleurs.gris[600],
        lineHeight: 24,
    },
    avantages: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: couleurs.gris[50],
        borderRadius: 20,
        padding: 16,
        marginBottom: 24,
    },
    avantage: {
        alignItems: 'center',
        gap: 6,
    },
    avantageTexte: {
        fontSize: 11,
        fontWeight: '600',
        color: couleurs.gris[700],
    },
    quantiteSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
    },
    quantiteSelecteur: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: couleurs.gris[100],
        borderRadius: 16,
        padding: 6,
    },
    quantiteBtn: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: couleurs.blanc,
        justifyContent: 'center',
        alignItems: 'center',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 4 },
            android: { elevation: 2 },
        }),
    },
    quantiteBtnAction: {
        backgroundColor: couleurs.primaire.defaut,
    },
    quantiteValeur: {
        fontSize: 18,
        fontWeight: '700',
        marginHorizontal: 16,
        color: couleurs.gris[900],
        minWidth: 24,
        textAlign: 'center',
    },
    footer: {
        padding: 24,
        borderTopWidth: 1,
        borderTopColor: couleurs.gris[100],
    },
    enteteOption: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 10 },
    obligatoire: { fontSize: 11, fontWeight: '700', color: couleurs.erreur.defaut, textTransform: 'uppercase', backgroundColor: couleurs.erreur.clair + '20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
    optionsChips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    optionChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, backgroundColor: couleurs.gris[100], borderWidth: 1, borderColor: couleurs.gris[200] },
    optionChipActive: { backgroundColor: couleurs.primaire.defaut, borderColor: couleurs.primaire.defaut },
    optionChipTexte: { fontSize: 14, fontWeight: '600', color: couleurs.gris[700] },
    optionChipTexteActive: { color: couleurs.blanc },
});
