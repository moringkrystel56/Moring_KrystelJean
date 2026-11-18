import type { Post } from '../context/AppContext';

/** Same two sample posts and images shown on the supplied Home screenshot. */
export const starterPosts: Post[] = [
  {
    id: 'seed-kanin',
    authorId: 'sample-kanin',
    authorName: 'Kanin',
    username: 'kanin',
    avatarUri: '',
    text: 'hoy!!! walang kanin bossing?!',
    imageUri: 'sample:kanin',
    createdAt: '2026-11-16T10:30:00.000Z',
    likes: 0,
    likedByMe: false,
  },
  {
    id: 'seed-maprisoka',
    authorId: 'sample-maprisoka',
    authorName: 'MaPrisoKa',
    username: 'maprisoka',
    avatarUri: '',
    text: 'Open for business! 24/7 #MaPrisoKa #fyp',
    imageUri: 'sample:maprisoka',
    createdAt: '2026-11-15T07:00:00.000Z',
    likes: 0,
    likedByMe: false,
  },
];
