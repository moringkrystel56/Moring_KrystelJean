import { Stack } from 'expo-router';
import { AppProvider } from '../context/AppContext';

export default function RootLayout() {
  return (
    <AppProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(unauthenticated)" />
        <Stack.Screen name="(authenticated)" />
        <Stack.Screen name="create_post" options={{ presentation: 'modal' }} />
        <Stack.Screen name="edit_post" options={{ presentation: 'modal' }} />
      </Stack>
    </AppProvider>
  );
}