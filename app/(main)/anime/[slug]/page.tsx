"use client";
import { useState, useEffect, use } from "react";
import Image from "next/image";
import Link from "next/link";
import { Star, Calendar, Tv, Film, Play, BookOpen, Clock, Loader2 } from "lucide-react";
import { FavoriteButton } from "@/components/anime/FavoriteButton";
import { animeClientApi } from "@/lib/api/animeClient";

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
  const provider = resolvedSearchParams.provider || "otakudesu";

  const [anime, setAnime] = useState<AnimeDetailData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res: any = await animeClientApi.animeDetail(slug);
        setAnime(res?.data || null);
      } catch {
        setAnime(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold text-text-primary">Anime Tidak Ditemukan</h1>
        <Link href="/" className="mt-4 px-4 py-2 bg-accent-purple text-white rounded-lg">Kembali ke Beranda</Link>
      </div>
    );
  }

  const synopsisText = typeof anime.synopsis === "string" 
    ? anime.synopsis 
    : anime.synopsis?.paragraphs?.join("\n\n") || "";

  return (
    <div className="min-h-screen pb-12">
      {/* Background Banner Blur */}
      <div className="absolute top-0 left-0 right-0 h-[40vh] overflow-hidden opacity-10 pointer-events-none">
        {anime.poster && (
          <Image src={anime.poster} alt={anime.title || ""} fill className="object-cover filter blur-3xl scale-125" unoptimized />
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 relative">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Poster Column */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] w-full rounded-2xl overflow-hidden border border-white/10 shadow-lg bg-bg-card">
              {anime.poster && (
                <Image src={anime.poster} alt={anime.title || ""} fill className="object-cover" unoptimized />
              )}
            </div>
            <div className="mt-4">
              <FavoriteButton animeSlug={slug} animeTitle={anime.title || ""} animeThumbnail={anime.poster} />
            </div>
          </div>

          {/* Info Details Column */}
          <div className="md:col-span-3 space-y-6">
            <div>
              <h1 className="text-3xl md:text-5xl font-display font-black text-text-primary tracking-tight mb-2">
                {anime.title}
              </h1>
              {anime.japanese && <p className="text-text-muted text-sm italic font-medium">{anime.japanese}</p>}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-bg-card border border-white/5">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase">Rating</p>
                  <p className="text-sm font-semibold text-text-primary">{anime.score || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tv className="w-4 h-4 text-accent-purple" />
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase">Tipe</p>
                  <p className="text-sm font-semibold text-text-primary">{anime.type || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Film className="w-4 h-4 text-accent-blue" />
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase">Status</p>
                  <p className="text-sm font-semibold text-text-primary">{anime.status || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-pink-400" />
                <div>
                  <p className="text-[10px] text-text-muted font-bold uppercase">Rilis</p>
                  <p className="text-sm font-semibold text-text-primary">{anime.aired || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-2 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-accent-purple" /> Sinopsis
              </h2>
              <p className="text-text-secondary text-sm leading-relaxed whitespace-pre-line">{synopsisText}</p>
            </div>

            {/* Episode List */}
            <div>
              <h2 className="text-lg font-bold text-text-primary mb-3 flex items-center gap-2">
                <Play className="w-5 h-5 text-accent-purple" /> Daftar Episode
              </h2>
              {anime.episodeList && anime.episodeList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {anime.episodeList.map((ep, i) => {
                    const epId = ep.episodeId || ep.slug || `episode-${i+1}`;
                    return (
                      <Link
                        key={epId}
                        href={`/episode/${epId}?provider=${provider}`}
                        className="flex items-center justify-between p-3.5 rounded-xl bg-bg-card border border-white/5 hover:border-accent-purple/30 hover:bg-bg-overlay transition-all group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold text-text-primary group-hover:text-accent-purple transition-colors truncate">
                            {ep.title || `Episode ${i+1}`}
                          </p>
                          {ep.date && (
                            <p className="text-[10px] text-text-muted flex items-center gap-1 mt-1 font-medium">
                              <Clock className="w-3 h-3" /> {ep.date}
                            </p>
                          )}
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 group-hover:bg-accent-purple/20 transition-all">
                          <Play className="w-3.5 h-3.5 text-text-secondary group-hover:text-accent-purple transition-colors fill-current" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-4 text-center rounded-xl bg-white/5 text-text-muted italic text-sm">
                  Belum ada episode tersedia.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
