import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useApp } from '../../../context/AppContext';
import { Avatar } from '../../../components/Avatar';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useApp();
  if (!user) return null;
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>Profile</Text></View>
      <View style={styles.card}>
        <Avatar name={user.name} uri={user.avatarUri} size={90} border />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.username}>@{user.username}</Text>
        <View style={styles.detailsBox}>
          <Text style={styles.bioText}>{user.bio || 'No bio yet.'}</Text>
        </View>
        <TouchableOpacity style={styles.editButton} onPress={() => router.push('/(authenticated)/edit-profile')}>
          <Ionicons name="create-outline" size={18} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.editButton, { backgroundColor: '#DC2626', marginTop: 12 }]} onPress={() => { logout(); router.replace('/(unauthenticated)/login'); }}>
          <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
          <Text style={styles.editButtonText}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F4' },
  header: { paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF', borderBottomWidth: 1, borderBottomColor: '#E7E5E4' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1C1917' },
  card: { backgroundColor: '#FFFFFF', margin: 20, borderRadius: 24, padding: 24, alignItems: 'center', borderWidth: 1, borderColor: '#E7E5E4' },
  avatar: { width: 90, height: 90, borderRadius: 45, marginBottom: 16, borderWidth: 3, borderColor: '#F97316' },
  name: { fontSize: 20, fontWeight: '800', color: '#1C1917', marginBottom: 4 },
  username: { fontSize: 14, color: '#78716C', marginBottom: 20 },
  detailsBox: { width: '100%', backgroundColor: '#FAFAF9', borderRadius: 14, padding: 16, marginBottom: 24 },
  bioText: { fontSize: 14, color: '#44403C', lineHeight: 20, textAlign: 'center' },
  editButton: { backgroundColor: '#F97316', borderRadius: 14, paddingVertical: 14, width: '100%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  editButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },
});