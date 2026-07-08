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
  const [popular, setPopular] = useState<unknown[]>([]);
  const [samehadaku, setSamehadaku] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [ongRes, akRes, samRes] = await Promise.all([
          animeClientApi.ongoing(1),
          animeClientApi.akompiHome(),
          animeClientApi.completed(1)
        ]);

        const ongoingData: any = ongRes;
        const popularData: any = akRes;
        const sameData: any = samRes;

        const ongoingList = ongoingData?.data?.animeList || (Array.isArray(ongoingData?.data) ? ongoingData.data : (ongoingData?.animeList || []));
        const akompiList = popularData?.data?.popular || popularData?.data?.ongoing || (Array.isArray(popularData?.data) ? popularData.data : (popularData?.data?.animeList || []));
        const sameList = sameData?.data?.animeList || (Array.isArray(sameData?.data) ? sameData.data : (sameData?.animeList || []));

        setOngoing(Array.isArray(ongoingList) ? ongoingList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "otakudesu")) : []);
        setPopular(Array.isArray(akompiList) ? akompiList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "akompi")) : []);
        setSamehadaku(Array.isArray(sameList) ? sameList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
      } catch (e) {
        console.error("Home loading error:", e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const heroItems = [...popular.slice(0, 5), ...ongoing.slice(0, 3)].filter(
    (a: any) => a.thumbnail && a.thumbnail.startsWith("http")
  );

  return (
    <div className="pb-16">
      {/* Hero Banner */}
      {!loading && heroItems.length > 0 ? (
        <HeroBanner items={heroItems as any} />
      ) : (
        <div className="h-[50vh] min-h-[400px] bg-gradient-to-b from-bg-secondary to-bg-primary flex items-center justify-center border-b border-white/5">
          <div className="text-center px-4">
            <h1 className="text-4xl md:text-6xl font-display font-black gradient-text mb-4">AniStream</h1>
            <p className="text-text-secondary text-sm md:text-base max-w-md mx-auto">
              Nonton anime sub indo terupdate, lengkap dari berbagai provider dalam satu platform.
            </p>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <section className="relative -mt-10 z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: "Anime Ongoing", href: "/ongoing", icon: "🔥", desc: "Update episode terbaru", color: "from-orange-500/20 to-rose-500/10 border-orange-500/20 text-orange-400" },
            { label: "Anime Completed", href: "/completed", icon: "✅", desc: "Tamat & siap maraton", color: "from-emerald-500/20 to-teal-500/10 border-emerald-500/20 text-emerald-400" },
            { label: "Donghua (China)", href: "/donghua", icon: "🐉", desc: "Animasi China terbaik", color: "from-blue-500/20 to-indigo-500/10 border-blue-500/20 text-blue-400" },
            { label: "Nekopoi (18+)", href: "/nekopoi", icon: "🌸", desc: "Khusus dewasa 18+", color: "from-pink-500/20 to-rose-500/10 border-pink-500/20 text-pink-400" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`group p-5 rounded-2xl border bg-gradient-to-br ${item.color} hover:scale-[1.03] transition-all duration-300 backdrop-blur-md shadow-lg`}
            >
              <div className="text-3xl mb-3">{item.icon}</div>
              <h3 className="font-semibold text-text-primary text-base mb-1 group-hover:underline">
                {item.label}
              </h3>
              <p className="text-xs text-text-muted">{item.desc}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Sections Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {loading ? (
          <div className="space-y-10">
            <SectionSkeleton />
            <SectionSkeleton />
          </div>
        ) : (
          <>
            {/* Section: Ongoing */}
            {ongoing.length > 0 && (
              <AnimeSection
                title="Sedang Tayang (Ongoing)"
                subtitle="Update episode anime terbaru setiap harinya"
                items={ongoing as any}
                viewAllHref="/ongoing"
                provider="otakudesu"
              />
            )}

            {/* Section: Popular */}
            {popular.length > 0 && (
              <AnimeSection
                title="Populer Pekan Ini"
                subtitle="Paling banyak ditonton oleh wibu Indonesia"
                items={popular as any}
                viewAllHref="/completed"
                provider="akompi"
                className="bg-bg-secondary rounded-3xl p-6 md:p-8 border border-white/5"
              />
            )}

            {/* Section: Samehadaku */}
            {samehadaku.length > 0 && (
              <AnimeSection
                title="Rekomendasi Samehadaku"
                subtitle="Anime pilihan editor terbaik Samehadaku"
                items={samehadaku as any}
                viewAllHref="/completed"
                provider="samehadaku"
              />
            )}

            {ongoing.length === 0 && popular.length === 0 && (
              <div className="py-20 text-center text-text-muted border border-white/5 rounded-3xl bg-bg-card/30">
                <p className="text-lg font-semibold">Gagal memuat katalog anime.</p>
                <p className="text-sm mt-1">Gunakan koneksi internet lain atau muat ulang halaman beberapa saat lagi.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
