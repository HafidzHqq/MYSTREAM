"use client";
import { useState, useEffect } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeSection } from "@/components/home/AnimeSection";
import { SectionSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeClientApi } from "@/lib/api/animeClient";
import { PlayCircle, CheckCircle, Sparkles, CalendarDays } from "lucide-react";
import Link from "next/link";

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
        const ongList = ongData?.data?.animeList || [];
        const compList = compData?.data?.animeList || [];

        setRecent(Array.isArray(homeList) ? homeList.slice(0, 10).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
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
            { label: "Donghua (China)", href: "/donghua", icon: Sparkles, desc: "Animasi China terbaik", gradient: "from-blue-500/20 to-cyan-500/20", iconColor: "text-cyan-400" },
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
          <>
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

            {recent.length === 0 && ongoing.length === 0 && completed.length === 0 && (
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
          </>
        )}
      </div>
    </div>
  );
}
