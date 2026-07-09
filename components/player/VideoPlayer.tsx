"use client";
import { useState, useEffect } from "react";
import { Server, ExternalLink, AlertCircle, Play, Loader2, Settings, Maximize, Volume2, VolumeX } from "lucide-react";
import { clsx } from "clsx";

interface ServerItem {
  title?: string;
  serverId?: string;
  href?: string;
  name?: string;
  url?: string;
  iframe?: string;
  streamUrl?: string;
}

interface StreamServer {
  title?: string;
  serverList?: ServerItem[];
  servers?: ServerItem[];
  qualities?: { title?: string; serverList?: ServerItem[] }[];
}

interface VideoPlayerProps {
  streamUrl: string;
  servers?: StreamServer | ServerItem[];
  episodeSlug?: string;
  animeSlug?: string;
  episodeTitle?: string;
  provider?: string;
}

export function VideoPlayer({
  streamUrl,
  servers = [],
  episodeTitle,
  provider,
}: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [activeServer, setActiveServer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);

  // Normalisasikan daftar server dari bermacam format Sanka API
  const [resolvedServers, setResolvedServers] = useState<{ name: string; url: string; id?: string; quality?: string }[]>([]);

  useEffect(() => {
    const list: { name: string; url: string; id?: string; quality?: string }[] = [];

    // Tambahkan server utama bawaan
    if (streamUrl) {
      list.push({ name: "Server Utama", url: streamUrl, quality: "auto" });
    }

    // Ekstrak data server pendukung
    if (Array.isArray(servers)) {
      servers.forEach((s, i) => {
        const url = s.url || s.iframe || s.streamUrl || "";
        const id = s.serverId;
        // Detect quality from name
        const name = s.name || s.title || `Server ${i + 2}`;
        const quality = detectQuality(name);
        list.push({ name, url, id, quality });
      });
    } else if (servers && typeof servers === "object") {
      const sObj = servers as StreamServer;
      const sList = sObj.serverList || sObj.servers || [];
      if (Array.isArray(sList)) {
        sList.forEach((s, i) => {
          const name = s.title || s.name || `Server ${i + 2}`;
          list.push({
            name,
            url: s.url || s.iframe || s.streamUrl || "",
            id: s.serverId,
            quality: detectQuality(name),
          });
        });
      }

      // Ambil dari format qualities jika ada
      if (Array.isArray(sObj.qualities)) {
        sObj.qualities.forEach((q) => {
          const qTitle = q.title || "";
          if (Array.isArray(q.serverList)) {
            q.serverList.forEach((s) => {
              list.push({
                name: `${s.title || s.name} (${qTitle})`,
                url: s.url || s.iframe || s.streamUrl || "",
                id: s.serverId,
                quality: qTitle.toLowerCase(),
              });
            });
          }
        });
      }
    }

    const unique = list.filter((s, i, arr) => (s.url || s.id) && arr.findIndex(x => (x.url && x.url === s.url) || (x.id && x.id === s.id)) === i);
    setResolvedServers(unique);
    
    // Automatically select the first server on load, and resolve its ID if it doesn't have a URL
    if (unique.length > 0) {
      const firstServer = unique[0];
      if (!firstServer.url && firstServer.id) {
        // Resolve it immediately
        setLoading(true);
        fetch(`/api/anime/server/${firstServer.id}?provider=${provider || 'otakudesu'}`)
          .then(res => {
            if (!res.ok) throw new Error("Proxy error");
            return res.json();
          })
          .then(data => {
             const resolvedUrl = data?.data?.url || data?.data?.iframe || data?.data?.streamUrl || "";
             setCurrentUrl(resolvedUrl);
          })
          .catch(() => setIframeError(true))
          .finally(() => setLoading(false));
      } else {
        setCurrentUrl(firstServer.url || "");
      }
      setActiveServer(0);
    }
  }, [streamUrl, servers, provider]);

  function detectQuality(name: string): string {
    const lower = name.toLowerCase();
    if (lower.includes("1080")) return "1080p";
    if (lower.includes("720")) return "720p";
    if (lower.includes("480")) return "480p";
    if (lower.includes("360")) return "360p";
    return "auto";
  }

  // Group servers by quality
  const qualityGroups = resolvedServers.reduce((acc, server, idx) => {
    const q = server.quality || "auto";
    if (!acc[q]) acc[q] = [];
    acc[q].push({ ...server, idx });
    return acc;
  }, {} as Record<string, (typeof resolvedServers[0] & { idx: number })[]>);

  const qualityOrder = ["1080p", "720p", "480p", "360p", "auto"];
  const sortedQualities = qualityOrder.filter(q => qualityGroups[q]);

  const handleServer = async (server: { name: string; url: string; id?: string }, index: number) => {
    setActiveServer(index);
    setIframeError(false);

    // Jika server hanya memiliki ID, ambil url aslinya lewat proxy API
    if (!server.url && server.id) {
      setLoading(true);
      try {
        const res = await fetch(`/api/anime/server/${server.id}?provider=${provider || 'otakudesu'}`);
        if (!res.ok) throw new Error("Proxy error");
        const data = await res.json();
        const resolvedUrl = data?.data?.url || data?.data?.iframe || data?.data?.streamUrl || "";
        setCurrentUrl(resolvedUrl);
      } catch {
        setIframeError(true);
      } finally {
        setLoading(false);
      }
    } else {
      setCurrentUrl(server.url);
    }
  };

  const isDirectVideo = currentUrl.endsWith(".mp4") || currentUrl.includes(".mp4?") || currentUrl.includes("drive.google.com/file");
  const isRedirectLink = currentUrl.includes("gofile.io") || currentUrl.includes("mega.nz") || currentUrl.includes("drive.google.com/open") || currentUrl.includes("odlink") || currentUrl.includes("desustream.me/odlink") || currentUrl.includes("desustream");

  const currentQuality = resolvedServers[activeServer]?.quality || "auto";

  return (
    <div className="rounded-2xl overflow-hidden bg-black border border-white/5 shadow-card">
      
      {/* Quality & Server Selector Header */}
      <div className="flex items-center gap-2 p-3.5 bg-bg-card border-b border-white/5 overflow-x-auto scrollbar-hide">
        <Server className="w-4 h-4 text-accent-purple flex-shrink-0" />
        
        {/* Quality Badge */}
        <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-accent-purple/20 text-accent-purple border border-accent-purple/20 flex-shrink-0">
          {currentQuality}
        </span>

        {resolvedServers.length > 1 && (
          <>
            <div className="w-px h-5 bg-white/10 flex-shrink-0" />
            <div className="flex gap-1.5">
              {resolvedServers.map((server, i) => (
                <button
                  key={i}
                  onClick={() => handleServer(server, i)}
                  className={clsx(
                    "px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex-shrink-0",
                    activeServer === i
                      ? "bg-accent-purple text-white shadow-glow"
                      : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
                  )}
                >
                  {server.name}
                </button>
              ))}
            </div>
          </>
        )}
        
        {/* Settings Button */}
        <div className="ml-auto flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={clsx(
              "p-1.5 rounded-lg transition-all",
              showSettings ? "bg-accent-purple/20 text-accent-purple" : "text-text-muted hover:text-text-primary hover:bg-white/5"
            )}
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="bg-bg-overlay border-b border-white/5 p-4 animate-slide-up">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
            {/* Quality Selection */}
            {sortedQualities.length > 1 && (
              <div>
                <h4 className="text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Kualitas Video</h4>
                <div className="flex flex-wrap gap-2">
                  {sortedQualities.map(q => (
                    <button
                      key={q}
                      onClick={() => {
                        const firstInGroup = qualityGroups[q][0];
                        handleServer(firstInGroup, firstInGroup.idx);
                      }}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                        currentQuality === q
                          ? "bg-accent-purple text-white shadow-glow"
                          : "bg-white/5 text-text-secondary hover:bg-white/10"
                      )}
                    >
                      {q === "auto" ? "Auto" : q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Playback Options */}
            <div>
              <h4 className="text-xs font-bold text-text-secondary mb-2 uppercase tracking-wider">Pemutaran</h4>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setAutoPlay(!autoPlay)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                    autoPlay ? "bg-emerald-500/20 text-emerald-400" : "bg-white/5 text-text-secondary hover:bg-white/10"
                  )}
                >
                  <Play className="w-3 h-3" />
                  Auto-Play {autoPlay ? "On" : "Off"}
                </button>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className={clsx(
                    "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5",
                    isMuted ? "bg-red-500/20 text-red-400" : "bg-white/5 text-text-secondary hover:bg-white/10"
                  )}
                >
                  {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
                  {isMuted ? "Muted" : "Unmuted"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Player Display Area */}
      <div className="relative video-container bg-bg-secondary w-full min-h-[300px]">
        {loading ? (
          /* Loading State */
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-card gap-3">
            <Loader2 className="w-10 h-10 text-accent-purple animate-spin" />
            <p className="text-xs text-text-muted">Mengambil URL server video asli...</p>
          </div>
        ) : currentUrl ? (
          isDirectVideo ? (
            /* MP4 Direct Link Playback */
            <video
              src={currentUrl}
              controls
              autoPlay={autoPlay}
              muted={isMuted}
              className="absolute inset-0 w-full h-full object-contain"
              poster="/placeholder-player.jpg"
            />
          ) : isRedirectLink ? (
            /* Redirect Helper screen (Bypass CORS/iframe block) */
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-bg-card gap-4">
              <Play className="w-16 h-16 text-accent-purple animate-pulse" />
              <h3 className="font-bold text-text-primary text-lg">Buka Link Pemutar Eksternal</h3>
              <p className="text-text-muted text-sm max-w-md">
                Server ini ({resolvedServers[activeServer]?.name}) menggunakan URL eksternal yang tidak dapat dimuat di dalam bingkai website kami.
              </p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-white font-bold hover:shadow-glow transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Mulai Nonton / Buka Server
              </a>
            </div>
          ) : !iframeError ? (
            /* Standard Embed Iframe (With sandboxing to block ads & popups) */
            <iframe
              src={currentUrl}
              title={episodeTitle || "Episode Stream"}
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              sandbox="allow-scripts allow-same-origin allow-forms allow-presentation"
              className="absolute inset-0 w-full h-full border-none"
              onError={() => setIframeError(true)}
            />
          ) : (
            /* Error Fallback screen */
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-card gap-4 p-6">
              <AlertCircle className="w-12 h-12 text-pink-400" />
              <p className="text-text-secondary text-sm text-center">
                Gagal memuat video di dalam website. Ini sering terjadi karena proteksi enkripsi server host.
              </p>
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-text-primary text-sm font-semibold transition-all border border-white/5"
              >
                <ExternalLink className="w-4 h-4" />
                Buka &amp; Putar di Tab Baru
              </a>
            </div>
          )
        ) : (
          /* Empty / loading placeholder state */
          <div className="absolute inset-0 flex items-center justify-center bg-bg-card text-text-muted">
            Menunggu link streaming video...
          </div>
        )}
      </div>

      {/* Info Footer */}
      {episodeTitle && (
        <div className="px-5 py-4 bg-bg-card border-t border-white/5 flex items-center justify-between gap-4">
          <p className="text-sm font-bold text-text-primary truncate">{episodeTitle}</p>
          <div className="flex items-center gap-3 flex-shrink-0">
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-accent-purple hover:text-accent-pink flex items-center gap-1.5"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Direct Link
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
