import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Star, Calendar, Tv, Film, Play, BookOpen, Clock } from "lucide-react";
import { animeApi } from "@/lib/api/anime";
import { FavoriteButton } from "@/components/anime/FavoriteButton";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ provider?: string }>;
}

interface AnimeDetailData {
  title?: string;
  poster?: string;
  thumbnail?: string;
  synopsis?: string;
  sinopsis?: string;
  score?: string;
  rating?: string;
  type?: string;
  status?: string;
  studio?: string;
  duration?: string;
  released?: string;
  season?: string;
  genres?: Array<{ name: string; slug: string }>;
  genreList?: Array<{ name: string; slug: string }>;
  episodeList?: Array<{ title: string; slug: string; episode?: string }>;
  episodes?: Array<{ title: string; slug: string; episode?: string }>;
  producers?: string[];
}

interface ApiResponse {
  data?: AnimeDetailData;
  ok?: boolean;
}

async function getDetail(slug: string, provider: string): Promise<AnimeDetailData | null> {
  try {
    let res: ApiResponse;
    if (provider === "akompi") res = await animeApi.akompiDetail(slug) as ApiResponse;
    else if (provider === "samehadaku") res = await animeApi.samehadakuDetail(slug) as ApiResponse;
    else res = await animeApi.animeDetail(slug) as ApiResponse;
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { provider = "otakudesu" } = await searchParams;
  const detail = await getDetail(slug, provider);
  return {
    title: detail?.title || "Anime Detail",
    description: detail?.synopsis?.slice(0, 160) || "Detail anime di AniStream",
  };
}

export default async function AnimeDetailPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { provider = "otakudesu" } = await searchParams;
  const detail = await getDetail(slug, provider);

  if (!detail) notFound();

  const thumbnail = detail.poster || detail.thumbnail || "";
  const synopsis = detail.synopsis || detail.sinopsis || "";
  const score = detail.score || detail.rating;
  const genres = detail.genres || detail.genreList || [];
  const episodes = detail.episodeList || detail.episodes || [];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {thumbnail && (
          <>
            <Image
              src={thumbnail}
              alt={detail.title || ""}
              fill
              className="object-cover object-top blur-sm scale-110 opacity-40"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-bg-primary/70 to-bg-primary" />
          </>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-16">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="flex-shrink-0">
            <div className="w-48 md:w-56 rounded-2xl overflow-hidden border border-white/10 shadow-card">
              {thumbnail ? (
                <Image
                  src={thumbnail}
                  alt={detail.title || ""}
                  width={224}
                  height={320}
                  className="object-cover w-full aspect-[2/3]"
                  unoptimized
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-bg-card flex items-center justify-center">
                  <Film className="w-12 h-12 text-text-muted" />
                </div>
              )}
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-display font-black text-text-primary mb-3">
              {detail.title}
            </h1>

            {/* Meta badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {score && (
                <div className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-semibold text-sm">{score}</span>
                </div>
              )}
              {detail.type && (
                <span className="px-3 py-1.5 rounded-lg text-sm font-medium bg-accent-purple/15 text-accent-purple border border-accent-purple/20">
                  {detail.type}
                </span>
              )}
              {detail.status && (
                <span className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${
                  detail.status.toLowerCase().includes("ong")
                    ? "bg-green-500/10 text-green-400 border-green-500/20"
                    : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                }`}>
                  {detail.status}
                </span>
              )}
            </div>

            {/* Genres */}
            {genres.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {genres.map((g) => (
                  <Link
                    key={g.slug}
                    href={`/genre/${g.slug}`}
                    className="px-2.5 py-1 rounded-md text-xs bg-white/5 border border-white/10 text-text-secondary hover:text-text-primary hover:border-accent-purple/30 transition-all"
                  >
                    {g.name}
                  </Link>
                ))}
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {[
                { icon: Calendar, label: "Rilis", value: detail.released || detail.season },
                { icon: Tv, label: "Studio", value: detail.studio },
                { icon: Clock, label: "Durasi", value: detail.duration },
                { icon: BookOpen, label: "Episode", value: episodes.length > 0 ? `${episodes.length} ep` : undefined },
              ].filter(i => i.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-2 p-3 rounded-xl bg-bg-card border border-white/5">
                  <Icon className="w-4 h-4 text-accent-purple flex-shrink-0" />
                  <div>
                    <p className="text-xs text-text-muted">{label}</p>
                    <p className="text-sm font-medium text-text-primary">{value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3 mb-6">
              {episodes.length > 0 && (
                <Link
                  href={`/episode/${episodes[episodes.length - 1]?.slug}?provider=${provider}`}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-glow transition-all duration-300 hover:scale-105"
                >
                  <Play className="w-5 h-5 fill-white" />
                  Tonton Episode 1
                </Link>
              )}
              <FavoriteButton
                animeSlug={slug}
                animeTitle={detail.title || ""}
                animeThumbnail={thumbnail}
              />
            </div>

            {/* Synopsis */}
            {synopsis && (
              <div>
                <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-2">Sinopsis</h2>
                <p className="text-text-secondary text-sm leading-relaxed">{synopsis}</p>
              </div>
            )}
          </div>
        </div>

        {/* Episode List */}
        {episodes.length > 0 && (
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-1 h-6 rounded-full bg-gradient-primary" />
              <h2 className="text-xl font-display font-bold text-text-primary">
                Daftar Episode ({episodes.length})
              </h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {episodes.map((ep) => (
                <Link
                  key={ep.slug}
                  href={`/episode/${ep.slug}?provider=${provider}`}
                  className="group flex items-center gap-2 p-3 rounded-xl bg-bg-card border border-white/5 hover:border-accent-purple/30 hover:bg-bg-overlay transition-all"
                >
                  <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:shadow-glow transition-all">
                    <Play className="w-3 h-3 text-white fill-white" />
                  </div>
                  <span className="text-sm text-text-secondary group-hover:text-text-primary transition-colors line-clamp-1">
                    {ep.title || ep.episode || `Episode ${ep.slug}`}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
