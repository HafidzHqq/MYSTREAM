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
        <div className="glass-panel px-10 py-8 rounded-3xl flex flex-col items-center gap-4 animate-pulse">
          <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
          <span className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple tracking-widest">
            INITIALIZING DATA...
          </span>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
        <div className="glass-panel p-10 rounded-3xl text-center max-w-md border border-red-500/20 shadow-[0_0_40px_rgba(239,68,68,0.1)]">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h1 className="text-2xl font-black text-white mb-4">ANIME NOT FOUND</h1>
          <p className="text-text-muted mb-8">Data anime tidak ditemukan atau server sedang mengalami gangguan.</p>
          <Link href="/" className="inline-block w-full px-6 py-3.5 bg-gradient-to-r from-accent-blue to-accent-purple text-white font-bold rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] transition-all transform hover:-translate-y-1">
            KEMBALI KE BERANDA
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
    <div className="min-h-screen pb-16 bg-bg-primary mt-16 md:mt-20">
      
      {/* Dynamic Background Blur */}
      <div className="fixed top-0 left-0 w-full h-[60vh] -z-10 overflow-hidden pointer-events-none opacity-30">
        {anime.poster && (
          <Image 
            src={anime.poster} 
            alt="Blur Background" 
            fill 
            className="object-cover blur-[100px] scale-110" 
            unoptimized 
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/80 to-bg-primary" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Column: Poster & Actions (Desktop) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="relative aspect-[2/3] w-full max-w-sm mx-auto lg:max-w-none rounded-2xl overflow-hidden glass border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.5)] group">
              {anime.poster && (
                <Image 
                  src={anime.poster} 
                  alt={anime.title || ""} 
                  fill 
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-105" 
                  unoptimized 
                  priority
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60" />
            </div>
            <div className="max-w-sm mx-auto w-full lg:max-w-none">
              <FavoriteButton animeSlug={slug} animeTitle={anime.title || ""} animeThumbnail={anime.poster} animeType={anime.type} animeStatus={anime.status} />
            </div>
          </div>

          {/* Right Column: Info & Episodes */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Title & Header Info */}
            <div className="glass-panel p-8 rounded-3xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-accent-blue/10 blur-[80px] rounded-full pointer-events-none" />
              
              <div className="relative z-10">
                <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-gray-400 tracking-tight mb-4 leading-tight">
                  {anime.title || "Detail Anime"}
                </h1>
                
                <div className="flex flex-wrap gap-3">
                  {anime.japanese && (
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold text-accent-blue backdrop-blur-md">
                      {anime.japanese}
                    </span>
                  )}
                  {anime.studios && (
                    <span className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-lg text-sm font-semibold text-accent-purple backdrop-blur-md">
                      Studio: {anime.studios}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors hover:bg-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center border border-yellow-500/30 shrink-0">
                  <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Rating</p>
                  <p className="text-lg font-black text-white leading-none mt-1">{displayScore}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors hover:bg-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400/20 to-cyan-500/20 flex items-center justify-center border border-blue-500/30 shrink-0">
                  <Tv className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Tipe</p>
                  <p className="text-lg font-black text-white leading-none mt-1 line-clamp-1">{anime.type || "N/A"}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors hover:bg-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-400/20 to-pink-500/20 flex items-center justify-center border border-purple-500/30 shrink-0">
                  <Film className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Status</p>
                  <p className="text-lg font-black text-white leading-none mt-1 line-clamp-1">{anime.status || "N/A"}</p>
                </div>
              </div>

              <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center gap-4 transition-colors hover:bg-white/10">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-400/20 to-green-500/20 flex items-center justify-center border border-emerald-500/30 shrink-0">
                  <Calendar className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Rilis</p>
                  <p className="text-sm sm:text-base font-black text-white leading-none mt-1 line-clamp-1">{anime.aired || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-accent-blue to-accent-purple" />
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                <BookOpen className="w-6 h-6 text-accent-blue" /> Sinopsis
              </h2>
              <div className="text-text-secondary text-sm md:text-base font-medium leading-relaxed whitespace-pre-line pl-2">
                {synopsisText}
              </div>
            </div>

            {/* Episode List */}
            <div className="glass-panel p-6 md:p-8 rounded-3xl border border-white/10 mb-8">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
                <Play className="w-6 h-6 text-accent-purple fill-accent-purple/20" /> Daftar Episode
              </h2>
              
              {anime.episodeList && anime.episodeList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
                  {anime.episodeList.map((ep, i) => {
                    const epId = ep.episodeId || ep.slug || `episode-${i+1}`;
                    return (
                      <Link
                        key={epId}
                        href={`/episode/${epId}?provider=${provider}`}
                        className="group flex items-center justify-between p-4 bg-white/5 border border-white/5 hover:border-accent-blue/50 rounded-2xl transition-all duration-300 hover:bg-white/10 hover:shadow-[0_0_20px_rgba(0,229,255,0.15)]"
                      >
                        <div className="min-w-0 flex-1 pr-4">
                          <p className="text-sm font-bold text-white group-hover:text-accent-blue transition-colors truncate">
                            {ep.title || `Episode ${i+1}`}
                          </p>
                          {ep.date && (
                            <p className="text-xs text-text-muted flex items-center gap-1.5 mt-1.5 font-medium">
                              <Clock className="w-3.5 h-3.5" /> {ep.date}
                            </p>
                          )}
                        </div>
                        
                        <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center shrink-0 group-hover:bg-gradient-to-r group-hover:from-accent-blue group-hover:to-accent-purple group-hover:border-transparent transition-all duration-300 group-hover:scale-110">
                          <Play className="w-4 h-4 text-white fill-transparent group-hover:fill-white transition-all ml-0.5" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-10 text-center bg-white/5 border border-white/5 rounded-2xl flex flex-col items-center justify-center gap-3">
                  <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center">
                    <span className="text-2xl">⏳</span>
                  </div>
                  <p className="text-text-muted font-medium">Belum ada episode yang dirilis untuk anime ini.</p>
                </div>
              )}
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
