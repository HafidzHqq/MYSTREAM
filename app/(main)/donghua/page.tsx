"use client";
import { useState, useEffect } from "react";
import { AnimeCard } from "@/components/ui/AnimeCard";
import { AnimeCardSkeleton } from "@/components/ui/AnimeCardSkeleton";
import { animeClientApi } from "@/lib/api/animeClient";
import { Swords } from "lucide-react";

interface DonghuaItem {
  slug?: string;
  animeId?: string;
  title?: string;
  poster?: string;
  thumbnail?: string;
  type?: string;
  episode?: string;
  latestEp?: string;
  score?: string;
}

export default function DonghuaPage() {
  const [items, setItems] = useState<DonghuaItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data: any = await animeClientApi.donghuaHome();
        const list = data?.data?.ongoing || data?.data?.popular || data?.data || [];
        setItems(Array.isArray(list) ? list : []);
      } catch {
        setItems([]);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section */}
        <div className="relative mb-12 rounded-3xl overflow-hidden glass border border-white/5 p-8 md:p-12">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10" />
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-yellow-500/20 blur-[100px] rounded-full mix-blend-screen pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 p-[1px] shadow-[0_0_30px_rgba(234,179,8,0.3)] shrink-0">
              <div className="w-full h-full rounded-2xl bg-bg-secondary flex items-center justify-center">
                <Swords className="w-8 h-8 text-yellow-500" />
              </div>
            </div>
            <div>
              <h1 className="text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-3 tracking-tight">
                Donghua
              </h1>
              <p className="text-text-secondary font-medium text-lg">
                Animasi buatan China dengan grafik memukau dan aksi seru.
              </p>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <AnimeCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">
            {items.map((anime) => (
              <AnimeCard
                key={anime.slug || anime.animeId}
                slug={anime.slug || anime.animeId || ""}
                title={anime.title || "Unknown"}
                thumbnail={anime.poster || anime.thumbnail || ""}
                type={anime.type || "Donghua"}
                episode={anime.episode || anime.latestEp}
                score={anime.score}
                provider="donghua"
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 flex flex-col items-center justify-center glass-panel rounded-3xl border border-white/5">
            <div className="w-24 h-24 mb-6 rounded-full bg-white/5 flex items-center justify-center border border-white/10">
              <span className="text-4xl">🐉</span>
            </div>
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">Data Tidak Ditemukan</h3>
            <p className="text-text-muted text-lg max-w-md">Koneksi ke server bermasalah atau data kosong. Silakan periksa jaringan internet Anda.</p>
            <button onClick={() => window.location.reload()} className="mt-8 px-8 py-3 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold transition-all border border-white/5 hover:border-white/20">
              Muat Ulang
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
