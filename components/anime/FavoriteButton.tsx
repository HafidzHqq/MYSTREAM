"use client";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

interface FavoriteButtonProps {
  animeSlug: string;
  animeTitle: string;
  animeThumbnail?: string;
}

// Simple localStorage-based favorites (no auth required)
export function FavoriteButton({ animeSlug, animeTitle, animeThumbnail }: FavoriteButtonProps) {
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('anistream_favorites') || '[]');
    setIsFav(favs.some((f: { slug: string }) => f.slug === animeSlug));
  }, [animeSlug]);

  const toggle = () => {
    const favs = JSON.parse(localStorage.getItem('anistream_favorites') || '[]');
    if (isFav) {
      const next = favs.filter((f: { slug: string }) => f.slug !== animeSlug);
      localStorage.setItem('anistream_favorites', JSON.stringify(next));
      setIsFav(false);
    } else {
      favs.push({ slug: animeSlug, title: animeTitle, thumbnail: animeThumbnail, addedAt: new Date().toISOString() });
      localStorage.setItem('anistream_favorites', JSON.stringify(favs));
      setIsFav(true);
    }
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-2 px-6 py-3 rounded-xl border font-semibold transition-all duration-300 ${
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
