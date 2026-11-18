import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { colors } from '../../constants/theme';
import { useApp } from '../../context/AppContext';

export default function PostEditorScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId?: string }>();
  const { user, posts, addPost, editPost } = useApp();
  const existing = posts.find((post) => post.id === postId && (post.authorId === user?.id || post.id.startsWith('seed-')));
  const [text, setText] = useState(existing?.text || '');
  const [imageUri, setImageUri] = useState(existing?.imageUri || '');
  const [error, setError] = useState('');
  if (!user) return null;
  const isEditing = !!postId && !!existing;

  async function chooseImage() {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.85, allowsEditing: false });
      if (!result.canceled && result.assets[0]?.uri) setImageUri(result.assets[0].uri);
    } catch {
      setError('Unable to open your photo library.');
    }
  }

  function save() {
    setError('');
    if (!text.trim() && !imageUri) return setError('Write something or attach a photo before posting.');
    if (isEditing && existing) editPost(existing.id, text, imageUri || undefined);
    else addPost(text, imageUri || undefined);
    router.back();
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.header}><Pressable onPress={() => router.back()} style={styles.back}><Ionicons name="close" size={26} color={colors.ink} /></Pressable><Text style={styles.title}>{isEditing ? 'Edit Post' : 'Create Post'}</Text><Pressable onPress={save} style={styles.postButton}><Text style={styles.postText}>{isEditing ? 'Save' : 'Post'}</Text></Pressable></View>
          <View style={styles.author}><Avatar name={user.name} uri={user.avatarUri} size={48} /><View><Text style={styles.name}>{user.name}</Text><Text style={styles.handle}>@{user.username}</Text></View></View>
          <TextInput multiline value={text} onChangeText={setText} style={styles.textarea} placeholder="Share your moment with everyone..." placeholderTextColor="#9FA7BA" textAlignVertical="top" maxLength={1600} />
          {!!imageUri && <View style={styles.preview}><Image source={imageUri === 'sample:kanin' ? require('../../../assets/posts/kanin.jpg') : imageUri === 'sample:maprisoka' ? require('../../../assets/posts/maprisoka.jpg') : { uri: imageUri }} style={styles.image} resizeMode="cover" /><Pressable accessibilityLabel="Remove attached photo" onPress={() => setImageUri('')} style={styles.remove}><Ionicons name="close" size={20} color="#FFFFFF" /></Pressable></View>}
          <Pressable onPress={chooseImage} style={styles.mediaButton}><Ionicons name="image-outline" color={colors.primary} size={24} /><Text style={styles.mediaText}>{imageUri ? 'Change photo' : 'Add a photo'}</Text></Pressable>
          {!!error && <Text style={styles.error}>{error}</Text>}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.background },
  scroll: { paddingHorizontal: 20, paddingBottom: 40 },
  header: { marginTop: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 },
  back: { width: 45, height: 45, justifyContent: 'center' },
  title: { color: colors.ink, fontSize: 19, fontWeight: '900' },
  postButton: { backgroundColor: colors.primary, borderRadius: 13, minWidth: 70, paddingVertical: 11, alignItems: 'center' },
  postText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  author: { flexDirection: 'row', gap: 13, alignItems: 'center', marginBottom: 22 },
  name: { color: colors.ink, fontWeight: '900', fontSize: 15 },
  handle: { fontSize: 12, color: colors.muted, marginTop: 4 },
  textarea: { fontSize: 17, lineHeight: 26, color: colors.ink, backgroundColor: '#FFFFFF', borderRadius: 20, padding: 18, minHeight: 160, marginBottom: 18 },
  preview: { position: 'relative', marginBottom: 16 },
  image: { width: '100%', height: 260, borderRadius: 20, backgroundColor: colors.primarySoft },
  remove: { position: 'absolute', right: 12, top: 12, borderRadius: 14, width: 31, height: 31, backgroundColor: 'rgba(0,0,0,.60)', justifyContent: 'center', alignItems: 'center' },
  mediaButton: { flexDirection: 'row', alignItems: 'center', gap: 9, backgroundColor: '#FFFFFF', borderRadius: 18, paddingHorizontal: 18, paddingVertical: 17 },
  mediaText: { color: colors.primary, fontWeight: '800', fontSize: 14 },
  error: { color: '#C43C53', marginTop: 18, fontSize: 13 },
});
