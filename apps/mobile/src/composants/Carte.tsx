// =============================================================================
// Sweet-Cake Mobile — Composant Carte
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle } from 'react-native';
import { couleurs, rayons, espacements, typographie, ombres } from '@sweet-cake/shared';

interface CarteProps {
    children: React.ReactNode;
    onPress?: () => void;
    style?: ViewStyle;
}

export default function Carte({ children, onPress, style }: CarteProps) {
    const Composant = onPress ? TouchableOpacity : View;
    return (
        <Composant
            onPress={onPress}
            activeOpacity={onPress ? 0.7 : 1}
            style={[styles.carte, ombres.sm.rn, style]}
        >
            {children}
        </Composant>
    );
}

// ─── Variante : Carte Produit ────────────────────────────────────────────────

interface CarteProduitProps {
    nom: string;
    prix: number;
    image_url?: string;
    categorie?: string;
    onPress: () => void;
}

export function CarteProduit({ nom, prix, image_url, categorie, onPress }: CarteProduitProps) {
    return (
        <Carte onPress={onPress} style={styles.carteProduit}>
            <View style={styles.imageConteneur}>
                {image_url ? (
                    <Image source={{ uri: image_url }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={styles.imagePlaceholderTexte}>🍰</Text>
                    </View>
                )}
            </View>
            <View style={styles.produitInfo}>
                {categorie && <Text style={styles.categorie}>{categorie}</Text>}
                <Text style={styles.produitNom} numberOfLines={1}>{nom}</Text>
                <Text style={styles.produitPrix}>{prix.toFixed(2)} €</Text>
            </View>
        </Carte>
    );
}

// ─── Variante : Carte Statistique (dashboard admin) ──────────────────────────

interface CarteStatistiqueProps {
    titre: string;
    valeur: string | number;
    icone: string;
    couleurIcone?: string;
}

export function CarteStatistique({ titre, valeur, icone, couleurIcone }: CarteStatistiqueProps) {
    return (
        <Carte style={styles.carteStat}>
            <Text style={styles.statIcone}>{icone}</Text>
            <Text style={styles.statValeur}>{valeur}</Text>
            <Text style={styles.statTitre}>{titre}</Text>
        </Carte>
    );
}

const styles = StyleSheet.create({
    carte: {
        backgroundColor: couleurs.blanc,
        borderRadius: rayons.lg,
        padding: espacements.md,
        borderWidth: 1,
        borderColor: couleurs.gris[200],
    },
    // Carte produit
    carteProduit: {
        padding: 0,
        overflow: 'hidden',
        width: '48%',
        marginBottom: espacements.md,
    },
    imageConteneur: {
        width: '100%',
        height: 120,
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    imagePlaceholder: {
        backgroundColor: couleurs.secondaire.clair,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholderTexte: {
        fontSize: 40,
    },
    produitInfo: {
        padding: espacements.md_sm,
    },
    categorie: {
        fontSize: typographie.legende.taille,
        color: couleurs.primaire.defaut,
        fontWeight: '600',
        marginBottom: 2,
    },
    produitNom: {
        fontSize: typographie.texte_secondaire.taille,
        fontWeight: '600',
        color: couleurs.gris[900],
        marginBottom: 4,
    },
    produitPrix: {
        fontSize: typographie.texte_corps.taille,
        fontWeight: '700',
        color: couleurs.primaire.defaut,
    },
    // Carte statistique
    carteStat: {
        alignItems: 'center',
        width: '48%',
        marginBottom: espacements.md,
        paddingVertical: espacements.lg,
    },
    statIcone: {
        fontSize: 28,
        marginBottom: espacements.sm,
    },
    statValeur: {
        fontSize: typographie.titre_secondaire.taille,
        fontWeight: '700',
        color: couleurs.gris[900],
    },
    statTitre: {
        fontSize: typographie.legende.taille,
        color: couleurs.gris[500],
        marginTop: 4,
    },
});
