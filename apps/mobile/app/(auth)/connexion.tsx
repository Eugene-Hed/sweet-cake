// =============================================================================
// Sweet-Cake Mobile — Écran Connexion
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
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
                {/* Logo / Marque */}
                <View style={styles.entete}>
                    <Text style={styles.logo}>🍰</Text>
                    <Text style={styles.titre}>Sweet-Cake</Text>
                    <Text style={styles.sousTitre}>Connectez-vous à votre compte</Text>
                </View>

                {/* Formulaire */}
                <View style={styles.formulaire}>
                    {erreur && (
                        <View style={styles.erreurBox}>
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
                    />

                    <ChampSaisie
                        label="Mot de passe"
                        placeholder="••••••••"
                        value={motDePasse}
                        onChangeText={(text) => { setMotDePasse(text); effacerErreur(); }}
                        secureTextEntry
                        autoComplete="password"
                    />

                    <Bouton
                        titre="Se connecter"
                        onPress={handleConnexion}
                        chargement={estChargement}
                        pleineLargeur
                        desactive={!email || !motDePasse}
                    />

                    <Bouton
                        titre="Créer un compte"
                        onPress={() => router.push('/(auth)/inscription')}
                        variante="fantome"
                        pleineLargeur
                        style={{ marginTop: espacements.md }}
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conteneur: {
        flex: 1,
        backgroundColor: couleurs.gris[50],
    },
    scroll: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: espacements.lg,
    },
    entete: {
        alignItems: 'center',
        marginBottom: espacements['3xl'],
    },
    logo: {
        fontSize: 64,
        marginBottom: espacements.md,
    },
    titre: {
        fontSize: typographie.titre_principal.taille,
        fontWeight: '700',
        color: couleurs.primaire.defaut,
    },
    sousTitre: {
        fontSize: typographie.texte_secondaire.taille,
        color: couleurs.gris[500],
        marginTop: espacements.xs,
    },
    formulaire: {
        backgroundColor: couleurs.blanc,
        borderRadius: 16,
        padding: espacements.lg,
    },
    erreurBox: {
        backgroundColor: couleurs.erreur.clair,
        padding: espacements.md_sm,
        borderRadius: 8,
        marginBottom: espacements.md,
    },
    erreurTexte: {
        color: couleurs.erreur.fonce,
        fontSize: typographie.texte_secondaire.taille,
        textAlign: 'center',
    },
});
