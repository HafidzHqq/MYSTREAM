"use client";
import { useState, useEffect } from "react";
import { Server, ExternalLink, AlertCircle, Play, Loader2 } from "lucide-react";
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
}: VideoPlayerProps) {
  const [currentUrl, setCurrentUrl] = useState("");
  const [activeServer, setActiveServer] = useState(0);
  const [loading, setLoading] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Normalisasikan daftar server dari bermacam format Sanka API
  const [resolvedServers, setResolvedServers] = useState<{ name: string; url: string; id?: string }[]>([]);

  useEffect(() => {
    const list: { name: string; url: string; id?: string }[] = [];

    // Tambahkan server utama bawaan
    if (streamUrl) {
      list.push({ name: "Server Utama", url: streamUrl });
    }

    // Ekstrak data server pendukung
    if (Array.isArray(servers)) {
      servers.forEach((s, i) => {
        const url = s.url || s.iframe || s.streamUrl || "";
        const id = s.serverId;
        list.push({
          name: s.name || s.title || `Server ${i + 2}`,
          url: url,
          id: id,
        });
      });
    } else if (servers && typeof servers === "object") {
      const sObj = servers as StreamServer;
      const sList = sObj.serverList || sObj.servers || [];
      if (Array.isArray(sList)) {
        sList.forEach((s, i) => {
          list.push({
            name: s.title || s.name || `Server ${i + 2}`,
            url: s.url || s.iframe || s.streamUrl || "",
            id: s.serverId,
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
              });
            });
          }
        });
      }
    }

    const unique = list.filter((s, i, arr) => (s.url || s.id) && arr.findIndex(x => (x.url && x.url === s.url) || (x.id && x.id === s.id)) === i);
    setResolvedServers(unique);
    if (unique.length > 0) {
      setCurrentUrl(unique[0].url || "");
    }
  }, [streamUrl, servers]);

  const handleServer = async (server: { name: string; url: string; id?: string }, index: number) => {
    setActiveServer(index);
    setIframeError(false);

    // Jika server hanya memiliki ID, ambil url aslinya lewat proxy API
    if (!server.url && server.id) {
      setLoading(true);
      try {
        const res = await fetch(`/api/anime/server/${server.id}`);
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

  return (
    <div className="rounded-2xl overflow-hidden bg-black border border-white/5 shadow-card">
      
      {/* Server Selector Header */}
      {resolvedServers.length > 1 && (
        <div className="flex items-center gap-2 p-3.5 bg-bg-card border-b border-white/5 overflow-x-auto scrollbar-hide">
          <Server className="w-4 h-4 text-accent-purple flex-shrink-0" />
          <span className="text-xs font-bold text-text-secondary flex-shrink-0 mr-2">Pilih Server Player:</span>
          <div className="flex gap-2">
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
                Buka & Putar di Tab Baru
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
          {currentUrl && (
            <a
              href={currentUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-semibold text-accent-purple hover:text-accent-pink flex items-center gap-1.5 flex-shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Direct Link
            </a>
          )}
        </div>
      )}
    </div>
  );
}
