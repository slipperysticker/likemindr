// Core database types for Likemindr

export type ReadingStatus = 'currently_reading' | 'want_to_read' | 'finished';

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_id: string;
  bio?: string;
  favorite_genres: string[];
  created_at: string;
  last_active: string;
}

export interface Book {
  id: string;
  google_books_id: string;
  title: string;
  author: string;
  cover_url?: string;
  description?: string;
  page_count?: number;
  genres: string[];
  isbn?: string;
  created_at: string;
}

export interface UserBook {
  id: string;
  user_id: string;
  book_id: string;
  status: ReadingStatus;
  current_page: number;
  started_at?: string;
  finished_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Match {
  id: string;
  user_id: string;
  matched_user_id: string;
  book_id: string;
  match_score: number;
  created_at: string;
}

export interface ChatRoom {
  id: string;
  book_id: string;
  user1_id: string;
  user2_id: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_room_id: string;
  sender_id: string;
  content: string;
  has_spoiler: boolean;
  spoiler_page?: number;
  created_at: string;
}

export interface DiscussionStarter {
  id: string;
  book_id: string;
  starter_text: string;
  category?: string;
  created_at: string;
}

// Helper types
export interface MatchedReader extends User {
  match_score: number;
  current_page: number;
  book: Book;
}

export interface ChatRoomWithUsers extends ChatRoom {
  book: Book;
  other_user: User;
  last_message?: Message;
}
