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
        const res = await animeClientApi.search(query);
        let combined: (SearchAnimeItem & { provider: string })[] = [];

        if (res) {
          const data: any = res;
          const list = data?.data?.animeList || (Array.isArray(data?.data) ? data.data : (data?.animeList || []));
          if (Array.isArray(list)) {
            combined = list.map((item: any) => ({ ...item, provider: "samehadaku" }));
          }
        }

        setItems(combined);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query]);

  return (
    <div className="min-h-screen py-10 bg-bg-primary mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 brutal-box bg-accent-pink p-6 md:p-8 flex items-center gap-4">
          <div className="w-16 h-16 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center shrink-0">
            <Search className="w-8 h-8 text-black stroke-[3]" />
          </div>
          <div>
            <h1 className="text-3xl md:text-5xl font-black text-black mb-2 uppercase tracking-tighter line-clamp-1">
              &quot;{query}&quot;
            </h1>
            <p className="text-black font-bold text-lg border-l-4 border-black pl-3 bg-white/50 inline-block pr-4 py-1">
              Hasil Pencarian Anime
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {items.map((anime: any) => (
              <AnimeCard
                key={anime.slug || anime.animeId}
                slug={anime.slug || anime.animeId || ""}
                title={anime.title || "Unknown"}
                thumbnail={anime.poster || anime.thumbnail || ""}
                type={anime.type}
                episode={anime.episode || anime.latestEp}
                score={anime.score}
                provider={anime.provider || "samehadaku"}
              />
            ))}
          </div>
        ) : query ? (
          <div className="text-center py-20 text-black brutal-box bg-white">
            <div className="w-24 h-24 bg-accent-yellow border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mx-auto mb-6">
              <Film className="w-12 h-12 text-black stroke-[3]" />
            </div>
            <h2 className="text-2xl font-black uppercase mb-2">
              Tidak ada hasil ditemukan
            </h2>
            <p className="text-lg font-bold">
              Coba gunakan kata kunci lain (seperti judul dalam bahasa Inggris atau Jepang)
            </p>
          </div>
        ) : (
          <div className="text-center py-20 text-black brutal-box bg-accent-cyan">
            <h2 className="text-2xl font-black uppercase">
              Ketik sesuatu pada tombol cari di kanan atas.
            </h2>
          </div>
        )}
      </div>
    </div>
  );
}
