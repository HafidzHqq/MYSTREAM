"use client";
import { useState, useEffect } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeSection } from "@/components/home/AnimeSection";
import { SectionSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeClientApi } from "@/lib/api/animeClient";
import { PlayCircle, CheckCircle, Sparkles, CalendarDays, TrendingUp } from "lucide-react";
import Link from "next/link";
import { clsx } from "clsx";

interface AnimeRaw {
  slug?: string;
  animeId?: string;
  title?: string;
  poster?: string;
  thumbnail?: string;
  image?: string;
  type?: string;
  status?: string;
  episode?: string;
  latestEp?: string;
  score?: string | number;
  rating?: string | number;
}

function normalizeAnime(raw: AnimeRaw, provider: string) {
  return {
    slug: raw.slug || raw.animeId || "",
    title: raw.title || "Unknown",
    thumbnail: raw.poster || raw.thumbnail || raw.image || "",
    type: raw.type || "TV",
    status: raw.status,
    episode: raw.episode || raw.latestEp,
    score: raw.score || raw.rating,
    provider,
  };
}

export default function HomePage() {
  const [ongoing, setOngoing] = useState<unknown[]>([]);
  const [completed, setCompleted] = useState<unknown[]>([]);
  const [recent, setRecent] = useState<unknown[]>([]);
  const [popular, setPopular] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [homeRes, ongRes, compRes] = await Promise.all([
          animeClientApi.home(),
          animeClientApi.ongoing(1),
          animeClientApi.completed(1)
        ]);

        const homeData: any = homeRes;
        const ongData: any = ongRes;
        const compData: any = compRes;

        const homeList = homeData?.data?.recent?.animeList || (Array.isArray(homeData?.data) ? homeData.data : []);
        const popList = homeData?.data?.top10?.animeList || [];
        const ongList = ongData?.data?.animeList || [];
        const compList = compData?.data?.animeList || [];

        setRecent(Array.isArray(homeList) ? homeList.slice(0, 10).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
        setPopular(Array.isArray(popList) ? popList.slice(0, 10).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
        setOngoing(Array.isArray(ongList) ? ongList.map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
        setCompleted(Array.isArray(compList) ? compList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
      } catch (e) {
        console.error("Home loading error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heroItems = [...recent.slice(0, 5), ...ongoing.slice(0, 3)].filter(
    (a: any) => a.thumbnail && a.thumbnail.startsWith("http")
  );

  return (
    <div className="pb-16 bg-bg-primary min-h-screen">
      {/* Hero Banner */}
      {!loading && heroItems.length > 0 ? (
        <HeroBanner items={heroItems as any} />
      ) : (
        <div className="h-[60vh] min-h-[500px] w-full relative flex items-center justify-center overflow-hidden bg-bg-secondary">
          <div className="absolute inset-0 bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 blur-3xl opacity-50"></div>
          <div className="relative z-10 text-center px-4 glass-panel p-10 max-w-2xl rounded-3xl animate-fade-in border border-white/10 shadow-2xl">
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70 mb-6 tracking-tight">QQ</h1>
            <p className="text-text-secondary text-lg md:text-xl font-medium max-w-lg mx-auto">
              Nonton anime sub indo terupdate, lengkap dengan visual memanjakan mata.
            </p>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <section className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 md:-mt-16 mb-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Anime Ongoing", href: "/ongoing", icon: PlayCircle, desc: "Update episode terbaru", gradient: "from-orange-500/20 to-red-500/20", iconColor: "text-orange-400" },
            { label: "Anime Completed", href: "/completed", icon: CheckCircle, desc: "Tamat & siap maraton", gradient: "from-green-500/20 to-emerald-500/20", iconColor: "text-emerald-400" },
            { label: "Favorit Saya", href: "/favorites", icon: Sparkles, desc: "Anime koleksi favoritmu", gradient: "from-blue-500/20 to-cyan-500/20", iconColor: "text-cyan-400" },
            { label: "Jadwal Rilis", href: "/schedule", icon: CalendarDays, desc: "Jadwal update mingguan", gradient: "from-purple-500/20 to-pink-500/20", iconColor: "text-pink-400" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`group relative overflow-hidden p-6 rounded-2xl glass border border-white/10 hover:-translate-y-1 hover:shadow-2xl hover:border-white/20 transition-all duration-300 flex flex-col items-center text-center`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative z-10 w-14 h-14 mb-4 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:scale-110 group-hover:bg-white/10 transition-all duration-300">
                <item.icon className={`w-7 h-7 ${item.iconColor}`} />
              </div>
              
              <h3 className="relative z-10 font-bold text-white text-base md:text-lg mb-1 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-white/70">
                {item.label}
              </h3>
              <p className="relative z-10 text-xs md:text-sm text-text-muted font-medium">{item.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Sections Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-32 relative z-10">
        {loading ? (
          <div className="space-y-16">
            <SectionSkeleton />
            <SectionSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 md:gap-12 items-start">
            {/* Left Content Area (col-span-8) */}
            <div className="lg:col-span-8 space-y-20 md:space-y-32">
              {/* Section: Recent Updates */}
              {recent.length > 0 && (
                <AnimeSection
                  title="Rilis Terbaru"
                  subtitle="Episode anime terbaru yang baru saja tayang"
                  items={recent as any}
                  viewAllHref="/ongoing"
                  provider="samehadaku"
                />
              )}

              {/* Section: Ongoing */}
              {ongoing.length > 0 && (
                <div className="relative py-12 px-6 md:px-12 rounded-3xl glass-panel border border-white/5 overflow-hidden">
                  <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-accent-blue/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none" />
                  <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-accent-purple/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
                  
                  <div className="relative z-10">
                    <AnimeSection
                      title="Sedang Tayang (Ongoing)"
                      subtitle="Anime populer musim ini yang pantang dilewatkan"
                      items={ongoing as any}
                      viewAllHref="/ongoing"
                      provider="samehadaku"
                    />
                  </div>
                </div>
              )}

              {/* Section: Completed */}
              {completed.length > 0 && (
                <AnimeSection
                  title="Anime Tamat (Completed)"
                  subtitle="Siap ditonton maraton sampai akhir episode"
                  items={completed as any}
                  viewAllHref="/completed"
                  provider="samehadaku"
                />
              )}
            </div>

            {/* Right Sidebar Area (col-span-4) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              {popular.length > 0 && (
                <div className="p-6 rounded-3xl glass-panel border border-white/10 shadow-[0_0_50px_rgba(139,92,246,0.05)]">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center shadow-[0_0_15px_rgba(139,92,246,0.3)]">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-lg font-black text-white tracking-tight">Terpopuler</h2>
                      <p className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Trending Minggu Ini</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {popular.map((anime: any, index) => (
                      <Link
                        key={anime.slug || anime.animeId}
                        href={`/anime/${anime.slug}`}
                        className="flex items-center gap-4 p-2.5 rounded-2xl bg-white/0 hover:bg-white/5 border border-transparent hover:border-white/5 transition-all duration-300 group"
                      >
                        {/* Rank */}
                        <div className={clsx(
                          "w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs border shrink-0 transition-all",
                          index === 0 && "bg-amber-400/20 text-amber-400 border-amber-400/30 shadow-[0_0_10px_rgba(251,191,36,0.2)] scale-110",
                          index === 1 && "bg-slate-300/20 text-slate-300 border-slate-300/30 scale-105",
                          index === 2 && "bg-amber-700/20 text-amber-500 border-amber-500/30",
                          index > 2 && "bg-white/5 text-text-secondary border-white/10 group-hover:border-white/20"
                        )}>
                          {index + 1}
                        </div>

                        {/* Thumbnail */}
                        <div className="relative w-11 h-14 rounded-xl overflow-hidden border border-white/10 group-hover:border-white/20 transition-colors shrink-0 bg-bg-secondary">
                          {anime.thumbnail ? (
                            <img src={anime.thumbnail} alt={anime.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-black/40 text-text-muted">
                              🖼️
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="min-w-0 flex-1">
                          <h3 className="font-bold text-xs text-white group-hover:text-accent-blue transition-colors truncate mb-1">
                            {anime.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            {anime.score && anime.score !== "0" && anime.score !== 0 && (
                              <span className="text-[9px] text-accent-yellow font-black bg-accent-yellow/10 border border-accent-yellow/20 px-1.5 py-0.5 rounded-md">
                                ⭐ {anime.score}
                              </span>
                            )}
                            <span className="text-[9px] text-text-muted font-bold bg-white/5 px-1.5 py-0.5 rounded-md">
                              {anime.type || "TV"}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!loading && recent.length === 0 && ongoing.length === 0 && completed.length === 0 && (
          <div className="py-32 text-center flex flex-col items-center justify-center">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-4xl">🔌</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Gagal Memuat Katalog</h3>
            <p className="text-text-muted text-lg max-w-md">Koneksi ke server bermasalah. Silakan periksa jaringan internet Anda atau muat ulang halaman.</p>
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/5 hover:border-white/20">
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
