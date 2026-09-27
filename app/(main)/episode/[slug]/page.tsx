"use client";
import { useState, useEffect, use } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Home, Loader2 } from "lucide-react";
import { VideoPlayer } from "@/components/player/VideoPlayer";
import { CommentSection } from "@/components/anime/CommentSection";
import { animeClientApi } from "@/lib/api/animeClient";

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
  prevEpisode?: string | { slug?: string; episodeId?: string };
  nextEpisode?: string | { slug?: string; episodeId?: string };
  defaultStreamingUrl?: string;
  streamingUrl?: string;
  servers?: ServerItem[] | any;
  server?: { qualities?: { title?: string; serverList?: ServerItem[] }[] } | ServerItem[];
  qualities?: { title?: string; serverList?: ServerItem[] }[];
  downloads?: unknown;
  poster?: string;
}

export default function EpisodePage({ params, searchParams }: PageProps) {
  const resolvedParams = use(params);
  const resolvedSearchParams = use(searchParams);
  const slug = resolvedParams.slug;
  const provider = resolvedSearchParams.provider || "samehadaku";

  const [episode, setEpisode] = useState<EpisodeData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        let res: any;
        if (provider === "akompi") res = await animeClientApi.akompiEpisode(slug);
        else if (provider === "samehadaku") res = await animeClientApi.samehadakuEpisode(slug);
        else if (provider === "donghua") res = await animeClientApi.donghuaEpisode(slug);
        else res = await animeClientApi.episodeDetail(slug);
        
        setEpisode(res?.data || null);
      } catch {
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
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
          <span className="text-sm font-medium text-text-secondary">Memuat episode...</span>
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
        <div className="p-8 rounded-2xl bg-bg-secondary border border-white/[0.08] text-center max-w-md shadow-xl">
          <h1 className="text-xl font-bold text-white mb-2">Episode Tidak Ditemukan</h1>
          <p className="text-text-muted text-sm mb-6">Episode yang Anda cari mungkin telah dihapus atau tidak tersedia.</p>
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

  const resolvedServers: ServerItem[] = [];

  if (Array.isArray(episode.servers)) {
    episode.servers.forEach(s => resolvedServers.push(s));
  } else if (episode.server && Array.isArray(episode.server)) {
    episode.server.forEach((s: any) => resolvedServers.push(s));
  }

  const allQualities = Array.isArray(episode.qualities) ? episode.qualities : (
    episode.server && !Array.isArray(episode.server) && Array.isArray(episode.server.qualities) 
      ? episode.server.qualities 
      : []
  );

  allQualities.forEach(q => {
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

  const defaultUrl = episode.defaultStreamingUrl || episode.streamingUrl || resolvedServers[0]?.url || resolvedServers[0]?.iframe || "";

  const prevSlug = typeof episode.prevEpisode === "string"
    ? episode.prevEpisode
    : (episode.prevEpisode?.slug || episode.prevEpisode?.episodeId);

  const nextSlug = typeof episode.nextEpisode === "string"
    ? episode.nextEpisode
    : (episode.nextEpisode?.slug || episode.nextEpisode?.episodeId);

  return (
    <div className="min-h-screen bg-bg-primary pt-6 pb-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs sm:text-sm text-text-muted mb-5 overflow-x-auto whitespace-nowrap scrollbar-hide py-1">
          <Link href="/" className="hover:text-white flex items-center gap-1.5 transition-colors">
            <Home className="w-3.5 h-3.5" />
            <span>Beranda</span>
          </Link>
          <span className="text-white/20">/</span>
          {(episode.animeSlug || (episode as any).animeId) && (
            <>
              <Link
                href={`/anime/${episode.animeSlug || (episode as any).animeId}`}
                className="hover:text-white transition-colors"
              >
                {episode.animeTitle || episode.title?.split(' Episode')[0] || "Detail Anime"}
              </Link>
              <span className="text-white/20">/</span>
            </>
          )}
          <span className="text-white font-medium truncate max-w-[200px] sm:max-w-xs">{episode.title}</span>
        </div>

        {/* Video Player Container */}
        <div className="rounded-2xl overflow-hidden bg-bg-secondary border border-white/[0.08] shadow-2xl">
          <VideoPlayer
            streamUrl={defaultUrl}
            servers={resolvedServers}
            episodeSlug={slug}
            animeSlug={episode.animeSlug || (episode as any).animeId}
            episodeTitle={episode.title}
            poster={episode.poster}
            provider={provider}
          />
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center justify-between mt-6 gap-3">
          {prevSlug ? (
            <Link
              href={`/episode/${prevSlug}?provider=${provider}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-bg-secondary hover:bg-bg-card text-text-secondary hover:text-white border border-white/[0.08] transition-all text-xs sm:text-sm font-semibold group"
            >
              <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span>Eps Sebelumnya</span>
            </Link>
          ) : (
            <div />
          )}

          {nextSlug ? (
            <Link
              href={`/episode/${nextSlug}?provider=${provider}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black hover:bg-slate-200 font-semibold transition-all text-xs sm:text-sm shadow-md group"
            >
              <span>Eps Selanjutnya</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div />
          )}
        </div>

        {/* Komentar Section */}
        <div className="mt-10 rounded-2xl bg-bg-secondary/60 border border-white/[0.08] p-5 sm:p-8">
          <CommentSection episodeSlug={slug} />
        </div>
      </div>
    </div>
  );
}
