import { Stack } from 'expo-router';
import { couleurs } from '@sweet-cake/shared';

export default function ProfilLayout() {
    return (
        <Stack
            screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: couleurs.blanc },
            }}
        >
            <Stack.Screen name="index" options={{ title: 'Mon Profil' }} />
            <Stack.Screen name="commandes/[id]" options={{ title: 'Détail Commande' }} />
        </Stack>
    );
}
