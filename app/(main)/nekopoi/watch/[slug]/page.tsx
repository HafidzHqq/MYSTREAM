import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Play, ChevronLeft, ChevronRight, Home } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";

export const dynamic = 'force-dynamic';

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
}

interface ApiResponse {
  data?: EpisodeData;
}

async function getNekoEpisode(slug: string): Promise<EpisodeData | null> {
  try {
    const BASE = process.env.ANIME_API_BASE || 'https://www.sankavollerei.web.id/anime';
    const res = await fetch(`${BASE}/neko/episode/${slug}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://nekopoi.care/',
      },
      next: { revalidate: 300 },
    });
    const data: ApiResponse = await res.json();
    return data?.data || null;
  } catch {
    return null;
  }
}

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  return { title: `Nonton ${slug} | Nekopoi 18+`, robots: { index: false } };
}

export default async function NekoEpisodePage({ params }: PageProps) {
  const { slug } = await params;
  const episode = await getNekoEpisode(slug);

  if (!episode) notFound();

  const servers: StreamServer[] = episode.servers || episode.qualities || [];
  const defaultUrl = episode.defaultStreamingUrl || episode.streamingUrl || servers[0]?.url || servers[0]?.iframe || "";

  const prevSlug = typeof episode.prevEpisode === "string" ? episode.prevEpisode : episode.prevEpisode?.slug;
  const nextSlug = typeof episode.nextEpisode === "string" ? episode.nextEpisode : episode.nextEpisode?.slug;

  return (
    <div className="min-h-screen bg-bg-primary">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-text-muted mb-4">
          <Link href="/" className="hover:text-text-primary transition-colors flex items-center gap-1">
            <Home className="w-3 h-3" /> Beranda
          </Link>
          <span>/</span>
          <Link href="/nekopoi" className="hover:text-pink-400 transition-colors">Nekopoi 18+</Link>
          <span>/</span>
          <span className="text-text-primary truncate">{episode.title}</span>
        </div>

        {/* Player */}
        <Suspense fallback={<div className="video-container bg-bg-card rounded-2xl animate-pulse" />}>
          <VideoPlayer
            streamUrl={defaultUrl}
            servers={servers}
            episodeSlug={slug}
            animeSlug={episode.animeSlug}
            episodeTitle={episode.title}
            provider="nekopoi"
          />
        </Suspense>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-4 gap-4">
          {prevSlug ? (
            <Link href={`/nekopoi/watch/${prevSlug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl glass border border-white/10 text-text-secondary hover:text-text-primary hover:border-pink-500/30 transition-all group">
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Episode Sebelumnya
            </Link>
          ) : <div />}
          {nextSlug ? (
            <Link href={`/nekopoi/watch/${nextSlug}`}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all group">
              Episode Selanjutnya
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          ) : <div />}
        </div>
      </div>
    </div>
  );
}
