// =============================================================================
// Sweet-Cake Mobile — Composant Bouton (Design Premium)
// =============================================================================

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
    icone?: React.ReactNode;
}

const CONFIGS_VARIANTES = {
    primaire: {
        gradient: [couleurs.primaire.defaut, couleurs.primaire.fonce] as const,
        texte: couleurs.blanc,
        bordure: 'transparent',
        ombre: couleurs.primaire.defaut,
    },
    secondaire: {
        gradient: null,
        texte: couleurs.primaire.defaut,
        bordure: couleurs.primaire.clair,
        ombre: 'transparent',
    },
    danger: {
        gradient: [couleurs.erreur.defaut, couleurs.erreur.fonce] as const,
        texte: couleurs.blanc,
        bordure: 'transparent',
        ombre: couleurs.erreur.defaut,
    },
    fantome: {
        gradient: null,
        texte: couleurs.gris[600],
        bordure: 'transparent',
        ombre: 'transparent',
    },
};

const HAUTEURS: Record<TailleBouton, number> = { sm: 40, md: 50, lg: 56 };
const FONT_SIZES: Record<TailleBouton, number> = { sm: 13, md: 15, lg: 17 };

export default function Bouton({
    titre,
    onPress,
    variante = 'primaire',
    taille = 'md',
    desactive = false,
    chargement = false,
    pleineLargeur = false,
    style,
    icone,
}: BoutonProps) {
    const config = CONFIGS_VARIANTES[variante];
    const hauteur = HAUTEURS[taille];

    const contenu = (
        <>
            {chargement ? (
                <ActivityIndicator color={config.texte} size="small" />
            ) : (
                <>
                    {icone}
                    <Text
                        style={[
                            styles.texte,
                            { color: config.texte, fontSize: FONT_SIZES[taille] },
                            icone ? { marginLeft: 8 } : undefined,
                        ]}
                    >
                        {titre}
                    </Text>
                </>
            )}
        </>
    );

    const boutonStyle = [
        styles.base,
        {
            height: hauteur,
            borderColor: config.bordure,
            borderWidth: variante === 'secondaire' ? 1.5 : 0,
            opacity: desactive ? 0.5 : 1,
            ...(!config.gradient && { backgroundColor: variante === 'secondaire' ? couleurs.primaire.clair + '20' : 'transparent' }),
        },
        config.gradient && config.ombre !== 'transparent' && Platform.select({
            ios: {
                shadowColor: config.ombre,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
            },
            android: { elevation: 4 },
        }),
        pleineLargeur && styles.pleineLargeur,
        style,
    ];

    if (config.gradient) {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={desactive || chargement}
                activeOpacity={0.8}
                style={[pleineLargeur && styles.pleineLargeur, style]}
            >
                <LinearGradient
                    colors={[...config.gradient]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[
                        styles.base,
                        styles.gradient,
                        {
                            height: hauteur,
                            opacity: desactive ? 0.5 : 1,
                        },
                        config.ombre !== 'transparent' && Platform.select({
                            ios: {
                                shadowColor: config.ombre,
                                shadowOffset: { width: 0, height: 4 },
                                shadowOpacity: 0.3,
                                shadowRadius: 8,
                            },
                            android: { elevation: 4 },
                        }),
                    ]}
                >
                    {contenu}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={desactive || chargement}
            activeOpacity={0.7}
            style={boutonStyle}
        >
            {contenu}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    base: {
        borderRadius: 14,
        paddingHorizontal: espacements.lg,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
    },
    gradient: {
        borderRadius: 14,
    },
    texte: {
        fontWeight: '700',
        letterSpacing: 0.3,
    },
    pleineLargeur: {
        width: '100%',
    },
});
