"use client";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

interface FavoriteButtonProps {
  animeSlug: string;
  animeTitle: string;
  animeThumbnail?: string;
  animeType?: string;
  animeStatus?: string;
}

export function FavoriteButton({ 
  animeSlug, 
  animeTitle, 
  animeThumbnail,
  animeType,
  animeStatus
}: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  // Get current user session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

  // Check favorited status
  useEffect(() => {
    let isMounted = true;
    async function checkStatus() {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('slug')
            .eq('user_id', user.id)
            .eq('slug', animeSlug)
            .maybeSingle();
          
          if (error) throw error;
          if (isMounted) setIsFav(!!data);
        } catch (err) {
          console.error("Error checking favorite status on Supabase:", err);
        }
      } else {
        const favs = JSON.parse(localStorage.getItem('anistream_favorites') || '[]');
        if (isMounted) setIsFav(favs.some((f: { slug: string }) => f.slug === animeSlug));
      }
    }
    checkStatus();
    return () => {
      isMounted = false;
    };
  }, [animeSlug, user, supabase]);

  const toggle = async () => {
    if (user) {
      try {
        if (isFav) {
          const { error } = await supabase
            .from('favorites')
            .delete()
            .eq('user_id', user.id)
            .eq('slug', animeSlug);
          
          if (error) throw error;
          setIsFav(false);
        } else {
          const { error } = await supabase
            .from('favorites')
            .insert({
              user_id: user.id,
              slug: animeSlug,
              title: animeTitle,
              thumbnail: animeThumbnail,
              type: animeType,
              status: animeStatus
            });
          
          if (error) throw error;
          setIsFav(true);
        }
      } catch (err) {
        console.error("Error toggling favorite on Supabase:", err);
      }
    } else {
      const favs = JSON.parse(localStorage.getItem('anistream_favorites') || '[]');
      if (isFav) {
        const next = favs.filter((f: { slug: string }) => f.slug !== animeSlug);
        localStorage.setItem('anistream_favorites', JSON.stringify(next));
        setIsFav(false);
      } else {
        favs.push({ 
          slug: animeSlug, 
          title: animeTitle, 
          thumbnail: animeThumbnail, 
          type: animeType,
          status: animeStatus,
          addedAt: new Date().toISOString() 
        });
        localStorage.setItem('anistream_favorites', JSON.stringify(favs));
        setIsFav(true);
      }
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center justify-center gap-2 w-full px-6 py-3.5 rounded-2xl border font-bold transition-all duration-300 ${
        isFav
          ? "bg-pink-500/20 border-pink-500/40 text-pink-400 hover:bg-pink-500/30"
          : "bg-white/5 border-white/10 text-text-secondary hover:text-text-primary hover:border-pink-500/30"
      }`}
    >
      <Heart className={`w-5 h-5 transition-all ${isFav ? "fill-pink-400" : ""}`} />
      {isFav ? "Favorit ❤️" : "Tambah Favorit"}
    </button>
  );
}
