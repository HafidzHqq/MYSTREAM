"use client";
import { useState, useRef } from "react";
import { Server, ExternalLink, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

interface StreamServer {
  name?: string;
  url?: string;
  iframe?: string;
  serverName?: string;
  streamUrl?: string;
}

interface VideoPlayerProps {
  streamUrl: string;
  servers?: StreamServer[];
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
  const [currentUrl, setCurrentUrl] = useState(streamUrl);
  const [activeServer, setActiveServer] = useState(0);
  const [iframeError, setIframeError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const allServers = [
    ...(streamUrl ? [{ name: "Server 1", url: streamUrl }] : []),
    ...servers.map((s, i) => ({
      name: s.name || s.serverName || `Server ${i + 2}`,
      url: s.url || s.iframe || s.streamUrl || "",
    })),
  ].filter((s, i, arr) => s.url && arr.findIndex(x => x.url === s.url) === i);

  const handleServer = (url: string, index: number) => {
    setCurrentUrl(url);
    setActiveServer(index);
    setIframeError(false);
  };

  return (
    <div className="rounded-2xl overflow-hidden bg-black border border-white/5 shadow-card">
      {/* Server Selector */}
      {allServers.length > 1 && (
        <div className="flex items-center gap-2 p-3 bg-bg-card border-b border-white/5 overflow-x-auto scrollbar-hide">
          <Server className="w-4 h-4 text-text-muted flex-shrink-0" />
          <span className="text-xs text-text-muted flex-shrink-0">Server:</span>
          {allServers.map((server, i) => (
            <button
              key={i}
              onClick={() => handleServer(server.url, i)}
              className={clsx(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex-shrink-0",
                activeServer === i
                  ? "bg-accent-purple text-white shadow-glow"
                  : "bg-white/5 text-text-secondary hover:bg-white/10 hover:text-text-primary"
              )}
            >
              {server.name}
            </button>
          ))}
        </div>
      )}

      {/* Video Frame */}
      <div className="video-container bg-black">
        {currentUrl && !iframeError ? (
          <iframe
            ref={iframeRef}
            src={currentUrl}
            title={episodeTitle || "Episode"}
            allowFullScreen
            allow="fullscreen; autoplay; encrypted-media; picture-in-picture"
            className="absolute inset-0 w-full h-full"
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-bg-card gap-4">
            <AlertCircle className="w-12 h-12 text-text-muted" />
            <p className="text-text-muted text-center px-4">
              Video tidak bisa dimuat. Coba server lain atau buka langsung.
            </p>
            {currentUrl && (
              <a
                href={currentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-purple text-white text-sm hover:shadow-glow transition-all"
              >
                <ExternalLink className="w-4 h-4" />
                Buka di Tab Baru
              </a>
            )}
          </div>
        )}
      </div>

      {/* Title bar */}
      {episodeTitle && (
        <div className="px-4 py-3 bg-bg-card border-t border-white/5">
          <p className="text-sm font-medium text-text-primary">{episodeTitle}</p>
        </div>
      )}
    </div>
  );
}
