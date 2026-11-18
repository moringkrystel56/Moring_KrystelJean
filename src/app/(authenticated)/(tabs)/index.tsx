import React, { useState, useCallback } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, SafeAreaView, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import axios from 'axios';
import { PostCard } from '../../../components/PostCard';

const API_URL = 'https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items';

export default function HomeScreen() {
  const router = useRouter();
  const [apiPosts, setApiPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get(API_URL);
      setApiPosts(data.reverse());
    } catch (error) {
      console.error('Error fetching items from shared API:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchPosts();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.headerTitle}>Home Feed</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => router.push('/create_post')}>
          <Ionicons name="add" size={22} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={apiPosts}
        renderItem={({ item }) => (
          <PostCard 
            post={item} 
            onDeleteSuccess={fetchPosts} 
          />
        )}
        keyExtractor={(item: any) => item.id.toString()}
        contentContainerStyle={styles.feedList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#F97316']} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F4' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E7E5E4' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1C1917' },
  addButton: { backgroundColor: '#F97316', width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  feedList: { padding: 16 },
});