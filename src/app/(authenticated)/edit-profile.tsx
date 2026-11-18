import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { colors } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, updateProfile } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatarUri, setAvatarUri] = useState(user?.avatarUri || '');
  const [error, setError] = useState('');
  if (!user) return null;

  async function choosePicture() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], allowsEditing: true, aspect: [1, 1], quality: 0.8 });
      if (!result.canceled && result.assets[0]?.uri) setAvatarUri(result.assets[0].uri);
    } catch {
      setError('Unable to access your photos. Check your device settings.');
    }
  }

  function save() {
    setError('');
    if (name.trim().length < 2) return setError('Name must contain at least 2 characters.');
    const message = updateProfile({ name: name.trim(), username, bio: bio.trim(), location: location.trim(), avatarUri });
    if (message) return setError(message);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}><Pressable onPress={() => router.back()} style={styles.navIcon}><Ionicons name="arrow-back" size={23} color={colors.ink} /></Pressable><Text style={styles.heading}>Edit Profile</Text><View style={styles.navIcon} /></View>
          <Pressable onPress={choosePicture} style={styles.avatarWrap}>
            <Avatar name={name || user.name} uri={avatarUri} size={112} border />
            <View style={styles.camera}><Ionicons name="camera" color="#FFFFFF" size={19} /></View>
            <Text style={styles.photoText}>Change profile photo</Text>
          </Pressable>
          <Field label="Full Name" value={name} onChangeText={setName} placeholder="Your name" />
          <Field label="Username" value={username} onChangeText={setUsername} placeholder="username" autoCapitalize="none" />
          <Field label="Bio" value={bio} onChangeText={setBio} placeholder="Tell us about yourself" multiline numberOfLines={4} />
          <Field label="Location" value={location} onChangeText={setLocation} placeholder="City, Country" />
          {!!error && <Text style={styles.error}>{error}</Text>}
          <Pressable style={styles.save} onPress={save}><Text style={styles.saveText}>Save Changes</Text></Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Field(props: React.ComponentProps<typeof TextInput> & { label: string }) {
  const { label, multiline, ...rest } = props;
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput {...rest} multiline={multiline} style={[styles.input, multiline && styles.multiline]} placeholderTextColor="#9DA5B8" /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 35 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 14, marginBottom: 25 },
  heading: { color: colors.ink, fontSize: 19, fontWeight: '900' },
  navIcon: { height: 38, width: 38, alignItems: 'center', justifyContent: 'center' },
  avatarWrap: { alignItems: 'center', alignSelf: 'center', marginBottom: 30 },
  camera: { backgroundColor: colors.primary, width: 34, height: 34, borderRadius: 12, alignItems: 'center', justifyContent: 'center', position: 'absolute', right: 0, top: 78, borderWidth: 2, borderColor: '#FFFFFF' },
  photoText: { marginTop: 11, color: colors.primary, fontWeight: '800', fontSize: 13 },
  field: { marginBottom: 20 },
  label: { marginBottom: 9, color: colors.ink, fontSize: 13, fontWeight: '800' },
  input: { backgroundColor: '#FFFFFF', borderColor: colors.border, borderWidth: 1, borderRadius: 16, minHeight: 56, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: colors.ink },
  multiline: { height: 110, textAlignVertical: 'top' },
  error: { color: '#C43C53', fontSize: 13, marginBottom: 15 },
  save: { height: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.primary, borderRadius: 17, marginTop: 12 },
  saveText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
});
