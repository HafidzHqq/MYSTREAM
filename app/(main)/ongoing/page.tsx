import type { Metadata } from "next";
import { animeApi } from "@/lib/api/anime";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { PaginationControls } from "@/components/ui/PaginationControls";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Anime Ongoing - Sedang Tayang" };

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
  status?: string;
  latestEp?: string;
  episode?: string;
  score?: string;
}

interface ApiResponse {
  data?: AnimeItem[];
  animeList?: AnimeItem[];
  totalPage?: number;
}

export default async function OngoingPage({ searchParams }: PageProps) {
  const { page } = await searchParams;
  const pageNum = parseInt(page || "1");

  let items: AnimeItem[] = [];
  let totalPage = 1;
  try {
    const data = await animeApi.ongoing(pageNum) as ApiResponse;
    items = data?.data || data?.animeList || [];
    totalPage = data?.totalPage || 1;
  } catch { /* empty */ }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2">
            🔥 Anime Ongoing
          </h1>
          <p className="text-text-muted text-sm">Anime yang sedang update episode terbaru</p>
        </div>

        {items.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 mb-10">
              {items.map((anime) => (
                <AnimeCard
                  key={anime.slug || anime.animeId}
                  slug={anime.slug || anime.animeId || ""}
                  title={anime.title || "Unknown"}
                  thumbnail={anime.poster || anime.thumbnail || ""}
                  type={anime.type}
                  status="Ongoing"
                  episode={anime.latestEp || anime.episode}
                  score={anime.score}
                  provider="otakudesu"
                />
              ))}
            </div>
            <PaginationControls currentPage={pageNum} totalPage={totalPage} baseUrl="/ongoing" />
          </>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <p>Data tidak tersedia saat ini. Coba refresh halaman.</p>
          </div>
        )}
      </div>
    </div>
  );
}
