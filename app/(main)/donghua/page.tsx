"use client";
import { useState, useEffect } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeClientApi } from "@/lib/api/animeClient";

interface DonghuaItem {
  slug?: string;
  animeId?: string;
  title?: string;
  poster?: string;
  thumbnail?: string;
  type?: string;
  episode?: string;
  latestEp?: string;
  score?: string;
}

export default function DonghuaPage() {
  const [items, setItems] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data: any = await animeClientApi.donghuaHome();
        const list = data?.data?.ongoing || data?.data?.popular || data?.data || [];
        setItems(Array.isArray(list) ? list : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2 flex items-center gap-2">
            🐉 Donghua
          </h1>
          <p className="text-text-muted text-sm">Animasi buatan China dengan grafik memukau</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((anime) => (
              <AnimeCard
                key={anime.slug || anime.animeId}
                slug={anime.slug || anime.animeId || ""}
                title={anime.title || "Unknown"}
                thumbnail={anime.poster || anime.thumbnail || ""}
                type={anime.type || "Donghua"}
                episode={anime.episode || anime.latestEp}
                score={anime.score}
                provider="donghua"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg">🐉 Data Donghua tidak dapat dimuat.</p>
            <p className="text-sm mt-1">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
