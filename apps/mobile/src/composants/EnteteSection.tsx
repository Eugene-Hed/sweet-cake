// =============================================================================
// Sweet-Cake Mobile — Composant EnteteSection (Design Premium)
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
            <View style={styles.titreLigne}>
                <View style={styles.indicateur} />
                <Text style={styles.titre}>{titre}</Text>
            </View>
            {actionTexte && onAction && (
                <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
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
        marginBottom: 14,
        marginTop: 20,
    },
    titreLigne: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    indicateur: {
        width: 4,
        height: 20,
        borderRadius: 2,
        backgroundColor: couleurs.primaire.defaut,
        marginRight: 10,
    },
    titre: {
        fontSize: 18,
        fontWeight: '800',
        color: couleurs.gris[900],
        letterSpacing: 0.2,
    },
    action: {
        fontSize: 13,
        color: couleurs.primaire.defaut,
        fontWeight: '700',
    },
});
