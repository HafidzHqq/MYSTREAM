"use client";
import { useState, useEffect } from "react";
import { Trophy, Star } from "lucide-react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
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

        // Get Top 70
        setTopAnime(sorted.slice(0, 70));
      } catch (error) {
        console.error("Failed to fetch top anime", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTopAnime();
  }, []);

  return (
    <div className="min-h-screen py-8 md:py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Trophy className="w-3.5 h-3.5" />
            Hall of Fame
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Top 70 Anime Terbaik
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            Daftar anime dengan penilaian dan rating tertinggi berdasarkan ulasan penonton.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {Array.from({ length: 18 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : topAnime.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {topAnime.map((anime, index) => {
              const rank = index + 1;
              const isFirst = rank === 1;
              const isSecond = rank === 2;
              const isThird = rank === 3;

              return (
                <div key={anime.slug || anime.animeId} className="relative group">
                  {/* Subtle, elegant rank tag */}
                  <div
                    className={`absolute top-2 left-2 z-20 px-2 py-0.5 rounded-xl text-[11px] font-black tracking-wider shadow-lg pointer-events-none transition-transform group-hover:scale-105 ${
                      isFirst
                        ? "bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-amber-500/20"
                        : isSecond
                        ? "bg-gradient-to-r from-slate-200 to-zinc-400 text-black shadow-white/10"
                        : isThird
                        ? "bg-gradient-to-r from-amber-700 to-yellow-800 text-white shadow-amber-900/30"
                        : "bg-black/80 backdrop-blur-md text-white/90 border border-white/15"
                    }`}
                  >
                    #{rank}
                  </div>
                  <AnimeCard
                    slug={anime.slug || anime.animeId || ""}
                    title={anime.title || ""}
                    thumbnail={anime.poster || anime.thumbnail || ""}
                    type={anime.type}
                    episode={anime.episode || anime.latestEp}
                    score={anime.score}
                    provider="samehadaku"
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/60 border border-white/[0.06] p-6 max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-text-muted">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Belum Ada Data</h3>
            <p className="text-text-muted text-xs sm:text-sm">Tidak dapat memuat peringkat anime saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
