// =============================================================================
// Sweet-Cake Mobile — Composant Carte (Design Premium)
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ViewStyle, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { couleurs, rayons, espacements, typographie, ombres } from '@sweet-cake/shared';
import { obtenirImageUri } from '../services/api';

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
            activeOpacity={onPress ? 0.85 : 1}
            style={[styles.carte, style]}
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
                    <Image source={{ uri: obtenirImageUri(image_url) || undefined }} style={styles.image} />
                ) : (
                    <View style={[styles.image, styles.imagePlaceholder]}>
                        <Text style={styles.imagePlaceholderTexte}>🍰</Text>
                    </View>
                )}
                {/* Badge catégorie */}
                {categorie && (
                    <View style={styles.categorieBadge}>
                        <Text style={styles.categorieBadgeTexte}>{categorie}</Text>
                    </View>
                )}
            </View>
            <View style={styles.produitInfo}>
                <Text style={styles.produitNom} numberOfLines={1}>{nom}</Text>
                <View style={styles.prixLigne}>
                    <Text style={styles.produitPrix}>{prix.toLocaleString()} FCFA</Text>
                    <View style={styles.ajouterBtn}>
                        <Ionicons name="add" size={16} color={couleurs.blanc} />
                    </View>
                </View>
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
            <View style={[styles.statIconeWrapper, { backgroundColor: (couleurIcone || couleurs.primaire.defaut) + '15' }]}>
                <Text style={styles.statIcone}>{icone}</Text>
            </View>
            <Text style={styles.statValeur}>{valeur}</Text>
            <Text style={styles.statTitre}>{titre}</Text>
        </Carte>
    );
}

const styles = StyleSheet.create({
    carte: {
        backgroundColor: couleurs.blanc,
        borderRadius: 16,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.06,
                shadowRadius: 8,
            },
            android: { elevation: 3 },
        }),
    },
    // Carte produit
    carteProduit: {
        overflow: 'hidden',
        width: '48%',
        marginBottom: espacements.md,
    },
    imageConteneur: {
        width: '100%',
        height: 130,
        position: 'relative',
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
    categorieBadge: {
        position: 'absolute',
        top: 8,
        left: 8,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 8,
    },
    categorieBadgeTexte: {
        fontSize: 10,
        fontWeight: '700',
        color: couleurs.primaire.defaut,
        letterSpacing: 0.3,
    },
    produitInfo: {
        padding: 12,
    },
    produitNom: {
        fontSize: 14,
        fontWeight: '600',
        color: couleurs.gris[900],
        marginBottom: 6,
    },
    prixLigne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    produitPrix: {
        fontSize: 15,
        fontWeight: '800',
        color: couleurs.primaire.defaut,
    },
    ajouterBtn: {
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: couleurs.primaire.defaut,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Carte statistique
    carteStat: {
        alignItems: 'center',
        width: '48%',
        marginBottom: espacements.md,
        paddingVertical: espacements.lg,
        paddingHorizontal: espacements.md,
    },
    statIconeWrapper: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    statIcone: {
        fontSize: 24,
    },
    statValeur: {
        fontSize: 22,
        fontWeight: '800',
        color: couleurs.gris[900],
    },
    statTitre: {
        fontSize: 12,
        color: couleurs.gris[500],
        marginTop: 4,
        fontWeight: '500',
    },
});
