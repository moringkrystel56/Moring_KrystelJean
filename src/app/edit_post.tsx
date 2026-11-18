import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useApp } from '../context/AppContext';

export default function EditPostScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams<{ postId?: string }>();
  const { posts, editPost, deletePost } = useApp();
  const existing = posts.find((post) => post.id === postId);
  const [description, setDescription] = useState(existing?.text || '');
  const [imageUrl, setImageUrl] = useState(existing?.imageUri || '');
  const [title, setTitle] = useState(existing?.authorName || '');

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#1C1917" /></TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Post</Text>
      </View>
      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Title</Text>
        <TextInput style={styles.input} value={title} onChangeText={setTitle} />

        <Text style={styles.label}>Description</Text>
        <TextInput style={[styles.input, styles.textArea]} value={description} onChangeText={setDescription} multiline />

        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} value={imageUrl} onChangeText={setImageUrl} />

        <TouchableOpacity style={styles.updateButton} onPress={() => { if (existing) editPost(existing.id, [title.trim(), description.trim()].filter(Boolean).join('\n'), imageUrl || undefined); router.back(); }}>
          <Ionicons name="checkmark-circle-outline" size={18} color="#FFFFFF" />
          <Text style={styles.updateButtonText}>Update Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={() => { if (existing) deletePost(existing.id); router.back(); }}>
          <Ionicons name="trash-outline" size={18} color="#E11D48" />
          <Text style={styles.deleteButtonText}>Delete Post</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={() => router.back()}>
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAF9' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E7E5E4', gap: 16 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: '#1C1917' },
  form: { padding: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#44403C', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1.5, borderColor: '#E7E5E4', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 12, fontSize: 15, color: '#1C1917', marginBottom: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  updateButton: { backgroundColor: '#0D9488', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  updateButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
  deleteButton: { backgroundColor: '#FFF1F2', borderRadius: 14, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 12 },
  deleteButtonText: { color: '#E11D48', fontSize: 16, fontWeight: '700' },
  cancelButton: { backgroundColor: '#F5F5F4', borderRadius: 14, paddingVertical: 16, alignItems: 'center' },
  cancelButtonText: { color: '#44403C', fontSize: 16, fontWeight: '700' },
});