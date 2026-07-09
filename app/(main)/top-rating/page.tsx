"use client";
import { useState, useEffect } from "react";
import { Loader2, Trophy, Star } from "lucide-react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { animeClientApi } from "@/lib/api/animeClient";

interface AnimeItem {
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

export default function TopRatingPage() {
  const [topAnime, setTopAnime] = useState<AnimeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTopAnime() {
      setLoading(true);
      try {
        // Fetch 10 pages of completed anime to get a good sample pool
        const promises = [];
        for (let i = 1; i <= 10; i++) {
          promises.push(animeClientApi.completed(i).catch(() => ({ data: { animeList: [] } })));
        }
        
        const results = await Promise.all(promises);
        let allItems: AnimeItem[] = [];
        
        results.forEach((res: any) => {
          if (res?.data?.animeList && Array.isArray(res.data.animeList)) {
            allItems = [...allItems, ...res.data.animeList];
          }
        });

        // Deduplicate
        const uniqueItems = Array.from(new Map(allItems.map(item => [item.slug || item.animeId, item])).values());

        // Sort by score
        const sorted = uniqueItems.sort((a, b) => {
          const scoreA = parseFloat(String(typeof a.score === "object" ? (a.score as any).value : a.score)) || 0;
          const scoreB = parseFloat(String(typeof b.score === "object" ? (b.score as any).value : b.score)) || 0;
          return scoreB - scoreA; // Descending
        });

        // Get Top 30
        setTopAnime(sorted.slice(0, 30));
      } catch (error) {
        console.error("Failed to fetch top anime", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopAnime();
  }, []);

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center mb-12 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-yellow/20 blur-[100px] rounded-full pointer-events-none" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(251,191,36,0.3)] relative z-10">
          <Trophy className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-600 tracking-tight mb-4 relative z-10">
          TOP 30 ANIME
        </h1>
        <p className="text-text-muted text-lg max-w-2xl mx-auto relative z-10">
          Daftar anime dengan rating tertinggi yang paling direkomendasikan untuk Anda tonton.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-12 h-12 text-accent-yellow animate-spin" />
          <p className="text-lg font-bold text-accent-yellow animate-pulse tracking-widest">
            MENGHITUNG RATING...
          </p>
        </div>
      ) : topAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 relative z-10">
          {topAnime.map((anime, index) => (
            <div key={anime.slug || anime.animeId} className="relative group">
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-[0_4px_20px_rgba(245,158,11,0.5)] z-20 group-hover:scale-110 group-hover:rotate-12 transition-transform border border-yellow-300/50">
                {index + 1}
              </div>
              <AnimeCard
                slug={anime.slug || ""}
                title={anime.title || ""}
                thumbnail={anime.poster || anime.thumbnail || ""}
                type={anime.type}
                episode={anime.episode || anime.latestEp}
                score={anime.score}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md">
          <Star className="w-16 h-16 text-text-muted mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Belum Ada Data</h2>
          <p className="text-text-muted">Tidak dapat mengambil data rating anime saat ini.</p>
        </div>
      )}
    </div>
  );
}
