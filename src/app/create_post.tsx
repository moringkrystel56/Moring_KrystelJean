import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = 'https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items';

export default function CreateEditPostScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const postId = params.id ? String(params.id) : null;
  const isEditing = Boolean(postId);
  const [content, setContent] = useState(() => {
    if (params.content) return String(params.content);
    if (params.description) return String(params.description);
    return '';
  });

  const [image, setImage] = useState(() => {
    if (params.image) return String(params.image);
    return '';
  });

  const handleUpdate = async () => {
    if (!content.trim()) {
      Alert.alert('Error', 'Please share something in your post!');
      return;
    }

    try {
      if (isEditing) {
        await axios.put(`${API_URL}/${postId}`, {
          content: content,
          image: image,
          name: params.name ? String(params.name) : 'Krystel',
        });
        Alert.alert('Success', 'Post updated successfully!');
      } else {
        await axios.post(API_URL, {
          content: content,
          image: image,
          name: 'Krystel',
        });
        Alert.alert('Success', 'Post created successfully!');
      }

      router.back();
    } catch (error) {
      console.error('Error saving post:', error);
      Alert.alert('Error', 'Something went wrong while saving the post.');
    }
  };

  const handleDelete = () => {
    if (!postId) return;

    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await axios.delete(`${API_URL}/${postId}`);
              Alert.alert('Success', 'Post deleted successfully!');
              router.back();
            } catch (error) {
              console.error('Error deleting post:', error);
              Alert.alert('Error', 'Could not delete the post.');
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close" size={24} color="#1C1917" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edit Post' : 'Create Post'}</Text>
        <TouchableOpacity style={styles.postButton} onPress={handleUpdate}>
          <Text style={styles.postButtonText}>{isEditing ? 'Update' : 'Post'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer}>
        {}
        <TextInput
          style={styles.input}
          placeholder="Share your moment with everyone..."
          placeholderTextColor="#A8A29E"
          multiline
          value={content}
          onChangeText={setContent}
        />

        <TextInput
          style={styles.imageInput}
          placeholder="Add photo URL (optional)"
          placeholderTextColor="#A8A29E"
          value={image}
          onChangeText={setImage}
        />

        {isEditing && (
          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={18} color="#FFFFFF" style={{ marginRight: 6 }} />
            <Text style={styles.deleteButtonText}>Delete Post</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F4' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E7E5E4' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1C1917' },
  postButton: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  postButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 14 },
  formContainer: { padding: 16 },
  input: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, height: 150, textAlignVertical: 'top', fontSize: 16, borderWidth: 1, borderColor: '#E7E5E4', marginBottom: 16, color: '#1C1917' },
  imageInput: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, fontSize: 14, borderWidth: 1, borderColor: '#E7E5E4', marginBottom: 20, color: '#1C1917' },
  deleteButton: { flexDirection: 'row', backgroundColor: '#EF4444', borderRadius: 12, padding: 16, justifyContent: 'center', alignItems: 'center' },
  deleteButtonText: { color: '#FFFFFF', fontWeight: '700', fontSize: 16 },
});