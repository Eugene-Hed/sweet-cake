// =============================================================================
// Sweet-Cake Mobile — Composant Badge
// =============================================================================

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { couleurs, rayons, espacements, typographie } from '@sweet-cake/shared';

type VarianteBadge = 'primaire' | 'succes' | 'erreur' | 'avertissement' | 'information' | 'neutre';

interface BadgeProps {
    texte: string;
    variante?: VarianteBadge;
}

const CONFIGS: Record<VarianteBadge, { fond: string; texte: string }> = {
    primaire: { fond: couleurs.primaire.clair, texte: couleurs.primaire.fonce },
    succes: { fond: couleurs.succes.clair, texte: couleurs.succes.fonce },
    erreur: { fond: couleurs.erreur.clair, texte: couleurs.erreur.fonce },
    avertissement: { fond: couleurs.avertissement.clair, texte: couleurs.avertissement.fonce },
    information: { fond: couleurs.information.clair, texte: couleurs.information.fonce },
    neutre: { fond: couleurs.gris[200], texte: couleurs.gris[700] },
};

/** Mapping statuts de commande → variantes de badge */
export const BADGE_STATUT_COMMANDE: Record<string, VarianteBadge> = {
    en_attente: 'avertissement',
    confirmee: 'information',
    en_preparation: 'primaire',
    prete: 'succes',
    terminee: 'succes',
    annulee: 'erreur',
};

export const BADGE_STATUT_RESERVATION: Record<string, VarianteBadge> = {
    en_attente: 'avertissement',
    confirmee: 'succes',
    annulee: 'erreur',
};

export default function Badge({ texte, variante = 'neutre' }: BadgeProps) {
    const config = CONFIGS[variante];
    return (
        <View style={[styles.badge, { backgroundColor: config.fond }]}>
            <Text style={[styles.texte, { color: config.texte }]}>{texte}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    badge: {
        borderRadius: rayons.complet,
        paddingHorizontal: espacements.sm,
        paddingVertical: 3,
        alignSelf: 'flex-start',
    },
    texte: {
        fontSize: typographie.legende.taille,
        fontWeight: '600',
    },
});
