// =============================================================================
// Sweet-Cake Mobile — Composant ChampSaisie (Design Premium)
// =============================================================================

import React, { useState, useRef } from 'react';
import {
    View, TextInput, Text, StyleSheet, TextInputProps,
    Platform, TouchableWithoutFeedback
} from 'react-native';
import { couleurs, rayons, espacements, typographie } from '@sweet-cake/shared';

interface ChampSaisieProps extends TextInputProps {
    label?: string;
    erreur?: string;
    iconeGauche?: React.ReactNode;
    iconeDroite?: React.ReactNode;
}

export default function ChampSaisie({ label, erreur, iconeGauche, iconeDroite, style, ...props }: ChampSaisieProps) {
    const [estFocus, setEstFocus] = useState(false);
    const inputRef = useRef<TextInput>(null);

    const bordure = erreur
        ? '#ef4444'
        : estFocus
            ? '#b59a5d' // Gold premium au lieu du rose
            : '#e2e8f0';

    const fondChamp = estFocus ? '#ffffff' : '#f8fafc';

    return (
        <View style={styles.conteneur}>
            {label && <Text style={styles.label}>{label}</Text>}
            <TouchableWithoutFeedback onPress={() => inputRef.current?.focus()}>
                <View
                    style={[
                        styles.champConteneur,
                        {
                            borderColor: bordure,
                            backgroundColor: fondChamp,
                        },
                        estFocus && Platform.select({
                            ios: {
                                shadowColor: '#b59a5d',
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.1,
                                shadowRadius: 10,
                            },
                            android: { elevation: 2 },
                        }),
                    ]}
                >
                    {iconeGauche && <View style={styles.icone}>{iconeGauche}</View>}
                    <TextInput
                        ref={inputRef}
                        style={[styles.input, style]}
                        placeholderTextColor="#94a3b8"
                        onFocus={() => setEstFocus(true)}
                        onBlur={() => setEstFocus(false)}
                        selectionColor="#b59a5d"
                        {...props}
                    />
                    {iconeDroite && <View style={styles.iconeDroite}>{iconeDroite}</View>}
                </View>
            </TouchableWithoutFeedback>
            {erreur && <Text style={styles.erreur}>⚠ {erreur}</Text>}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        marginBottom: espacements.md,
    },
    label: {
        fontSize: 13,
        fontWeight: '700',
        color: '#64748b',
        marginBottom: 8,
        letterSpacing: 0.5,
        textTransform: 'uppercase'
    },
    champConteneur: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1.5,
        borderRadius: 16,
        minHeight: 56,
        paddingHorizontal: 16,
        backgroundColor: '#f8fafc',
    },
    icone: {
        marginRight: 10,
    },
    iconeDroite: {
        marginLeft: 10,
    },
    input: {
        flex: 1,
        fontSize: 15,
        color: '#1e293b',
        fontWeight: '600',
        paddingVertical: 12,
    },
    erreur: {
        fontSize: 12,
        color: couleurs.erreur.defaut,
        marginTop: 4,
        fontWeight: '500',
    },
});
