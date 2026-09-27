"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Tv, Film, Play, BookOpen, Clock, Loader2, ChevronRight } from "lucide-react";
import { FavoriteButton } from "@/components/anime/FavoriteButton";
import { animeClientApi } from "@/lib/api/animeClient";
import { clsx } from "clsx";

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ provider?: string }>;
}

interface EpisodeItem {
  title?: string;
  eps?: number | string;
  date?: string;
  episodeId?: string;
  slug?: string;
}

interface AnimeDetailData {
  title?: string;
  poster?: string;
  japanese?: string;
  score?: string;
  producers?: string;
  type?: string;
  status?: string;
  duration?: string;
  aired?: string;
  studios?: string;
  synopsis?: string | { paragraphs?: string[] };
  episodeList?: EpisodeItem[];
}

export default function AnimeDetailPage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const slug = resolvedParams.slug;
  const provider = resolvedSearchParams.provider || "samehadaku";

  const [anime, setAnime] = useState<AnimeDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let res: any;
        if (provider === "akompi") res = await animeClientApi.akompiDetail(slug);
        else if (provider === "samehadaku") res = await animeClientApi.samehadakuDetail(slug);
        else if (provider === "donghua") res = await animeClientApi.donghuaDetail(slug);
        else res = await animeClientApi.animeDetail(slug);
        
        setAnime(res?.data || null);
      } catch {
        setAnime(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug, provider]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
          <span className="text-sm font-medium text-text-secondary">Memuat data anime...</span>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
        <div className="p-8 rounded-2xl bg-bg-secondary border border-white/[0.08] text-center max-w-md shadow-xl">
          <h1 className="text-xl font-bold text-white mb-2">Anime Tidak Ditemukan</h1>
          <p className="text-text-muted text-sm mb-6">Data anime tidak ditemukan atau server sedang mengalami gangguan.</p>
          <Link
            href="/"
            className="inline-block w-full px-6 py-2.5 bg-white text-black font-semibold text-sm rounded-xl hover:bg-slate-200 transition-colors"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  const synopsisText = typeof anime.synopsis === "string" 
    ? anime.synopsis 
    : anime.synopsis?.paragraphs?.join("\n\n") || "";

  const displayScore = typeof anime.score === "object" && anime.score !== null 
    ? (anime.score as any).value || "N/A" 
    : String(anime.score || "N/A");

  return (
    <div className="min-h-screen pb-20 bg-bg-primary pt-20 md:pt-24">
      
      {/* Subtle Ambient Background */}
      <div className="fixed top-0 left-0 w-full h-[50vh] -z-10 overflow-hidden pointer-events-none opacity-20">
        {anime.poster && (
          <Image 
            src={anime.poster} 
            alt="Backdrop" 
            fill 
            className="object-cover blur-3xl scale-110" 
            unoptimized 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/80 to-bg-primary" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back */}
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-text-muted hover:text-white transition-colors"
          >
            ← Kembali ke Beranda
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Poster & Bookmark */}
          <div className="lg:col-span-4 flex flex-col gap-5">
            <div className="relative aspect-[2/3] w-full max-w-xs mx-auto lg:max-w-none rounded-2xl overflow-hidden bg-bg-secondary border border-white/[0.08] shadow-2xl">
              {anime.poster && (
                <Image 
                  src={anime.poster} 
                  alt={anime.title || ""} 
                  fill 
                  className="object-cover" 
                  unoptimized 
                  priority
                />
              )}
            </div>
            <div className="max-w-xs mx-auto w-full lg:max-w-none">
              <FavoriteButton
                animeSlug={slug}
                animeTitle={anime.title || ""}
                animeThumbnail={anime.poster}
                animeType={anime.type}
                animeStatus={anime.status}
              />
            </div>
          </div>

          {/* Right Column: Information & Episodes */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Title & Studio Header */}
            <div className="rounded-2xl bg-bg-secondary/70 border border-white/[0.06] p-6 sm:p-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-3">
                {anime.title || "Detail Anime"}
              </h1>
              
              <div className="flex flex-wrap items-center gap-2">
                {anime.japanese && (
                  <span className="px-3 py-1 rounded-md bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-text-secondary">
                    {anime.japanese}
                  </span>
                )}
                {anime.studios && (
                  <span className="px-3 py-1 rounded-md bg-white/[0.06] border border-white/[0.06] text-xs font-medium text-text-secondary">
                    Studio: {anime.studios}
                  </span>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-bg-secondary/70 border border-white/[0.06] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-400/10 flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Rating</p>
                  <p className="text-base font-bold text-white mt-0.5">{displayScore}</p>
                </div>
              </div>

              <div className="bg-bg-secondary/70 border border-white/[0.06] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-400/10 flex items-center justify-center shrink-0">
                  <Tv className="w-5 h-5 text-sky-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Tipe</p>
                  <p className="text-base font-bold text-white mt-0.5 truncate">{anime.type || "N/A"}</p>
                </div>
              </div>

              <div className="bg-bg-secondary/70 border border-white/[0.06] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-400/10 flex items-center justify-center shrink-0">
                  <Film className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Status</p>
                  <p className="text-base font-bold text-white mt-0.5 truncate">{anime.status || "N/A"}</p>
                </div>
              </div>

              <div className="bg-bg-secondary/70 border border-white/[0.06] rounded-xl p-3.5 flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-400/10 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-semibold uppercase tracking-wider">Rilis</p>
                  <p className="text-xs sm:text-sm font-bold text-white mt-0.5 truncate">{anime.aired || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Synopsis Card */}
            <div className="rounded-2xl bg-bg-secondary/70 border border-white/[0.06] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-text-secondary" />
                <span>Sinopsis</span>
              </h2>
              <div className="text-text-secondary text-sm sm:text-base font-normal leading-relaxed whitespace-pre-line">
                {synopsisText}
              </div>
            </div>

            {/* Episode List */}
            <div className="rounded-2xl bg-bg-secondary/70 border border-white/[0.06] p-6 sm:p-8">
              <h2 className="text-lg font-bold text-white mb-5 flex items-center gap-2">
                <Play className="w-5 h-5 text-text-secondary" />
                <span>Daftar Episode</span>
              </h2>
              
              {anime.episodeList && anime.episodeList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2.5">
                  {anime.episodeList.map((ep, i) => {
                    const epId = ep.episodeId || ep.slug || `episode-${i+1}`;
                    return (
                      <Link
                        key={epId}
                        href={`/episode/${epId}?provider=${provider}`}
                        className="group flex items-center justify-between p-3.5 bg-bg-primary/50 hover:bg-bg-primary/80 border border-white/[0.05] hover:border-white/[0.15] rounded-xl transition-all"
                      >
                        <div className="min-w-0 flex-1 pr-3">
                          <p className="text-xs sm:text-sm font-semibold text-white/90 group-hover:text-white transition-colors truncate">
                            {ep.title || `Episode ${i+1}`}
                          </p>
                          {ep.date && (
                            <p className="text-[11px] text-text-muted flex items-center gap-1 mt-1 font-medium">
                              <Clock className="w-3 h-3" /> {ep.date}
                            </p>
                          )}
                        </div>
                        
                        <div className="w-8 h-8 rounded-full bg-white/10 group-hover:bg-white text-white group-hover:text-black flex items-center justify-center shrink-0 transition-all">
                          <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-8 text-center bg-bg-primary/30 border border-white/[0.05] rounded-xl text-text-muted text-sm">
                  Belum ada episode yang dirilis untuk anime ini.
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
