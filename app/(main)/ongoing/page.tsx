"use client";
import { useState, useEffect, use } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { PaginationControls } from "@/components/ui/PaginationControls";
import { animeClientApi } from "@/lib/api/animeClient";

interface PageProps {
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

export default function OngoingPage({ searchParams }: PageProps) {
  const resolvedParams = use(searchParams);
  const pageNum = parseInt(resolvedParams.page || "1");
  
  const [items, setItems] = useState<AnimeItem[]>([]);
  const [totalPage, setTotalPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Panggil langsung dari browser ke API Sanka Vollerei
        const data: any = await animeClientApi.ongoing(pageNum);
        const list = data?.data || data?.animeList || [];
        setItems(Array.isArray(list) ? list : []);
        setTotalPage(data?.totalPage || 1);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pageNum]);

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2 flex items-center gap-2">
            🔥 Anime Ongoing
          </h1>
          <p className="text-text-muted text-sm">Anime yang sedang update episode terbaru</p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
              {items.map((anime) => (
                <AnimeCard
                  key={anime.slug || anime.animeId}
                  slug={anime.slug || anime.animeId || ""}
                  title={anime.title || "Unknown"}
                  thumbnail={anime.poster || anime.thumbnail || ""}
                  type={anime.type}
                  episode={anime.episode || anime.latestEp}
                  score={anime.score}
                  provider="otakudesu"
                />
              ))}
            </div>
            <PaginationControls currentPage={pageNum} totalPage={totalPage} baseUrl="/ongoing" />
          </>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg">🌸 Data tidak dapat dimuat.</p>
            <p className="text-sm mt-1">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
