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
    thumbnail: raw.poster || raw.thumbnail || raw.image || "/placeholder.jpg",
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

  const ongoingList = ongoingRaw.status === "fulfilled" ? ongoingRaw.value : [];
  const akompi = akompiData.status === "fulfilled" ? akompiData.value as { ongoing?: AnimeRaw[], popular?: AnimeRaw[] } : {};
  const samehadakuList = samehadakuRaw.status === "fulfilled" ? samehadakuRaw.value : [];

  const ongoing = ongoingList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "otakudesu"));
  const popular = (akompi.popular || akompi.ongoing || []).slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "akompi"));
  const samehadaku = samehadakuList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku"));

  // Hero: pick best available items
  const heroItems = [...popular.slice(0, 5), ...ongoing.slice(0, 3)].filter(
    (a) => a.thumbnail && a.thumbnail !== "/placeholder.jpg"
  );

  return (
    <>
      {/* Hero Banner */}
      {heroItems.length > 0 ? (
        <HeroBanner items={heroItems} />
      ) : (
        <div className="h-[85vh] min-h-[560px] max-h-[800px] bg-gradient-dark flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-display font-black gradient-text mb-4">AniStream</h1>
            <p className="text-text-muted">Platform Streaming Anime Indonesia</p>
          </div>
        </div>
      )}

      {/* Sections */}
      <Suspense fallback={<SectionSkeleton />}>
        {ongoing.length > 0 && (
          <AnimeSection
            title="Sedang Tayang"
            subtitle="Anime yang sedang update episode terbaru"
            items={ongoing}
            viewAllHref="/ongoing"
            provider="otakudesu"
          />
        )}
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {popular.length > 0 && (
          <AnimeSection
            title="Populer Sekarang"
            subtitle="Anime paling banyak ditonton saat ini"
            items={popular}
            viewAllHref="/completed"
            provider="akompi"
            className="bg-bg-secondary"
          />
        )}
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        {samehadaku.length > 0 && (
          <AnimeSection
            title="Rekomendasi Samehadaku"
            subtitle="Pilihan terbaik dari Samehadaku"
            items={samehadaku}
            viewAllHref="/completed"
            provider="samehadaku"
          />
        )}
      </Suspense>

      {/* Quick Navigation Cards */}
      <section className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Anime Ongoing", href: "/ongoing", icon: "🔥", desc: "Update setiap hari" },
              { label: "Anime Completed", href: "/completed", icon: "✅", desc: "Sudah tamat semua" },
              { label: "Donghua", href: "/donghua", icon: "🐉", desc: "Animasi China" },
              { label: "Jadwal Rilis", href: "/schedule", icon: "📅", desc: "Kapan update?" },
            ].map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group p-5 rounded-2xl bg-bg-card border border-white/5 hover:border-accent-purple/30 hover:bg-bg-overlay transition-all duration-300 card-glow"
              >
                <div className="text-3xl mb-3">{item.icon}</div>
                <h3 className="font-semibold text-text-primary text-sm mb-1 group-hover:text-accent-purple transition-colors">
                  {item.label}
                </h3>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
