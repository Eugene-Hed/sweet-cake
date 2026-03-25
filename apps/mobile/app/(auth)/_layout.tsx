// =============================================================================
// Sweet-Cake Mobile — Layout Auth
// =============================================================================

import { Stack } from 'expo-router';

export default function AuthLayout() {
    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="connexion" />
            <Stack.Screen name="inscription" />
        </Stack>
    );
}
