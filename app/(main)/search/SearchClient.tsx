"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Film, AlertCircle } from "lucide-react";
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
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden glass border border-white/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-accent-blue/10 to-accent-purple/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-accent-blue/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent-blue to-accent-purple p-[1px] shadow-[0_0_30px_rgba(0,229,255,0.3)] shrink-0">
              <div className="w-full h-full rounded-2xl bg-bg-secondary flex items-center justify-center">
                <Search className="w-8 h-8 text-accent-blue" />
              </div>
            </div>
            <div className="min-w-0">
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-3 tracking-tight truncate">
                &quot;{query || "..."}&quot;
              </h1>
              <p className="text-text-secondary font-medium text-lg">
                Hasil Pencarian Anime
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
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
          <div className="text-center py-32 flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <Film className="w-10 h-10 text-text-muted" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Tidak Ada Hasil Ditemukan</h3>
            <p className="text-text-muted text-lg max-w-md">Coba gunakan kata kunci lain (seperti judul dalam bahasa Inggris atau Romaji).</p>
          </div>
        ) : (
          <div className="text-center py-32 flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <AlertCircle className="w-10 h-10 text-accent-blue" />
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Mulai Pencarian</h3>
            <p className="text-text-muted text-lg max-w-md">Ketik sesuatu pada ikon cari di navigasi bar atas untuk mulai mencari anime.</p>
          </div>
        )}
      </div>
    </div>
  );
}
