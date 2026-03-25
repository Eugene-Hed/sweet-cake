// =============================================================================
// Sweet-Cake Mobile — Composant ChampSaisie
// =============================================================================

import React, { useState } from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { couleurs, rayons, espacements, typographie } from '@sweet-cake/shared';

interface ChampSaisieProps extends Omit<TextInputProps, 'style'> {
    label?: string;
    erreur?: string;
    iconeGauche?: React.ReactNode;
}

export default function ChampSaisie({ label, erreur, iconeGauche, ...props }: ChampSaisieProps) {
    const [estFocus, setEstFocus] = useState(false);

    const bordure = erreur
        ? couleurs.erreur.defaut
        : estFocus
            ? couleurs.primaire.defaut
            : couleurs.gris[300];

    return (
        <View style={styles.conteneur}>
            {label && <Text style={styles.label}>{label}</Text>}
            <View style={[styles.champConteneur, { borderColor: bordure }]}>
                {iconeGauche && <View style={styles.icone}>{iconeGauche}</View>}
                <TextInput
                    style={styles.input}
                    placeholderTextColor={couleurs.gris[400]}
                    onFocus={() => setEstFocus(true)}
                    onBlur={() => setEstFocus(false)}
                    {...props}
                />
            </View>
            {erreur && <Text style={styles.erreur}>{erreur}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        marginBottom: espacements.md,
    },
    label: {
        fontSize: typographie.texte_secondaire.taille,
        fontWeight: '600',
        color: couleurs.gris[700],
        marginBottom: espacements.xs,
    },
    champConteneur: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: rayons.md,
        backgroundColor: couleurs.blanc,
        height: 48,
        paddingHorizontal: espacements.md_sm,
    },
    icone: {
        marginRight: espacements.sm,
    },
    input: {
        flex: 1,
        fontSize: typographie.texte_corps.taille,
        color: couleurs.gris[900],
    },
    erreur: {
        fontSize: typographie.legende.taille,
        color: couleurs.erreur.defaut,
        marginTop: espacements.xs,
    },
});
