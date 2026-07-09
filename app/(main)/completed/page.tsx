"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { Loader2 } from "lucide-react";
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

export default function CompletedPage() {
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
        const data: any = await animeClientApi.completed(page);
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
    <div className="min-h-screen py-10 bg-bg-primary mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 brutal-box bg-accent-green p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-black text-black mb-2 uppercase tracking-tighter">
            ✅ Anime Completed
          </h1>
          <p className="text-black font-bold text-lg border-l-4 border-black pl-3 bg-white/50 inline-block pr-4 py-1">
            Daftar anime yang telah selesai tayang (tamat)
          </p>
        </div>

        {items.length === 0 && !loading ? (
          <div className="text-center py-20 text-black brutal-box bg-white">
            <p className="text-2xl font-black uppercase mb-2">🌸 Data tidak dapat dimuat.</p>
            <p className="text-lg font-bold">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-10">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-10">
                {Array.from({ length: 6 }).map((_, i) => (
                  <AnimeCardSkeleton key={i} />
                ))}
              </div>
            )}
            
            {loading && items.length > 0 && (
              <div className="flex justify-center py-6">
                <div className="flex items-center gap-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-3">
                  <Loader2 className="w-6 h-6 animate-spin text-black" />
                  <span className="text-lg font-black uppercase text-black">Memuat...</span>
                </div>
              </div>
            )}
            
            {!hasMore && items.length > 0 && (
              <div className="text-center py-10">
                <p className="text-black text-xl font-black uppercase bg-accent-pink border-[3px] border-black inline-block px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
