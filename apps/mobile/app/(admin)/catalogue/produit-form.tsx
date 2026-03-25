// =============================================================================
// Sweet-Cake Mobile — Formulaire Produit Admin (iOS 26 Style)
// =============================================================================

import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, TouchableOpacity,
    Alert, Switch, Platform, Dimensions, KeyboardAvoidingView
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { couleurs, espacements, typographie, rayons } from '@sweet-cake/shared';
import api from '../../../src/services/api';
import ChampSaisie from '../../../src/composants/ChampSaisie';
import Chargement from '../../../src/composants/Chargement';

import * as ImagePicker from 'expo-image-picker';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function ProduitForm() {
    const { id } = useLocalSearchParams();
    const estEdition = id && id !== 'nouveau';

    const [nom, setNom] = useState('');
    const [description, setDescription] = useState('');
    const [prix, setPrix] = useState('');
    const [categorieId, setCategorieId] = useState<number | null>(null);
    const [image, setImage] = useState<string | null>(null);
    const [imageLocale, setImageLocale] = useState<string | null>(null);
    const [estActif, setEstActif] = useState(true);

    const [categories, setCategories] = useState<any[]>([]);
    const [chargement, setChargement] = useState(true);
    const [sauvegardeEnCours, setSauvegardeEnCours] = useState(false);

    useEffect(() => {
        const chargerDonnees = async () => {
            try {
                const resCat = await api.get('/categories');
                setCategories(resCat.data.donnees || []);

                if (estEdition) {
                    const resProd = await api.get(`/produits/${id}`);
                    const p = resProd.data.donnees;
                    setNom(p.nom);
                    setDescription(p.description || '');
                    setPrix(p.prix.toString());
                    setCategorieId(p.categorie_id);
                    setEstActif(p.est_actif);
                    setImage(p.image_url);
                }
            } catch (err) {
                console.error('Erreur chargement:', err);
                Alert.alert('Erreur', 'Données indisponibles');
            } finally {
                setChargement(false);
            }
        };
        chargerDonnees();
    }, [id]);

    const choisirImage = async () => {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permission refusée', 'Nous avons besoin de votre galerie.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled) {
            setImageLocale(result.assets[0].uri);
        }
    };

    const uploaderImage = async (uri: string) => {
        const formData = new FormData();
        const filename = uri.split('/').pop();
        const match = /\.(\w+)$/.exec(filename || '');
        const type = match ? `image/${match[1]}` : `image`;

        formData.append('image', {
            uri: Platform.OS === 'android' ? uri : uri.replace('file://', ''),
            name: filename,
            type,
        } as any);

        const res = await api.post('/produits/upload', formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        return res.data.donnees.image_url;
    };

    const enregistrer = async () => {
        if (!nom.trim() || !prix || !categorieId) {
            Alert.alert('Attention', 'Veuillez remplir les champs obligatoires');
            return;
        }

        setSauvegardeEnCours(true);
        try {
            let finalImageUrl = image;

            if (imageLocale) {
                finalImageUrl = await uploaderImage(imageLocale);
            }

            const payload = {
                nom,
                description,
                prix: Number(prix),
                categorie_id: categorieId,
                est_actif: estActif,
                est_disponible: true,
                image_url: finalImageUrl,
            };

            if (estEdition) {
                await api.patch(`/produits/${id}`, payload);
            } else {
                await api.post('/produits', payload);
            }
            router.back();
        } catch (err: any) {
            console.error('Erreur sauvegarde:', err);
            Alert.alert('Erreur', "Échec de l'enregistrement. Vérifiez votre connexion.");
        } finally {
            setSauvegardeEnCours(false);
        }
    };

    if (chargement) return <Chargement />;

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
        >
            <ScrollView style={styles.conteneur} showsVerticalScrollIndicator={false}>
                <View style={styles.formCard}>
                    <Text style={styles.sectionLabel}>Visuel du produit</Text>
                    <TouchableOpacity style={styles.imageContainer} onPress={choisirImage}>
                        {imageLocale || image ? (
                            <View style={styles.imageWrapper}>
                                <Text style={styles.imagePlaceholder}>Changer l'image</Text>
                                {/* Note: On utiliserait <Image /> ici normalement, mais on simule le visuel pour l'instant */}
                                <View style={styles.badgeImage}>
                                    <Ionicons name="camera" size={20} color="#fff" />
                                </View>
                            </View>
                        ) : (
                            <View style={styles.imageVide}>
                                <Ionicons name="image-outline" size={40} color="#94a3b8" />
                                <Text style={styles.imageVideTexte}>Ajouter une photo</Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Informations</Text>

                    <ChampSaisie
                        label="NOM DU PRODUIT"
                        value={nom}
                        onChangeText={setNom}
                        placeholder="Ex: Royal Chocolat"
                    />

                    <ChampSaisie
                        label="DESCRIPTION"
                        value={description}
                        onChangeText={setDescription}
                        placeholder="Ingrédients, allergènes..."
                        multiline
                        style={styles.textArea}
                    />

                    <View style={styles.row}>
                        <View style={{ flex: 1 }}>
                            <ChampSaisie
                                label="PRIX (FCFA)"
                                value={prix}
                                onChangeText={setPrix}
                                placeholder="0"
                                keyboardType="numeric"
                            />
                        </View>
                        <View style={styles.switchBox}>
                            <Text style={styles.switchText}>VISIBLE</Text>
                            <Switch
                                value={estActif}
                                onValueChange={setEstActif}
                                trackColor={{ false: '#e2e8f0', true: couleurs.primaire.clair }}
                                thumbColor={estActif ? couleurs.primaire.defaut : '#fff'}
                            />
                        </View>
                    </View>

                    <Text style={[styles.sectionLabel, { marginTop: 24 }]}>Catégorie</Text>
                    <View style={styles.chipsContainer}>
                        {categories.map((cat) => (
                            <TouchableOpacity
                                key={cat.id}
                                style={[
                                    styles.chip,
                                    categorieId === cat.id && styles.chipActive
                                ]}
                                onPress={() => setCategorieId(cat.id)}
                            >
                                <Text style={[
                                    styles.chipText,
                                    categorieId === cat.id && styles.chipTextActive
                                ]}>
                                    {cat.nom}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.saveBtn}
                        onPress={enregistrer}
                        disabled={sauvegardeEnCours}
                    >
                        <LinearGradient
                            colors={['#b59a5d', '#8e7943']}
                            style={styles.saveGradient}
                        >
                            {sauvegardeEnCours ? (
                                <Text style={styles.saveBtnText}>Enregistrement...</Text>
                            ) : (
                                <Text style={styles.saveBtnText}>
                                    {estEdition ? "Mettre à jour" : "Créer le produit"}
                                </Text>
                            )}
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelBtn} onPress={() => router.back()}>
                        <Text style={styles.cancelBtnText}>Annuler</Text>
                    </TouchableOpacity>
                </View>
                <View style={{ height: 100 }} />
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    conteneur: { flex: 1, backgroundColor: '#f8fafc' },
    formCard: {
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 24,
        margin: 16,
        borderWidth: 1,
        borderColor: '#f1f5f9',
        ...Platform.select({
            ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.05, shadowRadius: 20 },
            android: { elevation: 4 },
        }),
    },
    imageContainer: {
        width: '100%',
        height: 160,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: '#f8fafc',
        borderWidth: 2,
        borderColor: '#f1f5f9',
        borderStyle: 'dashed',
    },
    imageVide: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
    },
    imageVideTexte: {
        fontSize: 14,
        color: '#94a3b8',
        fontWeight: '700',
    },
    imageWrapper: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(107, 73, 58, 0.05)',
    },
    imagePlaceholder: {
        fontSize: 14,
        color: couleurs.primaire.defaut,
        fontWeight: '800',
    },
    badgeImage: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: couleurs.primaire.defaut,
        width: 36,
        height: 36,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    sectionLabel: {
        fontSize: 12,
        fontWeight: '800',
        color: '#94a3b8',
        marginBottom: 16,
        letterSpacing: 1,
        textTransform: 'uppercase'
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
        paddingTop: 12
    },
    row: { flexDirection: 'row', gap: 16, alignItems: 'center' },
    switchBox: {
        height: 56,
        backgroundColor: '#f8fafc',
        borderRadius: 16,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: 130,
        borderWidth: 1,
        borderColor: '#f1f5f9'
    },
    switchText: { fontSize: 11, fontWeight: '800', color: '#64748b' },
    chipsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 32 },
    chip: {
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 14,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    chipActive: {
        backgroundColor: couleurs.secondaire.defaut,
        borderColor: couleurs.secondaire.defaut,
    },
    chipText: { fontSize: 13, color: '#64748b', fontWeight: '700' },
    chipTextActive: { color: '#fff' },
    saveBtn: {
        borderRadius: 18,
        overflow: 'hidden',
        marginTop: 10,
    },
    saveGradient: {
        height: 56,
        justifyContent: 'center',
        alignItems: 'center',
    },
    saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '900' },
    cancelBtn: { padding: 16, alignItems: 'center', marginTop: 8 },
    cancelBtnText: { color: '#94a3b8', fontWeight: '700', fontSize: 14 },
});
