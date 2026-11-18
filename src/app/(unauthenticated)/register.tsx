import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '../../context/AppContext';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { register } = useApp();

  const handleRegister = async () => {
    setError('');
    if (name.trim().length < 2) return setError('Name must contain at least 2 characters.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) return setError('Enter a valid email address.');
    if (password.length < 8) return setError('Password must contain at least 8 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    setSubmitting(true);
    const message = await register(name, email, password);
    setSubmitting(false);
    if (message) return setError(message);
    router.replace('/(authenticated)/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.inner}>
        <View style={styles.headerContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#9CA3AF" value={name} onChangeText={setName} />
          <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
          <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry />
          <TextInput style={styles.input} placeholder="Confirm Password" placeholderTextColor="#9CA3AF" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry />

          <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
            <Text style={styles.registerButtonText}>{submitting ? 'Creating Account...' : 'Register'}</Text>
          </TouchableOpacity>
          {!!error && <Text style={styles.error}>{error}</Text>}

          <View style={styles.footerContainer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.loginText}>Login</Text>
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
  headerContainer: { marginBottom: 24 },
  title: { fontSize: 28, fontWeight: '800', color: '#1C1917', marginBottom: 6 },
  subtitle: { fontSize: 14, color: '#78716C' },
  formContainer: { width: '100%' },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E7E5E4', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, fontSize: 16, color: '#1C1917', marginBottom: 16 },
  registerButton: { backgroundColor: '#F97316', borderRadius: 14, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  registerButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  error: { color: '#C43C53', fontSize: 13, textAlign: 'center', marginTop: 14 },
  footerContainer: { flexDirection: 'row', justifyContent: 'center', marginTop: 24 },
  footerText: { color: '#78716C', fontSize: 14 },
  loginText: { color: '#F97316', fontSize: 14, fontWeight: '700' },
});