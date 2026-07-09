-- Buat tabel watch_history
CREATE TABLE IF NOT EXISTS public.watch_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  episode TEXT NOT NULL,
  poster TEXT,
  watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  UNIQUE(user_id, slug)
);

-- Aktifkan RLS (Row Level Security)
ALTER TABLE public.watch_history ENABLE ROW LEVEL SECURITY;

-- Buat policy agar user hanya bisa membaca history mereka sendiri
CREATE POLICY "Users can view their own history" 
ON public.watch_history
FOR SELECT 
USING (auth.uid() = user_id);

-- Buat policy agar user hanya bisa menambah/update history mereka sendiri
CREATE POLICY "Users can insert their own history" 
ON public.watch_history
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own history" 
ON public.watch_history
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own history" 
ON public.watch_history
FOR DELETE 
USING (auth.uid() = user_id);
