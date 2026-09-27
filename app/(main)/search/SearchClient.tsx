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
        const res: any = await animeClientApi.search(query);
        let combined: (SearchAnimeItem & { provider: string })[] = [];

        if (res) {
          // Samehadaku results (stored as 'otakudesu' key in backend route)
          const sameList = res.otakudesu?.data?.animeList || res.otakudesu?.animeList || [];
          if (Array.isArray(sameList)) {
            combined = [...combined, ...sameList.map((item: any) => ({ ...item, provider: "samehadaku" }))];
          }

          // Akompi results
          const akompiList = res.akompi?.data?.animeList || res.akompi?.animeList || [];
          if (Array.isArray(akompiList)) {
            combined = [...combined, ...akompiList.map((item: any) => ({ ...item, provider: "akompi" }))];
          }
        }

        setItems(combined);
      } catch (error) {
        console.error("Search failed:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [query]);

  return (
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Search className="w-3.5 h-3.5" />
            Pencarian
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {query ? `Hasil untuk "${query}"` : "Pencarian Anime"}
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            {loading
              ? "Mencari anime di server..."
              : items.length > 0
              ? `Ditemukan ${items.length} anime yang sesuai.`
              : "Temukan anime berdasarkan judul dalam bahasa Inggris atau Romaji."}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
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
          <div className="text-center py-20 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/60 border border-white/[0.06] p-6 max-w-md mx-auto">
            <div className="w-12 h-12 mb-3 rounded-xl-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-text-muted">
              <Film className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Tidak Ada Hasil Ditemukan</h3>
            <p className="text-text-muted text-xs sm:text-sm">
              Coba gunakan kata kunci lain (seperti nama judul Romaji atau judul alternatif).
            </p>
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/60 border border-white/[0.06] p-6 max-w-md mx-auto">
            <div className="w-12 h-12 mb-3 rounded-xl-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Mulai Pencarian</h3>
            <p className="text-text-muted text-xs sm:text-sm">
              Ketik judul anime pada bilah pencarian di bagian navigasi atas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
