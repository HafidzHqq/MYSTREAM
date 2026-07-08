-- ============================================
-- AniStream - Supabase PostgreSQL Schema
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================
-- Profiles (extends Supabase auth.users)
-- ============================================
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- ============================================
-- Watch History
-- ============================================
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  anime_slug TEXT NOT NULL,
  episode_slug TEXT NOT NULL,
  anime_title TEXT NOT NULL,
  anime_thumbnail TEXT,
  episode_number TEXT,
  episode_title TEXT,
  progress_seconds INTEGER DEFAULT 0,
  duration_seconds INTEGER DEFAULT 0,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, episode_slug)
);

CREATE INDEX idx_watch_history_user ON watch_history(user_id, watched_at DESC);

-- ============================================
-- Favorites
-- ============================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  anime_slug TEXT NOT NULL,
  anime_title TEXT NOT NULL,
  anime_thumbnail TEXT,
  anime_type TEXT,
  anime_status TEXT,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, anime_slug)
);

CREATE INDEX idx_favorites_user ON favorites(user_id, added_at DESC);

-- ============================================
-- Comments
-- ============================================
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  episode_slug TEXT NOT NULL,
  content TEXT NOT NULL,
  likes INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_comments_episode ON comments(episode_slug, created_at DESC);

-- ============================================
-- Ratings
-- ============================================
CREATE TABLE IF NOT EXISTS ratings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  anime_slug TEXT NOT NULL,
  score INTEGER NOT NULL CHECK (score BETWEEN 1 AND 10),
  rated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, anime_slug)
);

CREATE INDEX idx_ratings_anime ON ratings(anime_slug);

-- ============================================
-- Row Level Security (RLS)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Profiles: public read, own write
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Watch history: own only
CREATE POLICY "Users can manage own watch history" ON watch_history USING (auth.uid() = user_id);

-- Favorites: own only
CREATE POLICY "Users can manage own favorites" ON favorites USING (auth.uid() = user_id);

-- Comments: public read, own write/delete
CREATE POLICY "Comments are viewable by everyone" ON comments FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);

-- Ratings: public read, own write
CREATE POLICY "Ratings are viewable by everyone" ON ratings FOR SELECT USING (true);
CREATE POLICY "Authenticated users can rate" ON ratings FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ratings" ON ratings FOR UPDATE USING (auth.uid() = user_id);
