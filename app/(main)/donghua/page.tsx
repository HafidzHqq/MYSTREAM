import type { Metadata } from "next";
import { animeApi } from "@/lib/api/anime";
import { AnimeCard } from "@/components/ui/AnimeCard";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Donghua - Animasi China | AniStream" };

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

interface ApiResponse {
  data?: AnimeItem[] | { ongoing?: AnimeItem[]; popular?: AnimeItem[]; completed?: AnimeItem[] };
}

export default async function DonghuaPage() {
  let items: AnimeItem[] = [];
  try {
    const res = await animeApi.donghuaHome() as ApiResponse;
    const d = res?.data;
    if (Array.isArray(d)) {
      items = d;
    } else if (d && typeof d === "object") {
      const typed = d as { ongoing?: AnimeItem[]; popular?: AnimeItem[]; completed?: AnimeItem[] };
      items = [...(typed.ongoing || []), ...(typed.popular || []), ...(typed.completed || [])];
    }
  } catch { /* empty */ }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2 flex items-center gap-3">
            🐉 Donghua
          </h1>
          <p className="text-text-muted text-sm">Koleksi animasi China (Donghua) terbaik</p>
        </div>

        {items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {items.map((anime) => (
              <AnimeCard
                key={anime.slug || anime.animeId}
                slug={anime.slug || anime.animeId || ""}
                title={anime.title || "Unknown"}
                thumbnail={anime.poster || anime.thumbnail || ""}
                type={anime.type || "Donghua"}
                episode={anime.episode || anime.latestEp}
                score={anime.score}
                provider="dong"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg">🐉 Donghua sedang memuat...</p>
            <p className="text-sm mt-2">Data mungkin tidak tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
