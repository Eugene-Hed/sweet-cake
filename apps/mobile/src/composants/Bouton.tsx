// =============================================================================
// Sweet-Cake Mobile — Composant Bouton
// =============================================================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { couleurs, rayons, espacements, typographie } from '@sweet-cake/shared';

type VarianteBouton = 'primaire' | 'secondaire' | 'danger' | 'fantome';
type TailleBouton = 'sm' | 'md' | 'lg';

interface BoutonProps {
    titre: string;
    onPress: () => void;
    variante?: VarianteBouton;
    taille?: TailleBouton;
    desactive?: boolean;
    chargement?: boolean;
    pleineLargeur?: boolean;
    style?: ViewStyle;
}

const CONFIGS_VARIANTES = {
    primaire: {
        fond: couleurs.primaire.defaut,
        texte: couleurs.blanc,
        bordure: 'transparent',
    },
    secondaire: {
        fond: 'transparent',
        texte: couleurs.primaire.defaut,
        bordure: couleurs.primaire.defaut,
    },
    danger: {
        fond: couleurs.erreur.defaut,
        texte: couleurs.blanc,
        bordure: 'transparent',
    },
    fantome: {
        fond: 'transparent',
        texte: couleurs.gris[700],
        bordure: 'transparent',
    },
};

const HAUTEURS: Record<TailleBouton, number> = { sm: 36, md: 44, lg: 52 };

export default function Bouton({
    titre,
    onPress,
    variante = 'primaire',
    taille = 'md',
    desactive = false,
    chargement = false,
    pleineLargeur = false,
    style,
}: BoutonProps) {
    const config = CONFIGS_VARIANTES[variante];

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={desactive || chargement}
            activeOpacity={0.7}
            style={[
                styles.base,
                {
                    backgroundColor: config.fond,
                    borderColor: config.bordure,
                    borderWidth: variante === 'secondaire' ? 1.5 : 0,
                    height: HAUTEURS[taille],
                    opacity: desactive ? 0.5 : 1,
                },
                pleineLargeur && styles.pleineLargeur,
                style,
            ]}
        >
            {chargement ? (
                <ActivityIndicator color={config.texte} size="small" />
            ) : (
                <Text style={[styles.texte, { color: config.texte }]}>{titre}</Text>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: rayons.md,
        paddingHorizontal: espacements.lg,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    texte: {
        fontSize: typographie.texte_bouton.taille,
        fontWeight: '600',
    },
    pleineLargeur: {
        width: '100%',
    },
});
