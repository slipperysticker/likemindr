// Popular book genres for Likemindr

export const GENRES = [
  'Fiction',
  'Fantasy',
  'Science Fiction',
  'Mystery',
  'Thriller',
  'Romance',
  'Contemporary',
  'Historical Fiction',
  'Horror',
  'Young Adult',
  'Non-Fiction',
  'Biography',
  'Self-Help',
  'Business',
  'History',
  'Philosophy',
  'Poetry',
  'Graphic Novels',
  'Manga',
  'Classics',
] as const;

export type Genre = (typeof GENRES)[number];

// Genre emojis for fun UI display
export const GENRE_EMOJIS: Record<string, string> = {
  Fiction: '📖',
  Fantasy: '🐉',
  'Science Fiction': '🚀',
  Mystery: '🔍',
  Thriller: '😱',
  Romance: '💕',
  Contemporary: '🌆',
  'Historical Fiction': '⏳',
  Horror: '👻',
  'Young Adult': '🎒',
  'Non-Fiction': '📚',
  Biography: '👤',
  'Self-Help': '🌟',
  Business: '💼',
  History: '🏛️',
  Philosophy: '🤔',
  Poetry: '✍️',
  'Graphic Novels': '🎨',
  Manga: '📱',
  Classics: '📜',
};

export function getGenreEmoji(genre: string): string {
  return GENRE_EMOJIS[genre] || '📖';
}
