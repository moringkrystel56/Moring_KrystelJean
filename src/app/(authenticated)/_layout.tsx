import { Redirect, Stack } from 'expo-router';
import { useApp } from '../../context/AppContext';

export default function AuthenticatedLayout() {
  const { ready, user } = useApp();
  if (!ready) return null;
  if (!user) return <Redirect href="/(unauthenticated)/login" />;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="edit-profile" />
      <Stack.Screen name="post-editor" options={{ presentation: 'modal' }} />
    </Stack>
  );
}
