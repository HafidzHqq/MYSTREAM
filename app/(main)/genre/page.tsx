import type { Metadata } from "next";
import Link from "next/link";
import { Tag } from "lucide-react";
import { animeApi } from "@/lib/api/anime";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = { title: "Genre Anime - AniStream" };

interface Genre {
  name?: string;
  slug?: string;
  malId?: string;
}

interface ApiResponse {
  data?: Genre[];
}

const genreColors = [
  "from-purple-500/20 to-purple-600/10 border-purple-500/20 text-purple-400",
  "from-blue-500/20 to-blue-600/10 border-blue-500/20 text-blue-400",
  "from-cyan-500/20 to-cyan-600/10 border-cyan-500/20 text-cyan-400",
  "from-green-500/20 to-green-600/10 border-green-500/20 text-green-400",
  "from-yellow-500/20 to-yellow-600/10 border-yellow-500/20 text-yellow-400",
  "from-red-500/20 to-red-600/10 border-red-500/20 text-red-400",
  "from-pink-500/20 to-pink-600/10 border-pink-500/20 text-pink-400",
  "from-orange-500/20 to-orange-600/10 border-orange-500/20 text-orange-400",
];

export default async function GenrePage() {
  let genres: Genre[] = [];
  try {
    const res = await animeApi.genreList() as ApiResponse;
    genres = res?.data || [];
  } catch { /* empty */ }

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2 flex items-center gap-3">
            <Tag className="w-8 h-8 text-accent-purple" />
            Genre Anime
          </h1>
          <p className="text-text-muted text-sm">Jelajahi anime berdasarkan genre</p>
        </div>

        {genres.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
            {genres.map((genre, i) => (
              <Link
                key={genre.slug || genre.malId}
                href={`/genre/${genre.slug || genre.malId}`}
                className={`group p-4 rounded-2xl border bg-gradient-to-br ${genreColors[i % genreColors.length]} hover:scale-105 transition-all duration-300 card-glow text-center`}
              >
                <span className="text-sm font-semibold group-hover:scale-110 transition-transform block">
                  {genre.name}
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <p>Genre tidak tersedia saat ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
