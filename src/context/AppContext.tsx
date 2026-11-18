import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { starterPosts } from '../data/seed';

const STORAGE_KEY = '@socially:sample-screens:v2';

export type User = {
  id: string;
  name: string;
  username: string;
  email: string;
  bio: string;
  location: string;
  avatarUri: string;
  joinedAt: string;
};

type Account = User & { passwordSalt: string; passwordHash: string };

export type Post = {
  id: string;
  authorId: string;
  authorName: string;
  username: string;
  avatarUri: string;
  text: string;
  imageUri?: string;
  createdAt: string;
  likes: number;
  likedByMe: boolean;
};

type Store = { accounts: Account[]; currentUserId: string | null; posts: Post[] };
const emptyStore: Store = { accounts: [], currentUserId: null, posts: starterPosts };

export type ProfileUpdate = Pick<User, 'name' | 'username' | 'bio' | 'location' | 'avatarUri'>;

type AppContextType = {
  ready: boolean;
  user: User | null;
  posts: Post[];
  login(email: string, password: string): Promise<string | null>;
  register(name: string, email: string, password: string): Promise<string | null>;
  logout(): void;
  updateProfile(changes: ProfileUpdate): string | null;
  addPost(text: string, imageUri?: string): void;
  editPost(postId: string, text: string, imageUri?: string): void;
  deletePost(postId: string): void;
  toggleLike(postId: string): void;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

function publicUser(account: Account): User {
  const { passwordSalt: _salt, passwordHash: _hash, ...user } = account;
  return user;
}

function usernameFor(name: string) {
  return name.toLowerCase().trim().replace(/[^a-z0-9_.]+/g, '').slice(0, 18) || 'newmember';
}

async function hashPassword(password: string, salt: string) {
  return Crypto.digestStringAsync(Crypto.CryptoDigestAlgorithm.SHA256, `${salt}:${password}`);
}

function randomId() {
  return Crypto.randomUUID();
}

async function initialStore(): Promise<Store> {
  const demoSalt = randomId();
  const demo: Account = {
    id: 'demo-user',
    name: 'Your Name',
    username: 'yourname',
    email: 'demo@socially.app',
    bio: '',
    location: '',
    avatarUri: 'sample:avatar',
    joinedAt: '2026-09-01T00:00:00.000Z',
    passwordSalt: demoSalt,
    passwordHash: await hashPassword('Demo1234!', demoSalt),
  };
  return { ...emptyStore, accounts: [demo], posts: [...starterPosts] };
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [store, setStore] = useState<Store>(emptyStore);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        const initial = saved ? (JSON.parse(saved) as Store) : await initialStore();
        if (active) setStore(initial);
      } catch (error) {
        console.warn('Could not load locally saved app data:', error);
        const fallback = await initialStore();
        if (active) setStore(fallback);
      } finally {
        if (active) setReady(true);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!ready) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(store)).catch((error) => {
      console.warn('Could not save local app data:', error);
    });
  }, [store, ready]);

  const account = store.accounts.find((item) => item.id === store.currentUserId);
  const user = account ? publicUser(account) : null;

  async function login(email: string, password: string) {
    const matching = store.accounts.find((item) => item.email.toLowerCase() === email.trim().toLowerCase());
    if (!matching) return 'Account not found. Please register first.';
    const hashed = await hashPassword(password, matching.passwordSalt);
    if (hashed !== matching.passwordHash) return 'Incorrect password. Please try again.';
    setStore((current) => ({ ...current, currentUserId: matching.id }));
    return null;
  }

  async function register(name: string, email: string, password: string) {
    const normalizedEmail = email.trim().toLowerCase();
    if (store.accounts.some((item) => item.email.toLowerCase() === normalizedEmail)) {
      return 'This email is already registered. Sign in instead.';
    }
    const salt = randomId();
    const baseUsername = usernameFor(name);
    const existing = store.accounts.some((item) => item.username === baseUsername);
    const uniqueUsername = existing ? `${baseUsername.slice(0, 12)}${randomId().slice(0, 4)}` : baseUsername;
    const newUser: Account = {
      id: randomId(),
      name: name.trim(),
      email: normalizedEmail,
      username: uniqueUsername,
      bio: '',
      location: '',
      avatarUri: '',
      joinedAt: new Date().toISOString(),
      passwordSalt: salt,
      passwordHash: await hashPassword(password, salt),
    };
    setStore((current) => ({ ...current, accounts: [...current.accounts, newUser], currentUserId: newUser.id }));
    return null;
  }

  function logout() {
    setStore((current) => ({ ...current, currentUserId: null }));
  }

  function updateProfile(changes: ProfileUpdate): string | null {
    if (!user) return 'You must sign in to update your profile.';
    const username = changes.username.trim().replace(/^@/, '').toLowerCase();
    if (!/^[a-z0-9_.]{3,20}$/.test(username)) {
      return 'Username must be 3–20 characters, using only letters, numbers, _ or .';
    }
    if (store.accounts.some((item) => item.id !== user.id && item.username === username)) {
      return 'This username is already taken.';
    }
    setStore((current) => ({
      ...current,
      accounts: current.accounts.map((item) => item.id === user.id ? {
        ...item,
        ...changes,
        name: changes.name.trim(),
        username,
      } : item),
    }));
    return null;
  }

  function addPost(text: string, imageUri?: string) {
    if (!user) return;
    const post: Post = {
      id: randomId(),
      authorId: user.id,
      authorName: user.name,
      username: user.username,
      avatarUri: user.avatarUri,
      text: text.trim(),
      ...(imageUri ? { imageUri } : {}),
      createdAt: new Date().toISOString(),
      likes: 0,
      likedByMe: false,
    };
    setStore((current) => ({ ...current, posts: [post, ...current.posts] }));
  }

  function editPost(postId: string, text: string, imageUri?: string) {
    if (!user) return;
    setStore((current) => ({
      ...current,
      posts: current.posts.map((post) => post.id === postId && (post.authorId === user.id || post.id.startsWith('seed-'))
        ? { ...post, text: text.trim(), imageUri }
        : post),
    }));
  }

  function deletePost(postId: string) {
    if (!user) return;
    setStore((current) => ({ ...current, posts: current.posts.filter((post) => !(post.id === postId && (post.authorId === user.id || post.id.startsWith('seed-')))) }));
  }

  function toggleLike(postId: string) {
    setStore((current) => ({
      ...current,
      posts: current.posts.map((post) => post.id === postId ? {
        ...post,
        likes: Math.max(0, post.likes + (post.likedByMe ? -1 : 1)),
        likedByMe: !post.likedByMe,
      } : post),
    }));
  }

  const value = useMemo<AppContextType>(() => ({
    ready, user, posts: store.posts,
    login, register, logout, updateProfile, addPost, editPost, deletePost, toggleLike,
  // Membership and functions are intentionally regenerated with the latest store state.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [ready, store]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
