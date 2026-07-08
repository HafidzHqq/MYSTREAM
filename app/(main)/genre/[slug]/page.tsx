import type { Metadata } from "next";
import { animeApi } from "@/lib/api/anime";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { PaginationControls } from "@/components/ui/PaginationControls";

export const dynamic = 'force-dynamic';

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
  score?: string;
}

interface ApiResponse {
  data?: AnimeItem[] | { animeList?: AnimeItem[]; genreName?: string };
  animeList?: AnimeItem[];
  genreName?: string;
  totalPage?: number;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Anime Genre ${slug} - AniStream` };
}

export default async function GenreAnimePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { page } = await searchParams;
  const pageNum = parseInt(page || "1");

  let items: AnimeItem[] = [];
  let totalPage = 1;
  let genreName = slug;
  try {
    const res = await animeApi.genreAnime(slug, pageNum) as ApiResponse;
    const d = res?.data;
    if (Array.isArray(d)) {
      items = d;
    } else if (d && typeof d === "object") {
      items = (d as { animeList?: AnimeItem[] }).animeList || [];
      genreName = (d as { genreName?: string }).genreName || slug;
    }
    totalPage = res?.totalPage || 1;
  } catch { /* empty */ }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2">
            Genre: <span className="gradient-text capitalize">{genreName}</span>
          </h1>
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
                  score={anime.score}
                />
              ))}
            </div>
            <PaginationControls currentPage={pageNum} totalPage={totalPage} baseUrl={`/genre/${slug}`} />
          </>
        ) : (
          <div className="text-center py-20 text-text-muted"><p>Tidak ada anime untuk genre ini.</p></div>
        )}
      </div>
    </div>
  );
}
