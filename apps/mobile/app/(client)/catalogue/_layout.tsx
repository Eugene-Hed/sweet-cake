import { Stack } from 'expo-router';
import { couleurs } from '@sweet-cake/shared';

export default function CatalogueLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: couleurs.blanc },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Catalogue' }} />
            <Stack.Screen name="[id]" options={{ title: 'Détails Produit' }} />
        </Stack>
    );
}
