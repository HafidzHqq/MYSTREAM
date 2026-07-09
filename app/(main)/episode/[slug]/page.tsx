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
  prevEpisode?: string | { slug?: string };
  nextEpisode?: string | { slug?: string };
  defaultStreamingUrl?: string;
  streamingUrl?: string;
  servers?: ServerItem[] | any;
  server?: { qualities?: { title?: string; serverList?: ServerItem[] }[] } | ServerItem[];
  qualities?: { title?: string; serverList?: ServerItem[] }[];
  downloads?: unknown;
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
        <div className="bg-white border-[3px] border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-4">
          <Loader2 className="w-8 h-8 text-black animate-spin" />
          <span className="text-xl font-black uppercase text-black">Memuat...</span>
        </div>
      </div>
    );
  }

  if (!episode) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-bg-primary">
        <div className="bg-white border-[3px] border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center max-w-md">
          <h1 className="text-2xl font-black text-black uppercase mb-4">Episode Tidak Ditemukan</h1>
          <Link href="/" className="inline-block w-full px-6 py-3 bg-accent-yellow border-[3px] border-black text-black font-black uppercase brutal-hover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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
    : episode.prevEpisode?.slug;

  const nextSlug = typeof episode.nextEpisode === "string"
    ? episode.nextEpisode
    : episode.nextEpisode?.slug;

  return (
    <div className="min-h-screen bg-bg-primary mt-16 md:mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-black font-bold mb-6 bg-white border-2 border-black inline-flex px-4 py-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
          <Link href="/" className="hover:underline flex items-center gap-1 uppercase">
            <Home className="w-4 h-4" /> Beranda
          </Link>
          <span className="font-black">/</span>
          {(episode.animeSlug || (episode as any).animeId) && (
            <>
              <Link href={`/anime/${episode.animeSlug || (episode as any).animeId}`} className="hover:underline uppercase">
                {episode.animeTitle || episode.title?.split(' Episode')[0] || "Detail Anime"}
              </Link>
              <span className="font-black">/</span>
            </>
          )}
          <span className="text-black uppercase truncate max-w-[200px] sm:max-w-xs">{episode.title}</span>
        </div>

        {/* Video Player */}
        <div className="mb-6 brutal-box bg-white border-[3px] border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
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
        <div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">
          {prevSlug ? (
            <Link
              href={`/episode/${prevSlug}?provider=${provider}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-[3px] border-black text-black font-black uppercase brutal-hover hover:bg-gray-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
            >
              <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform stroke-[3]" />
              Eps Sebelumnya
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}

          {nextSlug ? (
            <Link
              href={`/episode/${nextSlug}?provider=${provider}`}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-accent-yellow border-[3px] border-black text-black font-black uppercase brutal-hover hover:bg-accent-pink shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group"
            >
              Eps Selanjutnya
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform stroke-[3]" />
            </Link>
          ) : (
            <div className="hidden sm:block" />
          )}
        </div>

        {/* Komentar Section */}
        <div className="mt-12 bg-white border-[3px] border-black p-6 md:p-8 brutal-box shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <CommentSection episodeSlug={slug} />
        </div>
      </div>
    </div>
  );
}
