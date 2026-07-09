"use client";
import { useState, useEffect } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeSection } from "@/components/home/AnimeSection";
import { SectionSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeClientApi } from "@/lib/api/animeClient";

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
        <div className="h-[50vh] min-h-[400px] bg-accent-yellow flex items-center justify-center border-b-[3px] border-black">
          <div className="text-center px-4 brutal-box bg-white p-8 max-w-lg">
            <h1 className="text-4xl md:text-6xl font-black text-black mb-4 uppercase tracking-tighter">QQ.stream</h1>
            <p className="text-black text-sm md:text-base font-bold">
              Nonton anime sub indo terupdate, lengkap dari berbagai provider dalam satu platform.
            </p>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <section className="relative -mt-8 md:-mt-12 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {[
            { label: "Anime Ongoing", href: "/ongoing", icon: "🔥", desc: "Update episode terbaru", color: "bg-accent-yellow" },
            { label: "Anime Completed", href: "/completed", icon: "✅", desc: "Tamat & siap maraton", color: "bg-accent-green" },
            { label: "Donghua (China)", href: "/donghua", icon: "🐉", desc: "Animasi China terbaik", color: "bg-accent-blue" },
            { label: "Jadwal Rilis", href: "/schedule", icon: "📅", desc: "Jadwal update mingguan", color: "bg-accent-pink" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group p-4 md:p-6 border-[3px] border-black ${item.color} brutal-hover shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center text-center`}
            >
              <div className="text-3xl md:text-4xl mb-3 bg-white border-2 border-black rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:scale-110 transition-transform">{item.icon}</div>
              <h3 className="font-black text-black text-base md:text-lg mb-1 uppercase tracking-wide group-hover:underline underline-offset-2">
                {item.label}
              </h3>
              <p className="text-xs md:text-sm text-black font-bold opacity-80">{item.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Sections Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 space-y-16 md:space-y-24">
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
              <AnimeSection
                title="Sedang Tayang (Ongoing)"
                subtitle="Anime populer musim ini"
                items={ongoing as any}
                viewAllHref="/ongoing"
                provider="samehadaku"
                className="bg-accent-cyan p-6 md:p-10 border-[3px] border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] brutal-box"
              />
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
              <div className="py-20 text-center text-black border-[3px] border-black bg-white brutal-box shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-2xl font-black uppercase mb-2">Gagal memuat katalog anime.</p>
                <p className="text-base font-bold">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
