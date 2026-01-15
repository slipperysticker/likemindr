-- Likemindr Database Schema
-- Run this SQL in your Supabase SQL Editor to create all tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  avatar_id TEXT NOT NULL,
  bio TEXT,
  favorite_genres TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Books table (cache from Google Books API)
CREATE TABLE books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  google_books_id TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  author TEXT NOT NULL,
  cover_url TEXT,
  description TEXT,
  page_count INTEGER,
  genres TEXT[] DEFAULT '{}',
  isbn TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User books (reading status)
CREATE TABLE user_books (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('currently_reading', 'want_to_read', 'finished')) NOT NULL,
  current_page INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, book_id)
);

-- Matches (cached for performance)
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  matched_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  match_score FLOAT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, matched_user_id, book_id)
);

-- Chat rooms
CREATE TABLE chat_rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CHECK (user1_id < user2_id),  -- Ensure consistent ordering
  UNIQUE(user1_id, user2_id, book_id)
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_room_id UUID REFERENCES chat_rooms(id) ON DELETE CASCADE,
  sender_id UUID REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  has_spoiler BOOLEAN DEFAULT FALSE,
  spoiler_page INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI discussion starters (cached)
CREATE TABLE discussion_starters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  book_id UUID REFERENCES books(id) ON DELETE CASCADE,
  starter_text TEXT NOT NULL,
  category TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_user_books_status ON user_books(status);
CREATE INDEX idx_user_books_user_id ON user_books(user_id);
CREATE INDEX idx_user_books_book_id ON user_books(book_id);
CREATE INDEX idx_matches_user_id ON matches(user_id);
CREATE INDEX idx_matches_book_id ON matches(book_id);
CREATE INDEX idx_messages_chat_room ON messages(chat_room_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);
CREATE INDEX idx_users_last_active ON users(last_active);
CREATE INDEX idx_chat_rooms_users ON chat_rooms(user1_id, user2_id);

-- Updated_at trigger for user_books
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_books_updated_at
BEFORE UPDATE ON user_books
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_books ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE discussion_starters ENABLE ROW LEVEL SECURITY;

-- Users: Read public profiles, update only own profile
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid()::text = id::text);

-- Books: Everyone can read, authenticated users can insert
CREATE POLICY "Books are viewable by everyone"
  ON books FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert books"
  ON books FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- User Books: Users can only see their own or currently reading books
CREATE POLICY "Users can view own books and others' currently reading"
  ON user_books FOR SELECT
  USING (
    auth.uid()::text = user_id::text OR
    status = 'currently_reading'
  );

CREATE POLICY "Users can insert own books"
  ON user_books FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own books"
  ON user_books FOR UPDATE
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can delete own books"
  ON user_books FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Matches: Users can view their own matches
CREATE POLICY "Users can view own matches"
  ON matches FOR SELECT
  USING (auth.uid()::text = user_id::text);

CREATE POLICY "System can insert matches"
  ON matches FOR INSERT
  WITH CHECK (true);

-- Chat Rooms: Users can view rooms they're part of
CREATE POLICY "Users can view own chat rooms"
  ON chat_rooms FOR SELECT
  USING (
    auth.uid()::text = user1_id::text OR
    auth.uid()::text = user2_id::text
  );

CREATE POLICY "Users can create chat rooms"
  ON chat_rooms FOR INSERT
  WITH CHECK (
    auth.uid()::text = user1_id::text OR
    auth.uid()::text = user2_id::text
  );

-- Messages: Users can view messages in their rooms
CREATE POLICY "Users can view messages in their chat rooms"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_room_id
      AND (
        chat_rooms.user1_id::text = auth.uid()::text OR
        chat_rooms.user2_id::text = auth.uid()::text
      )
    )
  );

CREATE POLICY "Users can insert messages in their chat rooms"
  ON messages FOR INSERT
  WITH CHECK (
    auth.uid()::text = sender_id::text AND
    EXISTS (
      SELECT 1 FROM chat_rooms
      WHERE chat_rooms.id = chat_room_id
      AND (
        chat_rooms.user1_id::text = auth.uid()::text OR
        chat_rooms.user2_id::text = auth.uid()::text
      )
    )
  );

-- Discussion Starters: Everyone can read
CREATE POLICY "Discussion starters are viewable by everyone"
  ON discussion_starters FOR SELECT
  USING (true);

CREATE POLICY "System can insert discussion starters"
  ON discussion_starters FOR INSERT
  WITH CHECK (true);
