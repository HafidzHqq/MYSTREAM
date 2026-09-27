"use client";
import { useState, useEffect, use } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { animeClientApi } from "@/lib/api/animeClient";

import { Tag } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

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

export default function GenreDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const slug = resolvedParams.slug;
  const pageNum = parseInt(resolvedSearchParams.page || "1");

  const [items, setItems] = useState<AnimeItem[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data: any = await animeClientApi.genreAnime(slug, pageNum);
        const list = data?.data?.animeList || (Array.isArray(data?.data) ? data.data : (data?.animeList || []));
        setItems(Array.isArray(list) ? list : []);
        setTotalPage(data?.data?.totalPage || data?.totalPage || 1);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, pageNum]);

  // Title formatting helper
  const genreTitle = slug.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ");

  return (
    <div className="min-h-screen py-8 md:py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb / Back */}
        <div className="mb-4">
          <Link
            href="/genre"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
          >
            ← Kembali ke Semua Genre
          </Link>
        </div>

        {/* Clean Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Tag className="w-3.5 h-3.5" />
            Genre Anime
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            {genreTitle}
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            Menampilkan koleksi anime dengan genre {genreTitle}.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5 mb-10">
              {items.map((anime) => (
                <AnimeCard
                  key={anime.slug || anime.animeId}
                  slug={anime.slug || anime.animeId || ""}
                  title={anime.title || "Unknown"}
                  thumbnail={anime.poster || anime.thumbnail || ""}
                  type={anime.type}
                  episode={anime.episode || anime.latestEp}
                  score={anime.score}
                  provider="samehadaku"
                />
              ))}
            </div>
            <PaginationControls currentPage={pageNum} totalPage={totalPage} baseUrl={`/genre/${slug}`} />
          </>
        ) : (
          <div className="text-center py-20 rounded-2xl bg-bg-secondary/60 border border-white/[0.06] p-6 max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-text-muted">
              <Tag className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Tidak Ada Anime</h3>
            <p className="text-text-muted text-xs sm:text-sm">
              Belum ada anime yang ditemukan untuk genre {genreTitle} pada halaman ini.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
