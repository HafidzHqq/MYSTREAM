"use client";
import { useState, useEffect } from "react";
import { HeroBanner } from "@/components/home/HeroBanner";
import { AnimeSection } from "@/components/home/AnimeSection";
import { SectionSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeClientApi } from "@/lib/api/animeClient";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase]);

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

        setRecent(Array.isArray(homeList) ? homeList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
        setPopular(Array.isArray(popList) ? popList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
        setOngoing(Array.isArray(ongList) ? ongList.slice(0, 12).map((a: AnimeRaw) => normalizeAnime(a, "samehadaku")) : []);
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
    <div className="pb-20 bg-bg-primary min-h-screen">
      {/* Hero Banner */}
      {!loading && heroItems.length > 0 ? (
        <HeroBanner items={heroItems as any} />
      ) : (
        <div className="h-[480px] sm:h-[560px] md:h-[640px] w-full relative flex items-center justify-center bg-bg-secondary/40">
          <div className="w-10 h-10 border-2 border-white/20 border-t-white rounded-xl-full animate-spin" />
        </div>
      )}

      {/* Sections Container */}
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8 space-y-10 md:space-y-14 relative z-10 pt-10 sm:pt-14">
        {loading ? (
          <div className="space-y-12">
            <SectionSkeleton />
            <SectionSkeleton />
            <SectionSkeleton />
          </div>
        ) : (
          <div className="space-y-10 md:space-y-14">
            {/* Section: Trending / Terpopuler */}
            {popular.length > 0 && (
              <AnimeSection
                title="Trending Minggu Ini"
                subtitle="Anime paling populer dan paling banyak ditonton"
                items={popular as any}
                viewAllHref="/ongoing"
                provider="samehadaku"
              />
            )}

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
                subtitle="Anime populer musim ini yang pantang dilewatkan"
                items={ongoing as any}
                viewAllHref="/ongoing"
                provider="samehadaku"
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
          </div>
        )}

        {!loading && recent.length === 0 && ongoing.length === 0 && completed.length === 0 && (
          <div className="py-24 text-center flex flex-col items-center justify-center rounded-xl bg-bg-secondary/50 border border-white/[0.06] p-8">
            <h3 className="text-xl font-bold text-white mb-2">Gagal Memuat Katalog Anime</h3>
            <p className="text-text-muted text-sm max-w-md mb-6">
              Koneksi ke server bermasalah. Silakan periksa jaringan internet Anda atau muat ulang halaman.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-medium text-sm transition-all border border-white/10"
            >
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
