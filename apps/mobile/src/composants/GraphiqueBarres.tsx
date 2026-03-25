import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { couleurs, rayons } from '@sweet-cake/shared';

interface DonneeBarre {
    label: string;
    valeur: number;
    couleur?: string;
}

interface GraphiqueBarresProps {
    donnees: DonneeBarre[];
    unite?: string;
}

export default function GraphiqueBarres({ donnees, unite = '' }: GraphiqueBarresProps) {
    const maxValeur = Math.max(...donnees.map(d => d.valeur), 1);

    return (
        <View style={styles.conteneur}>
            {donnees.map((item, index) => {
                const largeur = (item.valeur / maxValeur) * 100;

                return (
                    <View key={index} style={styles.barreLigne}>
                        <View style={styles.infoLigne}>
                            <Text style={styles.label}>{item.label}</Text>
                            <Text style={styles.valeur}>{item.valeur} {unite}</Text>
                        </View>
                        <View style={styles.pisteBarre}>
                            <View
                                style={[
                                    styles.remplissage,
                                    { width: `${largeur}%`, backgroundColor: item.couleur || couleurs.secondaire.defaut }
                                ]}
                            />
                        </View>
                    </View>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        width: '100%',
        gap: 16,
    },
    barreLigne: {
        width: '100%',
    },
    infoLigne: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    label: {
        fontSize: 13,
        fontWeight: '600',
        color: couleurs.gris[800],
    },
    valeur: {
        fontSize: 13,
        fontWeight: '700',
        color: couleurs.gris[900],
    },
    pisteBarre: {
        height: 8,
        backgroundColor: couleurs.gris[200],
        borderRadius: 4,
        overflow: 'hidden',
    },
    remplissage: {
        height: '100%',
        borderRadius: 4,
    },
});
