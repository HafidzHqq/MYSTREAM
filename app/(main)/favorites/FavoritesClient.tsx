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
        <div className="flex items-center gap-4 bg-bg-secondary border border-white/10 p-6 rounded-xl shadow-xl">
          <Loader2 className="w-6 h-6 text-accent-blue animate-spin" />
          <span className="text-sm font-semibold text-white tracking-wide">Memuat Favorit...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Heart className="w-3.5 h-3.5 fill-rose-400" />
            Daftar Simpanan
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Favorit Saya
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            {favorites.length} judul anime disimpan {user ? "di akun Anda" : "di penyimpanan lokal browser"}.
          </p>
        </div>

        {favorites.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {favorites.map((fav) => (
              <div key={fav.slug} className="group relative rounded-xl bg-bg-card border border-white/[0.07] overflow-hidden flex flex-col hover:border-white/20 transition-all duration-300">
                <Link href={`/anime/${fav.slug}`} className="block relative aspect-[2/3] overflow-hidden bg-bg-secondary">
                  {fav.thumbnail ? (
                    <Image src={fav.thumbnail} alt={fav.title} fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105" unoptimized />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-text-muted">
                      <Heart className="w-8 h-8 opacity-40" />
                    </div>
                  )}
                  {/* Hover overlay with play button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-xl-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => removeFavorite(fav.slug)}
                  title="Hapus dari favorit"
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white/80 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 transition-all opacity-100 md:opacity-0 md:group-hover:opacity-100"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-400 line-clamp-2 transition-colors">
                    {fav.title}
                  </h3>
                  <p className="text-[11px] text-text-muted mt-2">
                    Disimpan {new Date(fav.addedAt).toLocaleDateString("id-ID")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/60 border border-white/[0.06] p-6 max-w-md mx-auto">
            <div className="w-12 h-12 mb-3 rounded-xl-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <Heart className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Belum Ada Favorit</h3>
            <p className="text-text-muted text-xs sm:text-sm mb-5">
              Simpan anime yang ingin Anda tonton nanti dengan menekan tombol favorit di halaman detail anime.
            </p>
            <Link
              href="/"
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
            >
              Jelajahi Anime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
