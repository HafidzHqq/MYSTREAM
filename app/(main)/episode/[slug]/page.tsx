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

interface ServerItem {
  title?: string;
  name?: string;
  serverId?: string;
  href?: string;
  url?: string;
  iframe?: string;
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
  servers?: ServerItem[];
  qualities?: { title?: string; serverList?: ServerItem[] }[];
  downloads?: unknown;
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

  // Ekstrak server list menjadi flat array yang rapi dan seragam
  const resolvedServers: ServerItem[] = [];

  if (Array.isArray(episode.servers)) {
    episode.servers.forEach(s => resolvedServers.push(s));
  }

  if (Array.isArray(episode.qualities)) {
    episode.qualities.forEach(q => {
      const qTitle = q.title || "";
      if (Array.isArray(q.serverList)) {
        q.serverList.forEach(s => {
          resolvedServers.push({
            title: `${s.title || s.name} (${qTitle})`,
            serverId: s.serverId,
            href: s.href,
            url: s.url,
            iframe: s.iframe,
          });
        });
      }
    });
  }

  const defaultUrl = episode.defaultStreamingUrl || episode.streamingUrl || resolvedServers[0]?.url || resolvedServers[0]?.iframe || "";

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
              <Link href={`/anime/${episode.animeSlug}`} className="hover:text-text-primary transition-colors">
                {episode.animeTitle || "Detail Anime"}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-text-primary truncate">{episode.title}</span>
        </div>

        {/* Video Player */}
        <VideoPlayer
          streamUrl={defaultUrl}
          servers={resolvedServers}
          episodeSlug={slug}
          animeSlug={episode.animeSlug}
          episodeTitle={episode.title}
          provider={provider}
        />

        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mt-6 gap-4">
          {prevSlug ? (
            <Link
              href={`/episode/${prevSlug}?provider=${provider}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-text-secondary hover:text-text-primary hover:border-accent-purple/30 transition-all group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Eps Sebelumnya
            </Link>
          ) : (
            <div />
          )}

          {nextSlug ? (
            <Link
              href={`/episode/${nextSlug}?provider=${provider}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-white font-bold hover:shadow-glow transition-all group"
            >
              Eps Selanjutnya
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Komentar Section */}
        <CommentSection episodeSlug={slug} />
      </div>
    </div>
  );
}
