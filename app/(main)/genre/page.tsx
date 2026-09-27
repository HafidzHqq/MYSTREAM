"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen } from "lucide-react";
import { animeClientApi } from "@/lib/api/animeClient";

interface GenreItem {
  title: string;
  slug: string;
  genreId?: string;
}

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
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <BookOpen className="w-3.5 h-3.5" />
            Katalog Genre
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Semua Genre
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            Jelajahi dan temukan anime berdasarkan kategori atau genre kesukaanmu.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="h-24 skeleton rounded-xl border border-white/[0.05]" />
            ))}
          </div>
        ) : genres.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
            {genres.map((genre) => {
              const slug = genre.slug || genre.genreId || "";
              return (
                <Link
                  key={slug}
                  href={`/genre/${slug}`}
                  className="group relative p-4 rounded-xl bg-bg-card/70 hover:bg-bg-card border border-white/[0.06] hover:border-sky-500/30 transition-all duration-200 flex flex-col justify-between min-h-[92px] hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-text-muted group-hover:text-sky-400 transition-colors">
                      <BookOpen className="w-4 h-4" />
                    </span>
                    <span className="text-[10px] text-text-muted group-hover:text-text-secondary opacity-0 group-hover:opacity-100 transition-opacity">
                      Jelajahi →
                    </span>
                  </div>
                  <h3 className="font-semibold text-white group-hover:text-sky-400 transition-colors text-sm sm:text-base leading-snug line-clamp-1">
                    {genre.title}
                  </h3>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/60 border border-white/[0.06] p-6 max-w-lg mx-auto">
            <div className="w-12 h-12 mx-auto mb-3 rounded-xl-full bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-text-muted">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Daftar Genre Kosong</h3>
            <p className="text-text-muted text-xs sm:text-sm">Koneksi ke server bermasalah atau data genre belum tersedia.</p>
            <button onClick={() => window.location.reload()} className="mt-5 px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm font-semibold transition-all border border-white/10">
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
