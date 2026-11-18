import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useApp();

  const handleLogin = async () => {
    setError('');
    if (!email.trim() || !password) {
      setError('Enter both your email and password.');
      return;
    }
    setSubmitting(true);
    const message = await login(email, password);
    setSubmitting(false);
    if (message) return setError(message);
    router.replace('/(authenticated)/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.headerContainer}>
          <View style={styles.badge}><Text style={styles.badgeText}>👋 Hey there</Text></View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>{submitting ? 'Signing In...' : 'Login'}</Text>
          </TouchableOpacity>
          {!!error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/(unauthenticated)/register')}>
              <Text style={styles.signupText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF9' },
  inner: { flex: 1, justifyContent: 'center', paddingHorizontal: 24 },
  headerContainer: { marginBottom: 32 },
  badge: { alignSelf: 'flex-start', backgroundColor: '#FFEDD5', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginBottom: 12 },
  badgeText: { color: '#C2410C', fontSize: 12, fontWeight: '700' },
  title: { fontSize: 32, fontWeight: '800', color: '#1C1917', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#78716C' },
  formContainer: { width: '100%' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E7E5E4', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1C1917', marginBottom: 16 },
  loginButton: { backgroundColor: '#F97316', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  loginButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  error: { color: '#C43C53', fontSize: 13, textAlign: 'center', marginTop: 14 },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#78716C', fontSize: 14 },
  signupText: { color: '#F97316', fontSize: 14, fontWeight: '700' },
});