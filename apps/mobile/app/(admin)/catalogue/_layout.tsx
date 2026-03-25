import { Stack } from 'expo-router';
import { couleurs } from '@sweet-cake/shared';

export default function AdminCatalogueLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerStyle: {
                    backgroundColor: couleurs.gris[900],
                },
                headerTintColor: couleurs.blanc,
                headerTitleStyle: {
                    fontWeight: '700',
                },
                contentStyle: { backgroundColor: couleurs.gris[50] },
            }}
        >
            <Stack.Screen name="produits" options={{ title: 'Gestion Produits' }} />
            <Stack.Screen name="categories" options={{ title: 'Gestion Catégories' }} />
            <Stack.Screen name="produit-form" options={{ title: 'Détails du Produit' }} />
            <Stack.Screen name="categorie-form" options={{ title: 'Détails de la Catégorie' }} />
        </Stack>
    );
}
