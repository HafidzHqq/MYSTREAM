"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, Trash2, Play, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface FavoriteItem {
  slug: string;
  title: string;
  thumbnail?: string;
  addedAt: string;
}

export default function FavoritesClient() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUser = session?.user ?? null;
      setUser(currentUser);

      if (currentUser) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .order('added_at', { ascending: false });
          
          if (error) throw error;
          
          const mapped: FavoriteItem[] = (data || []).map(f => ({
            slug: f.slug,
            title: f.title,
            thumbnail: f.thumbnail,
            addedAt: f.added_at
          }));
          setFavorites(mapped);
        } catch (err) {
          console.error("Error loading favorites from Supabase:", err);
        }
      } else {
        const stored = JSON.parse(localStorage.getItem('anistream_favorites') || '[]');
        setFavorites(stored);
      }
      setLoading(false);
    }
    
    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session?.user) {
        const stored = JSON.parse(localStorage.getItem('anistream_favorites') || '[]');
        setFavorites(stored);
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  const removeFavorite = async (slug: string) => {
    if (user) {
      try {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('slug', slug);
        
        if (error) throw error;
        setFavorites(prev => prev.filter(f => f.slug !== slug));
      } catch (err) {
        console.error("Error deleting favorite from Supabase:", err);
      }
    } else {
      const next = favorites.filter(f => f.slug !== slug);
      setFavorites(next);
      localStorage.setItem('anistream_favorites', JSON.stringify(next));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex items-center gap-4 bg-bg-secondary border border-white/10 p-6 rounded-2xl shadow-xl">
          <Loader2 className="w-6 h-6 text-accent-blue animate-spin" />
          <span className="text-sm font-semibold text-white tracking-wide">Memuat Favorit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Heart className="w-8 h-8 text-pink-400 fill-pink-400" />
          <div>
            <h1 className="text-3xl font-display font-black text-white">Favorit Saya</h1>
            <p className="text-text-muted text-sm">
              {favorites.length} anime tersimpan {user ? "(tersimpan di akun)" : "(tersimpan di browser)"}
            </p>
          </div>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map((fav) => (
              <div key={fav.slug} className="group relative rounded-2xl bg-bg-card border border-white/5 overflow-hidden card-glow">
                <Link href={`/anime/${fav.slug}`} className="block relative aspect-[2/3] overflow-hidden">
                  {fav.thumbnail ? (
                    <Image src={fav.thumbnail} alt={fav.title} fill
                      className="object-cover transition-transform duration-500 group-hover:scale-110" unoptimized />
                  ) : (
                    <div className="w-full h-full bg-bg-overlay flex items-center justify-center">
                      <Heart className="w-8 h-8 text-text-muted" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <div className="w-12 h-12 rounded-full bg-accent-purple/90 flex items-center justify-center">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                  </div>
                </Link>
                <button onClick={() => removeFavorite(fav.slug)}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-red-500/80 text-white opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-white line-clamp-2">{fav.title}</h3>
                  <p className="text-xs text-text-muted mt-1">{new Date(fav.addedAt).toLocaleDateString("id-ID")}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Heart className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-20" />
            <h2 className="text-xl font-semibold text-text-secondary mb-2">Belum ada favorit</h2>
            <p className="text-text-muted text-sm mb-6">Tambahkan anime ke favorit dari halaman detail</p>
            <Link href="/" className="px-6 py-3 rounded-xl bg-accent-purple text-white font-semibold hover:shadow-glow transition-all">
              Jelajahi Anime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
