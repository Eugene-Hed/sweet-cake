import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs } from '@sweet-cake/shared';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface DonneePoint {
    label: string;
    valeur: number;
}

interface GraphiqueLigneProps {
    donnees: DonneePoint[];
    hauteur?: number;
    couleurLine?: string;
}

export default function GraphiqueLigne({
    donnees = [],
    hauteur = 150,
    couleurLine = '#e9c46a'
}: GraphiqueLigneProps) {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
        }).start();
    }, [donnees]);

    if (!donnees || donnees.length === 0) return null;

    const maxValeur = Math.max(...donnees.map(d => d.valeur), 1);
    const stepX = (SCREEN_WIDTH - 64) / (donnees.length - 1 || 1);

    return (
        <View style={[styles.conteneur, { height: hauteur + 40 }]}>
            <View style={[styles.graphZone, { height: hauteur }]}>
                {/* Lignes de repère */}
                {[0, 0.5, 1].map((p, i) => (
                    <View
                        key={i}
                        style={[
                            styles.repere,
                            { bottom: p * hauteur, opacity: 0.1 }
                        ]}
                    />
                ))}

                {/* Simulation de courbe avec des segments (Look iOS 26) */}
                <View style={styles.pointsWrapper}>
                    {donnees.map((d, i) => {
                        const x = i * stepX;
                        const y = (d.valeur / maxValeur) * hauteur;

                        return (
                            <Animated.View
                                key={i}
                                style={[
                                    styles.pointBarre,
                                    {
                                        left: x,
                                        bottom: 0,
                                        height: y,
                                        width: 4,
                                        opacity: fadeAnim,
                                        transform: [{
                                            scaleY: fadeAnim.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: [0, 1]
                                            })
                                        }]
                                    }
                                ]}
                            >
                                <LinearGradient
                                    colors={[couleurLine, 'transparent']}
                                    style={{ flex: 1, borderRadius: 2 }}
                                />
                            </Animated.View>
                        );
                    })}
                </View>
            </View>

            {/* Labels X */}
            <View style={styles.labelsX}>
                {donnees.map((d, i) => (
                    <Text key={i} style={styles.labelText}>{d.label}</Text>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        width: '100%',
        marginTop: 10,
    },
    graphZone: {
        width: '100%',
        justifyContent: 'flex-end',
    },
    repere: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: 1,
        backgroundColor: '#fff',
    },
    pointsWrapper: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        flex: 1,
    },
    pointBarre: {
        position: 'absolute',
        borderRadius: 2,
    },
    labelsX: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    labelText: {
        fontSize: 10,
        color: 'rgba(255,255,255,0.4)',
        fontWeight: '600',
    }
});
