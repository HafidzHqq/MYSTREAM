import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, ChevronRight, Home, Server } from "lucide-react";
import { animeApi } from "@/lib/api/anime";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { CommentSection } from "@/components/anime/CommentSection";

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ provider?: string }>;
}

interface StreamServer {
  name?: string;
  url?: string;
  iframe?: string;
  serverName?: string;
  streamUrl?: string;
}

interface EpisodeData {
  title?: string;
  animeTitle?: string;
  animeSlug?: string;
  prevEpisode?: string | { slug?: string };
  nextEpisode?: string | { slug?: string };
  defaultStreamingUrl?: string;
  streamingUrl?: string;
  servers?: StreamServer[];
  qualities?: StreamServer[];
  downloads?: StreamServer[];
}

interface ApiResponse {
  data?: EpisodeData;
}

async function getEpisode(slug: string, provider: string): Promise<EpisodeData | null> {
  try {
    let res: ApiResponse;
    if (provider === "akompi") res = await animeApi.akompiEpisode(slug) as ApiResponse;
    else if (provider === "samehadaku") res = await animeApi.samehadakuEpisode(slug) as ApiResponse;
    else res = await animeApi.episodeDetail(slug) as ApiResponse;
    return res?.data || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const { provider = "otakudesu" } = await searchParams;
  const ep = await getEpisode(slug, provider);
  return {
    title: ep?.title || "Tonton Episode",
    robots: { index: false },
  };
}

export default async function EpisodePage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const { provider = "otakudesu" } = await searchParams;
  const episode = await getEpisode(slug, provider);

  if (!episode) notFound();

  const servers: StreamServer[] = episode.servers || episode.qualities || [];
  const defaultUrl = episode.defaultStreamingUrl || episode.streamingUrl || servers[0]?.url || servers[0]?.iframe || "";

  const prevSlug = typeof episode.prevEpisode === "string"
    ? episode.prevEpisode
    : episode.prevEpisode?.slug;
  const nextSlug = typeof episode.nextEpisode === "string"
    ? episode.nextEpisode
    : episode.nextEpisode?.slug;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link href="/" className="hover:text-text-primary transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Beranda
          </Link>
          <span>/</span>
          {episode.animeSlug && (
            <>
              <Link
                href={`/anime/${episode.animeSlug}?provider=${provider}`}
                className="hover:text-text-primary transition-colors truncate max-w-[200px]"
              >
                {episode.animeTitle}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-primary truncate max-w-[200px]">{episode.title}</span>
        </div>

        {/* Video Player */}
        <VideoPlayer
          streamUrl={defaultUrl}
          servers={servers}
          episodeSlug={slug}
          animeSlug={episode.animeSlug}
          episodeTitle={episode.title}
          provider={provider}
        />

        {/* Episode Navigation */}
        <div className="flex items-center justify-between mt-4 gap-4">
          {prevSlug ? (
            <Link
              href={`/episode/${prevSlug}?provider=${provider}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-text-secondary hover:text-text-primary hover:border-accent-purple/30 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Episode Sebelumnya
            </Link>
          ) : <div />}
          {nextSlug ? (
            <Link
              href={`/episode/${nextSlug}?provider=${provider}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-glow transition-all group"
            >
              Episode Selanjutnya
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>

        {/* Server indicator */}
        {servers.length > 0 && (
          <div className="mt-4 p-3 rounded-xl glass border border-white/5">
            <div className="flex items-center gap-2 text-sm text-text-muted">
              <Server className="w-4 h-4" />
              <span>Server tersedia: {servers.length} opsi. Gunakan tombol di atas player untuk mengganti.</span>
            </div>
          </div>
        )}

        {/* Comments */}
        <CommentSection episodeSlug={slug} />
      </div>
    </div>
  );
}
