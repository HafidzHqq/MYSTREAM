"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { Loader2, Flame } from "lucide-react";
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

export default function OngoingPage() {
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  const observer = useRef<IntersectionObserver | null>(null);

  const lastAnimeElementRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    async function load() {
      if (!hasMore && page !== 1) return;
      
      setLoading(true);
      try {
        const data: any = await animeClientApi.ongoing(page);
        const list = data?.data?.animeList || (Array.isArray(data?.data) ? data.data : (data?.animeList || []));
        
        const newItems = Array.isArray(list) ? list : [];
        const tPage = data?.data?.totalPage || data?.totalPage || 1;
        
        setItems(prev => page === 1 ? newItems : [...prev, ...newItems]);
        setTotalPage(tPage);
        setHasMore(page < tPage);
      } catch {
        if (page === 1) setItems([]);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [page]);

  return (
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden glass border border-white/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-red-500/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-red-500 p-[1px] shadow-[0_0_30px_rgba(249,115,22,0.3)]">
              <div className="w-full h-full rounded-2xl bg-bg-secondary flex items-center justify-center">
                <Flame className="w-8 h-8 text-orange-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-3 tracking-tight">
                Anime Ongoing
              </h1>
              <p className="text-text-secondary font-medium text-lg">
                Daftar anime yang sedang tayang dan update episode terbaru musim ini.
              </p>
            </div>
          </div>
        </div>

        {items.length === 0 && !loading ? (
          <div className="text-center py-32 flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-4xl">🌸</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Data Tidak Ditemukan</h3>
            <p className="text-text-muted text-lg max-w-md">Koneksi ke server bermasalah atau data kosong. Silakan periksa jaringan internet Anda.</p>
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/5 hover:border-white/20">
              Muat Ulang
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mb-12">
              {items.map((anime, index) => {
                if (items.length === index + 1) {
                  return (
                    <div ref={lastAnimeElementRef} key={anime.slug || anime.animeId || index}>
                      <AnimeCard
                        slug={anime.slug || anime.animeId || ""}
                        title={anime.title || "Unknown"}
                        thumbnail={anime.poster || anime.thumbnail || ""}
                        type={anime.type}
                        episode={anime.episode || anime.latestEp}
                        score={anime.score}
                        provider="samehadaku"
                      />
                    </div>
                  );
                }
                return (
                  <AnimeCard
                    key={anime.slug || anime.animeId || index}
                    slug={anime.slug || anime.animeId || ""}
                    title={anime.title || "Unknown"}
                    thumbnail={anime.poster || anime.thumbnail || ""}
                    type={anime.type}
                    episode={anime.episode || anime.latestEp}
                    score={anime.score}
                    provider="samehadaku"
                  />
                );
              })}
            </div>
            
            {loading && (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 mb-12">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            )}
            
            {loading && items.length > 0 && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-3.5 shadow-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-accent-blue" />
                  <span className="text-sm font-semibold text-white tracking-wide">Memuat data berikutnya...</span>
                </div>
              </div>
            )}
            
            {!hasMore && items.length > 0 && (
              <div className="text-center py-12">
                <p className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10 text-text-muted text-sm font-medium">
                  Semua anime telah dimuat 🎉
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
