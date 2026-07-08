"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, Loader2 } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { animeClientApi } from "@/lib/api/animeClient";

interface PageProps {
  params: Promise<{ slug: string }>;
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
  prevEpisode?: string | { slug?: string; url?: string };
  nextEpisode?: string | { slug?: string; url?: string };
  defaultStreamingUrl?: string;
  streamingUrl?: string;
  servers?: StreamServer[];
  qualities?: StreamServer[];
}

export default function NekoEpisodePage({ params }: PageProps) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(true);

  // Helper to safely convert full URL to base64 for slug navigation
  const getSlugFromUrl = (url?: string) => {
    if (!url) return "";
    try {
      return btoa(url).replace(/\//g, "_").replace(/\+/g, "-");
    } catch {
      return "";
    }
  };

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        // Decode base64 slug to retrieve original endpoint URL
        const decodedUrl = atob(slug.replace(/_/g, "/").replace(/-/g, "+"));
        const res: any = await animeClientApi.nekoGet(decodedUrl);
        setEpisode(res?.data || null);
      } catch (err) {
        console.error("Neko watch load fail:", err);
        setEpisode(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-primary">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h1 className="text-xl font-bold text-text-primary">Konten Tidak Ditemukan</h1>
        <p className="text-text-muted text-sm mt-1">Gagal mendekode slug atau server Sanka sedang membatasi request.</p>
        <Link href="/nekopoi" className="mt-4 px-4 py-2 bg-pink-600 text-white rounded-lg">Kembali ke Nekopoi</Link>
      </div>
    );
  }

  const servers: StreamServer[] = episode.servers || episode.qualities || [];
  const defaultUrl = episode.defaultStreamingUrl || episode.streamingUrl || servers[0]?.url || servers[0]?.iframe || "";

  // Handle navigation slugs safely
  const prevUrl = typeof episode.prevEpisode === "string" ? episode.prevEpisode : episode.prevEpisode?.url;
  const nextUrl = typeof episode.nextEpisode === "string" ? episode.nextEpisode : episode.nextEpisode?.url;

  const prevSlug = prevUrl ? getSlugFromUrl(prevUrl) : null;
  const nextSlug = nextUrl ? getSlugFromUrl(nextUrl) : null;

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
          <span className="text-text-primary truncate">{episode.title || "Detail Nonton"}</span>
        </div>

        {/* Player */}
        <VideoPlayer
          streamUrl={defaultUrl}
          servers={servers}
          episodeSlug={slug}
          animeSlug={episode.animeSlug}
          episodeTitle={episode.title}
          provider="nekopoi"
        />

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
