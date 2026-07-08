"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";

interface AnimeResult {
  slug?: string;
  animeId?: string;
  title?: string;
  poster?: string;
  thumbnail?: string;
  type?: string;
  score?: string;
}

export default function SearchClient() {
  const searchParams = useSearchParams();
  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);
  const [results, setResults] = useState<AnimeResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (term: string) => {
    if (!term.trim()) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/anime/search?q=${encodeURIComponent(term)}`);
      const data = await res.json();
      const combined: AnimeResult[] = [
        ...(data?.otakudesu?.data || data?.otakudesu?.animeList || []),
        ...(data?.akompi?.data || []),
      ];
      setResults(combined);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (q) { setQuery(q); doSearch(q); }
  }, [q, doSearch]);

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-display font-black text-text-primary mb-2">Cari Anime</h1>
        <p className="text-text-muted text-sm mb-8">Temukan anime favoritmu dari berbagai provider</p>

        <form onSubmit={(e) => { e.preventDefault(); doSearch(query); }} className="relative mb-10">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
          <input type="text" value={query} onChange={(e) => setQuery(e.target.value)}
            placeholder="Nama anime, genre, studio..."
            className="w-full pl-12 pr-32 py-4 bg-bg-card border border-white/8 rounded-2xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/50 transition-all text-base" />
          <button type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold text-sm hover:shadow-glow transition-all">
            Cari
          </button>
        </form>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => <AnimeCardSkeleton key={i} />)}
          </div>
        ) : searched && results.length === 0 ? (
          <div className="text-center py-20">
            <Search className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-30" />
            <h2 className="text-xl font-semibold text-text-secondary mb-2">Tidak ditemukan</h2>
            <p className="text-text-muted text-sm">Coba kata kunci lain</p>
          </div>
        ) : results.length > 0 ? (
          <>
            <p className="text-text-muted text-sm mb-4">
              Ditemukan <span className="text-accent-purple font-semibold">{results.length}</span> hasil untuk &quot;{q}&quot;
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((anime, i) => (
                <AnimeCard key={`${anime.slug || anime.animeId}-${i}`}
                  slug={anime.slug || anime.animeId || ""}
                  title={anime.title || "Unknown"}
                  thumbnail={anime.poster || anime.thumbnail || ""}
                  type={anime.type} score={anime.score} />
              ))}
            </div>
          </>
        ) : !searched ? (
          <div className="text-center py-20 text-text-muted">
            <Search className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Mulai ketik untuk mencari anime</p>
          </div>
        ) : null}

        {loading && (
          <div className="flex justify-center mt-8">
            <Loader2 className="w-8 h-8 text-accent-purple animate-spin" />
          </div>
        )}
      </div>
    </div>
  );
}
