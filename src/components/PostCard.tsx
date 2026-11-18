import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';

const API_URL = 'https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items';

export function PostCard({ post, onDeleteSuccess }: { post: any; onDeleteSuccess?: () => void }) {
  const router = useRouter();

  const handleDelete = () => {
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
              await axios.delete(`${API_URL}/${post.id}`);
              Alert.alert('Success', 'Post deleted successfully!');
              if (onDeleteSuccess) {
                onDeleteSuccess();
              }
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
    <View style={styles.card}>
      {post.image ? <Image source={{ uri: post.image }} style={styles.image} /> : null}
      
      <View style={styles.contentContainer}>
        <Text style={styles.username}>{post.name || 'Classmate'}</Text>
        <Text style={styles.text}>{post.content || post.description}</Text>
      </View>

      <View style={styles.buttonRow}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => {
            router.push({
              pathname: '/create_post',
              params: {
                id: String(post.id),
                content: post.content || post.description || '',
                image: post.image || '',
                name: post.name || 'Classmate',
              },
            });
          }}
        >
          <Text style={styles.buttonText}>EDIT</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>DELETE</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#E7E5E4' },
  image: { width: '100%', height: 200, resizeMode: 'cover' },
  contentContainer: { padding: 12 },
  username: { fontWeight: '700', fontSize: 14, color: '#1C1917', marginBottom: 4 },
  text: { fontSize: 14, color: '#44403C' },
  buttonRow: { flexDirection: 'row' },
  editButton: { flex: 1, backgroundColor: '#3B82F6', padding: 12, alignItems: 'center' },
  deleteButton: { flex: 1, backgroundColor: '#EF4444', padding: 12, alignItems: 'center' },
  buttonText: { color: '#FFFFFF', fontWeight: '700' },
});