"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Loader2, Sparkles } from "lucide-react";
import { animeClientApi } from "@/lib/api/animeClient";

interface GenreItem {
  title: string;
  slug: string;
  genreId?: string;
}

const colors = [
  "from-pink-500/10 to-rose-500/5 hover:border-pink-500/30 text-pink-400 border-white/5",
  "from-purple-500/10 to-indigo-500/5 hover:border-purple-500/30 text-purple-400 border-white/5",
  "from-blue-500/10 to-cyan-500/5 hover:border-blue-500/30 text-blue-400 border-white/5",
  "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/30 text-emerald-400 border-white/5",
  "from-amber-500/10 to-orange-500/5 hover:border-amber-500/30 text-amber-400 border-white/5",
  "from-red-500/10 to-rose-500/5 hover:border-red-500/30 text-red-400 border-white/5",
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
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden glass border border-white/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 p-[1px] shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              <div className="w-full h-full rounded-2xl bg-bg-secondary flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-cyan-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-3 tracking-tight">
                Semua Genre
              </h1>
              <p className="text-text-secondary font-medium text-lg">
                Temukan anime berdasarkan genre kesukaan kamu.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {Array.from({ length: 18 }).map((_, i) => (
              <div key={i} className="h-32 skeleton rounded-2xl border border-white/5" />
            ))}
          </div>
        ) : genres.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {genres.map((genre, i) => {
              const colorClass = colors[i % colors.length];
              const slug = genre.slug || genre.genreId || "";
              return (
                <Link
                  key={slug}
                  href={`/genre/${slug}`}
                  className={`group relative p-6 rounded-2xl border bg-gradient-to-br ${colorClass} transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-accent-blue/10 glass-panel overflow-hidden`}
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 blur-[20px] rounded-full -mr-10 -mt-10 group-hover:bg-white/10 transition-colors pointer-events-none" />
                  <div className="relative z-10 flex flex-col h-full justify-between">
                    <BookOpen className="w-7 h-7 mb-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                    <h3 className="font-bold text-white text-base md:text-lg group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70 transition-all line-clamp-2">
                      {genre.title}
                    </h3>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-32 flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-4xl">📂</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Daftar Genre Kosong</h3>
            <p className="text-text-muted text-lg max-w-md">Koneksi ke server bermasalah atau data kosong. Silakan periksa jaringan internet Anda.</p>
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/5 hover:border-white/20">
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
