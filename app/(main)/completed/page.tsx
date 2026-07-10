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
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative mb-8 rounded-3xl overflow-hidden glass border border-white/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-emerald-500/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-green-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 p-[1px] shadow-[0_0_30px_rgba(34,197,94,0.3)] shrink-0">
              <div className="w-full h-full rounded-2xl bg-bg-secondary flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-3 tracking-tight">
                Anime Completed
              </h1>
              <p className="text-text-secondary font-medium text-lg">
                Daftar anime yang telah selesai tayang (tamat). Siap untuk maraton!
              </p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8 bg-white/5 backdrop-blur-md border border-white/10 p-4 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full md:w-auto">
            {/* Genre Filter */}
            {genres.length > 0 && (
              <div className="relative min-w-[200px] w-full sm:w-auto">
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="w-full appearance-none bg-black/60 border border-white/10 text-white rounded-xl px-4 py-2.5 pr-10 text-sm font-semibold focus:outline-none focus:border-accent-blue focus:ring-1 focus:ring-accent-blue transition-all"
                >
                  <option value="">Semua Kategori (Genre)</option>
                  {genres.map((g) => (
                    <option key={g.genreId} value={g.genreId}>
                      {g.title}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-text-muted">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2 text-white/80">
              <Filter className="w-4 h-4 text-accent-blue" />
              <span className="text-sm font-medium">Urutkan:</span>
            </div>
          </div>

          <div className="flex gap-2 bg-black/40 p-1 rounded-xl w-full md:w-auto overflow-x-auto">
            <button 
              onClick={() => setSortBy("terbaru")}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-1 md:flex-initial text-center",
                sortBy === "terbaru" ? "bg-accent-blue text-white shadow-lg" : "text-text-muted hover:text-white"
              )}
            >
              Terbaru
            </button>
            <button 
              onClick={() => setSortBy("az")}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center justify-center gap-2 flex-1 md:flex-initial",
                sortBy === "az" ? "bg-accent-blue text-white shadow-lg" : "text-text-muted hover:text-white"
              )}
            >
              <ArrowDownWideNarrow className="w-4 h-4" /> A-Z
            </button>
            <button 
              onClick={() => setSortBy("za")}
              className={clsx(
                "px-4 py-2 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex items-center justify-center gap-2 flex-1 md:flex-initial",
                sortBy === "za" ? "bg-accent-blue text-white shadow-lg" : "text-text-muted hover:text-white"
              )}
            >
              <ArrowDownWideNarrow className="w-4 h-4 rotate-180" /> Z-A
            </button>
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
                <div className="flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 rounded-full px-8 py-3.5 shadow-lg">
                  <Loader2 className="w-5 h-5 animate-spin text-accent-green" />
                  <span className="text-sm font-semibold text-white tracking-wide">Menarik lebih banyak data dari server...</span>
                </div>
              </div>
            )}
            
            {!hasMore && items.length > 0 && (
              <div className="text-center py-12">
                <p className="inline-block px-6 py-3 rounded-full bg-white/5 border border-white/10 text-text-muted text-sm font-medium">
                  Semua {items.length} anime telah dimuat 🎉
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
