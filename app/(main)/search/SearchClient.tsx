"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Film } from "lucide-react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeClientApi } from "@/lib/api/animeClient";

interface SearchAnimeItem {
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

export default function SearchClient() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const [items, setItems] = useState<SearchAnimeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query.trim()) return;

    async function load() {
      setLoading(true);
      try {
        const data: any = await animeClientApi.search(query);
        const list = data?.data || data?.animeList || [];
        setItems(Array.isArray(list) ? list : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query]);

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3">
          <Search className="w-8 h-8 text-accent-purple" />
          <div>
            <h1 className="text-3xl font-display font-black text-text-primary">
              Hasil Pencarian: &quot;{query}&quot;
            </h1>
            <p className="text-text-muted text-sm">
              Mencari anime dengan kata kunci yang kamu masukkan
            </p>
          </div>
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
                type={anime.type}
                episode={anime.episode || anime.latestEp}
                score={anime.score}
                provider="otakudesu"
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20">
            <Film className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-20" />
            <h2 className="text-xl font-semibold text-text-secondary mb-2">
              Tidak ada hasil ditemukan
            </h2>
            <p className="text-text-muted text-sm">
              Coba gunakan kata kunci lain (seperti judul dalam bahasa Inggris atau Jepang)
            </p>
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            Ketik sesuatu pada tombol cari di kanan atas.
          </div>
        )}
      </div>
    </div>
  );
}
