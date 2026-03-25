// =============================================================================
// Sweet-Cake Mobile — Composant Chargement
// =============================================================================

import React from 'react';
import { View, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { couleurs, typographie, espacements } from '@sweet-cake/shared';

interface ChargementProps {
    message?: string;
    taille?: 'small' | 'large';
}

export default function Chargement({ message = 'Chargement...', taille = 'large' }: ChargementProps) {
    return (
        <View style={styles.conteneur}>
            <ActivityIndicator size={taille} color={couleurs.primaire.defaut} />
            <Text style={styles.message}>{message}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: espacements.xl,
    },
    message: {
        marginTop: espacements.md,
        fontSize: typographie.texte_secondaire.taille,
        color: couleurs.gris[500],
    },
});
