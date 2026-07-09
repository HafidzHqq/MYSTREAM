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
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <div className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <span className="text-xl font-black uppercase text-black">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
        <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
          <h1 className="text-2xl font-black text-black uppercase mb-4">Anime Tidak Ditemukan</h1>
          <Link href="/" className="inline-block w-full px-6 py-3 bg-accent-yellow border-[3px] border-black text-black font-black uppercase brutal-hover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
    <div className="min-h-screen pb-12 bg-bg-primary mt-16 md:mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Poster Column */}
          <div className="md:col-span-1">
            <div className="relative aspect-[2/3] w-full rounded-none overflow-hidden border-[3px] border-black bg-white brutal-box">
              {anime.poster && (
                <Image src={anime.poster} alt={anime.title || ""} fill className="object-cover" unoptimized />
              )}
            </div>
            <div className="mt-6">
              <FavoriteButton animeSlug={slug} animeTitle={anime.title || ""} animeThumbnail={anime.poster} />
            </div>
          </div>

          {/* Info Details Column */}
          <div className="md:col-span-3 space-y-8">
            <div className="bg-white border-[3px] border-black p-6 md:p-8 brutal-box shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h1 className="text-3xl md:text-5xl font-black text-black tracking-tight mb-4 uppercase leading-none">
                {anime.title || "Detail Anime"}
              </h1>
              {anime.japanese && <p className="text-black text-base font-bold bg-accent-cyan inline-block px-3 py-1 border-2 border-black">{anime.japanese}</p>}
            </div>

            {/* Quick Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-accent-yellow border-[3px] border-black brutal-box shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <div className="flex items-center gap-3">
                <div className="bg-white border-2 border-black p-2"><Star className="w-6 h-6 text-black fill-black" /></div>
                <div>
                  <p className="text-[10px] text-black font-black uppercase">Rating</p>
                  <p className="text-lg font-black text-black leading-none">{displayScore}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border-2 border-black p-2"><Tv className="w-6 h-6 text-black" /></div>
                <div>
                  <p className="text-[10px] text-black font-black uppercase">Tipe</p>
                  <p className="text-lg font-black text-black leading-none">{anime.type || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border-2 border-black p-2"><Film className="w-6 h-6 text-black" /></div>
                <div>
                  <p className="text-[10px] text-black font-black uppercase">Status</p>
                  <p className="text-lg font-black text-black leading-none">{anime.status || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-white border-2 border-black p-2"><Calendar className="w-6 h-6 text-black" /></div>
                <div>
                  <p className="text-[10px] text-black font-black uppercase">Rilis</p>
                  <p className="text-lg font-black text-black leading-none">{anime.aired || "N/A"}</p>
                </div>
              </div>
            </div>

            {/* Synopsis */}
            <div className="bg-white border-[3px] border-black p-6 md:p-8 brutal-box shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black text-black mb-4 flex items-center gap-3 uppercase">
                <BookOpen className="w-8 h-8 text-black" /> Sinopsis
              </h2>
              <p className="text-black text-base font-bold leading-relaxed whitespace-pre-line border-l-4 border-black pl-4">{synopsisText}</p>
            </div>

            {/* Episode List */}
            <div className="bg-accent-blue border-[3px] border-black p-6 md:p-8 brutal-box shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3 uppercase">
                <Play className="w-8 h-8 text-black fill-black" /> Daftar Episode
              </h2>
              {anime.episodeList && anime.episodeList.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {anime.episodeList.map((ep, i) => {
                    const epId = ep.episodeId || ep.slug || `episode-${i+1}`;
                    return (
                      <Link
                        key={epId}
                        href={`/episode/${epId}?provider=${provider}`}
                        className="flex items-center justify-between p-4 bg-white border-[3px] border-black brutal-hover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-pink group"
                      >
                        <div className="min-w-0 flex-1">
                          <p className="text-base font-black text-black group-hover:underline underline-offset-2 truncate uppercase">
                            {ep.title || `Episode ${i+1}`}
                          </p>
                          {ep.date && (
                            <p className="text-xs text-black flex items-center gap-1 mt-2 font-bold bg-gray-100 border-2 border-black inline-block px-1.5 py-0.5">
                              <Clock className="w-3.5 h-3.5 inline" strokeWidth={3} /> {ep.date}
                            </p>
                          )}
                        </div>
                        <div className="w-10 h-10 bg-accent-yellow border-[3px] border-black flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 text-black fill-black ml-1" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center border-[3px] border-black bg-white text-black font-black uppercase text-lg brutal-box">
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
