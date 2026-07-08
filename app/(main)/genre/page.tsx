"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Loader2 } from "lucide-react";
import { animeClientApi } from "@/lib/api/animeClient";

interface GenreItem {
  title: string;
  slug: string;
  genreId?: string;
}

const colors = [
  "from-pink-500/10 to-rose-500/5 hover:border-pink-500/30 text-pink-400",
  "from-purple-500/10 to-indigo-500/5 hover:border-purple-500/30 text-purple-400",
  "from-blue-500/10 to-cyan-500/5 hover:border-blue-500/30 text-blue-400",
  "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/30 text-emerald-400",
  "from-amber-500/10 to-orange-500/5 hover:border-amber-500/30 text-amber-400",
  "from-red-500/10 to-rose-500/5 hover:border-red-500/30 text-red-400",
];

export default function GenrePage() {
  const [genres, setGenres] = useState<GenreItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data: any = await animeClientApi.genreList();
        const list = data?.data || data?.genreList || [];
        setGenres(Array.isArray(list) ? list : []);
      } catch {
        setGenres([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-black text-text-primary mb-2 flex items-center gap-2">
            📂 Semua Genre Anime
          </h1>
          <p className="text-text-muted text-sm">Temukan anime berdasarkan genre kesukaan kamu</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
          </div>
        ) : genres.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {genres.map((genre, i) => {
              const colorClass = colors[i % colors.length];
              const slug = genre.slug || genre.genreId || "";
              return (
                <Link
                  key={slug}
                  href={`/genre/${slug}`}
                  className={`group p-5 rounded-2xl border bg-gradient-to-br ${colorClass} transition-all duration-300 hover:scale-[1.03] shadow-md`}
                >
                  <BookOpen className="w-6 h-6 mb-3 opacity-80" />
                  <h3 className="font-bold text-text-primary group-hover:underline">
                    {genre.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 text-text-muted">
            <p className="text-lg">🌸 Daftar genre gagal dimuat.</p>
            <p className="text-sm mt-1">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
          </div>
        )}
      </div>
    </div>
  );
}
