"use client";
import { useState, useEffect, use } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { animeClientApi } from "@/lib/api/animeClient";

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
    <div className="min-h-screen py-10 bg-bg-primary mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 brutal-box bg-accent-blue p-6 md:p-8">
          <h1 className="text-3xl md:text-5xl font-black text-black mb-2 uppercase tracking-tighter">
            📂 Genre: {genreTitle}
          </h1>
          <p className="text-black font-bold text-lg border-l-4 border-black pl-3 bg-white/50 inline-block pr-4 py-1">
            Menampilkan semua anime dalam genre {genreTitle}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6 mb-10">
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
          <div className="text-center py-20 text-black brutal-box bg-white">
            <p className="text-2xl font-black uppercase mb-2">📂 Genre anime gagal dimuat.</p>
            <p className="text-lg font-bold">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
