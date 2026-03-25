// =============================================================================
// Sweet-Cake Mobile — Composant EnteteSection
// =============================================================================

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { couleurs, espacements, typographie } from '@sweet-cake/shared';

interface EnteteSectionProps {
    titre: string;
    actionTexte?: string;
    onAction?: () => void;
}

export default function EnteteSection({ titre, actionTexte, onAction }: EnteteSectionProps) {
    return (
        <View style={styles.conteneur}>
            <Text style={styles.titre}>{titre}</Text>
            {actionTexte && onAction && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={styles.action}>{actionTexte}</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: espacements.md,
        marginTop: espacements.lg,
    },
    titre: {
        fontSize: typographie.sous_titre.taille,
        fontWeight: '700',
        color: couleurs.gris[900],
    },
    action: {
        fontSize: typographie.texte_secondaire.taille,
        color: couleurs.primaire.defaut,
        fontWeight: '600',
    },
});
