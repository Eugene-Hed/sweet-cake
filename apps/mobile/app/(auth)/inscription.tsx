// =============================================================================
// Sweet-Cake Mobile — Écran Inscription (Design Premium)
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
                <LinearGradient
                    colors={[couleurs.secondaire.clair + '40', couleurs.primaire.clair + '20', 'transparent']}
                    style={styles.fondDecoratif}
                    start={{ x: 1, y: 0 }}
                    end={{ x: 0, y: 1 }}
                />

                <View style={styles.entete}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logoImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.titre}>Créer un compte</Text>
                    <Text style={styles.sousTitre}>Rejoignez la famille Sweet-Cake 🍰</Text>
                </View>

                <View style={styles.formulaire}>
                    {erreur && (
                        <View style={styles.erreurBox}>
                            <Ionicons name="alert-circle" size={18} color={couleurs.erreur.fonce} />
                            <Text style={styles.erreurTexte}>{erreur}</Text>
                        </View>
                    )}

                    <ChampSaisie
                        label="Nom complet"
                        placeholder="Jean Abena"
                        value={nomComplet}
                        onChangeText={(text) => { setNomComplet(text); effacerErreur(); }}
                        autoComplete="name"
                        iconeGauche={<Ionicons name="person-outline" size={20} color={couleurs.gris[400]} />}
                    />

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
                        placeholder="Min. 8 caractères, 1 majuscule, 1 chiffre"
                        value={motDePasse}
                        onChangeText={(text) => { setMotDePasse(text); effacerErreur(); }}
                        secureTextEntry
                        iconeGauche={<Ionicons name="lock-closed-outline" size={20} color={couleurs.gris[400]} />}
                    />

                    <ChampSaisie
                        label="Téléphone (optionnel)"
                        placeholder="+237 6 00 00 00 00"
                        value={telephone}
                        onChangeText={setTelephone}
                        keyboardType="phone-pad"
                        iconeGauche={<Ionicons name="call-outline" size={20} color={couleurs.gris[400]} />}
                    />

                    <Bouton
                        titre="S'inscrire"
                        onPress={handleInscription}
                        chargement={estChargement}
                        pleineLargeur
                        taille="lg"
                        desactive={!estValide}
                    />

                    <View style={styles.separateur}>
                        <View style={styles.separateurLigne} />
                        <Text style={styles.separateurTexte}>déjà inscrit ?</Text>
                        <View style={styles.separateurLigne} />
                    </View>

                    <Bouton
                        titre="Se connecter"
                        onPress={() => router.back()}
                        variante="fantome"
                        pleineLargeur
                    />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: couleurs.blanc },
    scroll: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    fondDecoratif: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: 280,
        borderBottomLeftRadius: 60,
        borderBottomRightRadius: 60,
    },
    entete: { alignItems: 'center', marginBottom: 24 },
    logoImage: { width: 150, height: 120, marginBottom: 8 },
    titre: { fontSize: 22, fontWeight: '800', color: couleurs.gris[900] },
    sousTitre: { fontSize: 14, color: couleurs.gris[500], marginTop: 4, fontWeight: '500' },
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
    erreurTexte: { color: couleurs.erreur.fonce, fontSize: 13, fontWeight: '500', flex: 1 },
    separateur: { flexDirection: 'row', alignItems: 'center', marginVertical: 16 },
    separateurLigne: { flex: 1, height: 1, backgroundColor: couleurs.gris[200] },
    separateurTexte: { marginHorizontal: 12, color: couleurs.gris[400], fontSize: 13, fontWeight: '500' },
});
