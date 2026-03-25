// =============================================================================
// Sweet-Cake Mobile — Écran Connexion (Design Premium)
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { couleurs, espacements, typographie } from '@sweet-cake/shared';
import ChampSaisie from '../../src/composants/ChampSaisie';
import Bouton from '../../src/composants/Bouton';
import { useAuthStore } from '../../src/stores/auth.store';

export default function Connexion() {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const { connexion, estChargement, erreur, effacerErreur } = useAuthStore();

    const handleConnexion = async () => {
        try {
            await connexion(email, motDePasse);
            const { estAdmin } = useAuthStore.getState();
            router.replace(estAdmin ? '/(admin)/dashboard' : '/(client)/accueil');
        } catch { /* erreur gérée par le store */ }
    };

    return (
        <KeyboardAvoidingView style={styles.conteneur} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                {/* Fond décoratif */}
                <LinearGradient
                    colors={[couleurs.primaire.clair + '30', couleurs.secondaire.clair + '50', 'transparent']}
                    style={styles.fondDecoratif}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                />

                {/* Logo / Marque */}
                <View style={styles.entete}>
                    <View style={styles.logoConteneur}>
                        <Image
                            source={require('../../assets/logo.png')}
                            style={styles.logoImage}
                            resizeMode="contain"
                        />
                    </View>
                    <Text style={styles.sousTitre}>Connectez-vous à votre compte</Text>
                </View>

                {/* Formulaire */}
                <View style={styles.formulaire}>
                    {erreur && (
                        <View style={styles.erreurBox}>
                            <Ionicons name="alert-circle" size={18} color={couleurs.erreur.fonce} />
                            <Text style={styles.erreurTexte}>{erreur}</Text>
                        </View>
                    )}

                    <ChampSaisie
                        label="Email"
                        placeholder="votre@email.com"
                        value={email}
                        onChangeText={(text) => { setEmail(text); effacerErreur(); }}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        iconeGauche={<Ionicons name="mail-outline" size={20} color={couleurs.gris[400]} />}
                    />

                    <ChampSaisie
                        label="Mot de passe"
                        placeholder="••••••••"
                        value={motDePasse}
                        onChangeText={(text) => { setMotDePasse(text); effacerErreur(); }}
                        secureTextEntry
                        autoComplete="password"
                        iconeGauche={<Ionicons name="lock-closed-outline" size={20} color={couleurs.gris[400]} />}
                    />

                    <Bouton
                        titre="Se connecter"
                        onPress={handleConnexion}
                        chargement={estChargement}
                        pleineLargeur
                        taille="lg"
                        desactive={!email || !motDePasse}
                    />

                    <View style={styles.separateur}>
                        <View style={styles.separateurLigne} />
                        <Text style={styles.separateurTexte}>ou</Text>
                        <View style={styles.separateurLigne} />
                    </View>

                    <Bouton
                        titre="Créer un compte"
                        onPress={() => router.push('/(auth)/inscription')}
                        variante="secondaire"
                        pleineLargeur
                        taille="lg"
                    />
                </View>

                {/* Footer */}
                <Text style={styles.footer}>
                    📍 Awae escalier — Mfou  •  📞 692 042 589
                </Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: couleurs.blanc,
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 24,
    },
    fondDecoratif: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 300,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
    },
    entete: {
        alignItems: 'center',
        marginBottom: 32,
    },
    logoConteneur: {
        marginBottom: 12,
    },
    logoImage: {
        width: 200,
        height: 160,
    },
    sousTitre: {
        fontSize: 15,
        color: couleurs.gris[500],
        fontWeight: '500',
    },
    formulaire: {
        backgroundColor: couleurs.blanc,
        borderRadius: 24,
        padding: 24,
        ...Platform.select({
            ios: {
                shadowColor: couleurs.noir,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.08,
                shadowRadius: 16,
            },
            android: { elevation: 6 },
        }),
    },
    erreurBox: {
        backgroundColor: couleurs.erreur.clair,
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    erreurTexte: {
        color: couleurs.erreur.fonce,
        fontSize: 13,
        fontWeight: '500',
        flex: 1,
    },
    separateur: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 20,
    },
    separateurLigne: {
        flex: 1,
        height: 1,
        backgroundColor: couleurs.gris[200],
    },
    separateurTexte: {
        marginHorizontal: 16,
        color: couleurs.gris[400],
        fontSize: 13,
        fontWeight: '500',
    },
    footer: {
        textAlign: 'center',
        marginTop: 24,
        fontSize: 12,
        color: couleurs.gris[400],
    },
});
