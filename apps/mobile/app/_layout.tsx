// =============================================================================
// Sweet-Cake Mobile — Layout Racine (Expo Router)
// =============================================================================

import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useAuthStore } from '../src/stores/auth.store';

export default function RootLayout() {
    const restaurerSession = useAuthStore((s) => s.restaurerSession);

    useEffect(() => {
        restaurerSession();
    }, []);

    return (
        <>
            <StatusBar style="dark" />
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(client)" />
                <Stack.Screen name="(admin)" />
            </Stack>
        </>
    );
}
