"use client";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { Loader2, CheckCircle, Filter, ArrowDownWideNarrow, ChevronDown } from "lucide-react";
import { animeClientApi } from "@/lib/api/animeClient";
import { clsx } from "clsx";

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

type SortOption = "terbaru" | "az" | "za";

export default function CompletedPage() {
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  
  // Genres list and filter state
  const [genres, setGenres] = useState<{ title: string; genreId: string }[]>([]);
  const [selectedGenre, setSelectedGenre] = useState<string>("");
  const [sortBy, setSortBy] = useState<SortOption>("terbaru");
  
  // Infinite scroll observer
  const observer = useRef<IntersectionObserver | null>(null);

  // Fetch genres list on mount
  useEffect(() => {
    async function loadGenres() {
      try {
        const res: any = await animeClientApi.genreList();
        const list = res?.data?.genreList || res?.genreList || [];
        setGenres(Array.isArray(list) ? list : []);
      } catch (err) {
        console.error("Failed to load genres:", err);
      }
    }
    loadGenres();
  }, []);

  const fetchPageSafely = useCallback(async (pageNum: number, genreId: string) => {
    try {
      let data: any;
      if (genreId) {
        data = await animeClientApi.genreAnime(genreId, pageNum);
      } else {
        data = await animeClientApi.completed(pageNum);
      }
      const list = data?.data?.animeList || (Array.isArray(data?.data) ? data.data : (data?.animeList || []));
      const newItems = Array.isArray(list) ? list : [];
      return { items: newItems, isEmpty: newItems.length === 0 };
    } catch {
      return { items: [], isEmpty: true };
    }
  }, []);

  const fetchBatch = useCallback(async (startPage: number, batchSize: number) => {
    const pagesToFetch = Array.from({ length: batchSize }, (_, i) => startPage + i);
    const results = await Promise.all(pagesToFetch.map(p => fetchPageSafely(p, selectedGenre)));
    
    let allNewItems: any[] = [];
    let highestPageFetched = startPage - 1;
    let hitEnd = false;

    for (let i = 0; i < results.length; i++) {
      const result = results[i];
      if (!result.isEmpty) {
        allNewItems = [...allNewItems, ...result.items];
        highestPageFetched = pagesToFetch[i];
      }
      if (result.isEmpty || result.items.length < 10) {
        hitEnd = true;
      }
    }
    // If we didn't fetch any new items, we keep the previous highest page
    if (highestPageFetched < startPage) {
       highestPageFetched = startPage - 1;
    }
    
    return { allNewItems, highestPageFetched, hitEnd };
  }, [selectedGenre, fetchPageSafely]);

  const loadMore = useCallback(async () => {
    if (!hasMore || loading) return;
    setLoading(true);
    
    try {
      // Muat 3 halaman sekaligus tiap kali scroll mentok bawah
      const { allNewItems, highestPageFetched, hitEnd } = await fetchBatch(page + 1, 3);
      
      setItems(prev => {
        const existingSlugs = new Set(prev.map(i => i.slug || i.animeId));
        const filteredNew = allNewItems.filter(i => !existingSlugs.has(i.slug || i.animeId));
        return [...prev, ...filteredNew];
      });
      
      if (highestPageFetched >= page + 1) {
        setPage(highestPageFetched);
      }
      setHasMore(!hitEnd);
    } catch {
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [hasMore, loading, page, fetchBatch]);

  const loadMoreRef = useCallback((node: HTMLDivElement) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    }, { rootMargin: '400px' });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  // Handle selectedGenre resets
  useEffect(() => {
    setItems([]);
    setPage(1);
    setHasMore(true);
  }, [selectedGenre]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    async function initialLoad() {
      setLoading(true);
      try {
        // Muat 4 halaman di awal agar layar terisi penuh (~60 anime)
        const initialRes = await fetchBatch(1, 4);
        if (!isMounted) return;
        
        const uniqueItems = Array.from(new Map(initialRes.allNewItems.map(item => [item.slug || item.animeId, item])).values());
        
        setItems(uniqueItems);
        if (initialRes.highestPageFetched > 0) {
            setPage(initialRes.highestPageFetched);
        }
        setHasMore(!initialRes.hitEnd);
      } catch {
        setHasMore(false);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    
    initialLoad();
    
    return () => {
      isMounted = false;
    };
  }, [fetchBatch]);

  const displayedItems = useMemo(() => {
    let sorted = [...items];
    if (sortBy === "az") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    } else if (sortBy === "za") {
      sorted.sort((a, b) => (b.title || "").localeCompare(a.title || ""));
    }
    return sorted;
  }, [items, sortBy]);

  return (
    <div className="min-h-screen py-8 bg-bg-primary">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header & Controls Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8 pb-5 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Tamat</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Anime Completed
            </h1>
            <p className="text-text-secondary text-xs sm:text-sm mt-1">
              Daftar anime yang telah selesai tayang, siap untuk ditonton maraton.
            </p>
          </div>

          {/* Filters & Sort */}
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            {/* Genre Filter */}
            {genres.length > 0 && (
              <div className="relative min-w-[170px]">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full appearance-none bg-bg-secondary border border-white/[0.08] hover:border-white/20 text-white rounded-xl px-3.5 py-2 pr-9 text-xs font-semibold focus:outline-none transition-all cursor-pointer"
                >
                  <option value="">Semua Genre</option>
                  {genres.map((g) => (
                    <option key={g.genreId} value={g.genreId} className="bg-bg-secondary text-white">
                      {g.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-text-muted">
                  <ChevronDown className="w-3.5 h-3.5" />
                </div>
              </div>
            )}

            {/* Sort Controls */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-bg-secondary border border-white/[0.06]">
              <button 
                onClick={() => setSortBy("terbaru")}
                className={clsx(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  sortBy === "terbaru" ? "bg-white text-black font-bold shadow-sm" : "text-text-muted hover:text-white"
                )}
              >
                Terbaru
              </button>
              <button 
                onClick={() => setSortBy("az")}
                className={clsx(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  sortBy === "az" ? "bg-white text-black font-bold shadow-sm" : "text-text-muted hover:text-white"
                )}
              >
                A-Z
              </button>
              <button 
                onClick={() => setSortBy("za")}
                className={clsx(
                  "px-3 py-1.5 rounded-xl text-xs font-semibold transition-all",
                  sortBy === "za" ? "bg-white text-black font-bold shadow-sm" : "text-text-muted hover:text-white"
                )}
              >
                Z-A
              </button>
            </div>
          </div>
        </div>

        {items.length === 0 && !loading ? (
          <div className="text-center py-24 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/40 border border-white/[0.06] p-8">
            <h3 className="text-xl font-bold text-white mb-2">Data Tidak Ditemukan</h3>
            <p className="text-text-muted text-sm max-w-md mb-6">Koneksi ke server bermasalah atau data kosong. Silakan periksa jaringan internet Anda.</p>
            <button onClick={() => window.location.reload()} className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/10">
              Muat Ulang
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-5 mb-12">
              {displayedItems.map((anime, index) => (
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
              ))}
              
              {loading && Array.from({ length: 12 }).map((_, i) => (
                <AnimeCardSkeleton key={`skel-${i}`} />
              ))}
            </div>
            
            {/* Intersection Observer target for infinite scrolling */}
            {hasMore && (
              <div ref={loadMoreRef} className="w-full h-20 bg-transparent" />
            )}
            
            {loading && items.length > 0 && (
              <div className="flex justify-center py-8">
                <div className="flex items-center gap-2.5 bg-bg-secondary border border-white/[0.08] rounded-xl-full px-6 py-2.5 shadow-md">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span className="text-xs font-medium text-text-secondary">Memuat lebih banyak anime...</span>
                </div>
              </div>
            )}
            
            {!hasMore && items.length > 0 && (
              <div className="text-center py-12">
                <p className="inline-block px-5 py-2 rounded-xl-full bg-bg-secondary/60 border border-white/[0.06] text-text-muted text-xs font-medium">
                  Semua {items.length} anime telah dimuat
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
