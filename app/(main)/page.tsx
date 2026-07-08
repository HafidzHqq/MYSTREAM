import { Suspense } from "react";
import type { Metadata } from "next";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeSection } from "@/components/home/AnimeSection";
import { SectionSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeApi } from "@/lib/api/anime";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "AniStream - Nonton Anime Sub Indo Gratis",
  description:
    "Nonton anime sub indo terlengkap. Ongoing, completed, donghua, jadwal rilis, dan masih banyak lagi secara gratis di AniStream.",
};

// ─── Data Fetchers ──────────────────────────────────────────────────────────

async function getOngoing() {
  try {
    const data = await animeApi.ongoing(1) as { data?: AnimeRaw[] };
    return data?.data || [];
  } catch {
    return [];
  }
}

async function getAkompiHome() {
  try {
    const data = await animeApi.akompiHome() as { data?: { ongoing?: AnimeRaw[], popular?: AnimeRaw[] } };
    return data?.data || {};
  } catch {
    return {};
  }
}

async function getSamehadakuHome() {
  try {
    const data = await animeApi.samehadakuHome() as { data?: AnimeRaw[] };
    return data?.data || [];
  } catch {
    return [];
  }
}

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

// ─── Page ───────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const [ongoingRaw, akompiData, samehadakuRaw] = await Promise.allSettled([
    getOngoing(),
    getAkompiHome(),
    getSamehadakuHome(),
  ]);

  const ongoingList = ongoingRaw.status === "fulfilled" && Array.isArray(ongoingRaw.value) ? ongoingRaw.value : [];
  const akompi = akompiData.status === "fulfilled" && akompiData.value && typeof akompiData.value === "object" ? akompiData.value as { ongoing?: AnimeRaw[], popular?: AnimeRaw[] } : {};
  const samehadakuList = samehadakuRaw.status === "fulfilled" && Array.isArray(samehadakuRaw.value) ? samehadakuRaw.value : [];

  const ongoing = Array.isArray(ongoingList) ? ongoingList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "otakudesu")) : [];
  const popular = akompi && Array.isArray(akompi.popular || akompi.ongoing) ? (akompi.popular || akompi.ongoing || []).slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "akompi")) : [];
  const samehadaku = Array.isArray(samehadakuList) ? samehadakuList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : [];

  // Hero: pick best available items with real thumbnails
  const heroItems = [...popular.slice(0, 5), ...ongoing.slice(0, 3)].filter(
    (a) => a.thumbnail && a.thumbnail.startsWith("http")
  );

  return (
    <div className="pb-16">
      {/* Hero Banner */}
      {heroItems.length > 0 ? (
        <HeroBanner items={heroItems} />
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
        
        {/* Section: Ongoing */}
        <Suspense fallback={<SectionSkeleton />}>
          {ongoing.length > 0 ? (
            <AnimeSection
              title="Sedang Tayang (Ongoing)"
              subtitle="Update episode anime terbaru setiap harinya"
              items={ongoing}
              viewAllHref="/ongoing"
              provider="otakudesu"
            />
          ) : (
            <div className="py-10 text-center text-text-muted border border-white/5 rounded-2xl bg-bg-card/50">
              Ongoing anime sedang memuat dari provider...
            </div>
          )}
        </Suspense>

        {/* Section: Popular */}
        <Suspense fallback={<SectionSkeleton />}>
          {popular.length > 0 && (
            <AnimeSection
              title="Populer Pekan Ini"
              subtitle="Paling banyak ditonton oleh wibu Indonesia"
              items={popular}
              viewAllHref="/completed"
              provider="akompi"
              className="bg-bg-secondary rounded-3xl p-6 md:p-8 border border-white/5"
            />
          )}
        </Suspense>

        {/* Section: Samehadaku */}
        <Suspense fallback={<SectionSkeleton />}>
          {samehadaku.length > 0 && (
            <AnimeSection
              title="Rekomendasi Samehadaku"
              subtitle="Anime pilihan editor terbaik Samehadaku"
              items={samehadaku}
              viewAllHref="/completed"
              provider="samehadaku"
            />
          )}
        </Suspense>

      </div>
    </div>
  );
}
