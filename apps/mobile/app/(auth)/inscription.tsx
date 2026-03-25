// =============================================================================
// Sweet-Cake Mobile — Écran Inscription
// =============================================================================

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import { couleurs, espacements, typographie } from '@sweet-cake/shared';
import ChampSaisie from '../../src/composants/ChampSaisie';
import Bouton from '../../src/composants/Bouton';
import { useAuthStore } from '../../src/stores/auth.store';

export default function Inscription() {
    const [nomComplet, setNomComplet] = useState('');
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [telephone, setTelephone] = useState('');
    const { inscription, estChargement, erreur, effacerErreur } = useAuthStore();

    const handleInscription = async () => {
        try {
            await inscription({
                nom_complet: nomComplet,
                email,
                mot_de_passe: motDePasse,
                telephone: telephone || undefined,
            });
            router.replace('/(client)/accueil');
        } catch { /* erreur gérée par le store */ }
    };

    const estValide = nomComplet.length >= 2 && email.includes('@') && motDePasse.length >= 8;

    return (
        <KeyboardAvoidingView style={styles.conteneur} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
                <View style={styles.entete}>
                    <Text style={styles.logo}>🍰</Text>
                    <Text style={styles.titre}>Créer un compte</Text>
                    <Text style={styles.sousTitre}>Rejoignez Sweet-Cake</Text>
                </View>

                <View style={styles.formulaire}>
                    {erreur && (
                        <View style={styles.erreurBox}>
                            <Text style={styles.erreurTexte}>{erreur}</Text>
                        </View>
                    )}

                    <ChampSaisie
                        label="Nom complet"
                        placeholder="Jean Dupont"
                        value={nomComplet}
                        onChangeText={(text) => { setNomComplet(text); effacerErreur(); }}
                        autoComplete="name"
                    />

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
                        placeholder="Min. 8 caractères, 1 majuscule, 1 chiffre"
                        value={motDePasse}
                        onChangeText={(text) => { setMotDePasse(text); effacerErreur(); }}
                        secureTextEntry
                    />

                    <ChampSaisie
                        label="Téléphone (optionnel)"
                        placeholder="+33 6 12 34 56 78"
                        value={telephone}
                        onChangeText={setTelephone}
                        keyboardType="phone-pad"
                    />

                    <Bouton
                        titre="S'inscrire"
                        onPress={handleInscription}
                        chargement={estChargement}
                        pleineLargeur
                        desactive={!estValide}
                    />

                    <Bouton
                        titre="Déjà un compte ? Se connecter"
                        onPress={() => router.back()}
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
    conteneur: { flex: 1, backgroundColor: couleurs.gris[50] },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: espacements.lg },
    entete: { alignItems: 'center', marginBottom: espacements['2xl'] },
    logo: { fontSize: 52, marginBottom: espacements.sm },
    titre: { fontSize: typographie.titre_secondaire.taille, fontWeight: '700', color: couleurs.primaire.defaut },
    sousTitre: { fontSize: typographie.texte_secondaire.taille, color: couleurs.gris[500], marginTop: espacements.xs },
    formulaire: { backgroundColor: couleurs.blanc, borderRadius: 16, padding: espacements.lg },
    erreurBox: { backgroundColor: couleurs.erreur.clair, padding: espacements.md_sm, borderRadius: 8, marginBottom: espacements.md },
    erreurTexte: { color: couleurs.erreur.fonce, fontSize: typographie.texte_secondaire.taille, textAlign: 'center' },
});
