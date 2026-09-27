"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Clock, Play, Trash2, Loader2, AlertCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface HistoryItem {
  id: string;
  slug: string;
  title: string;
  episode: string;
  poster?: string;
  watched_at: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadHistory() {
      setLoading(true);
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session?.user) {
          router.push("/login?redirect=/history");
          return;
        }

        const { data, error: dbError } = await supabase
          .from('watch_history')
          .select('*')
          .eq('user_id', session.user.id)
          .order('watched_at', { ascending: false });

        if (dbError) throw dbError;
        setHistory(data || []);
      } catch (err: any) {
        setError(err.message || "Gagal memuat riwayat tontonan");
      } finally {
        setLoading(false);
      }
    }

    loadHistory();
  }, [router, supabase]);

  const removeHistory = async (id: string) => {
    try {
      setHistory(prev => prev.filter(h => h.id !== id));
      await supabase.from('watch_history').delete().eq('id', id);
    } catch (err) {
      console.error("Gagal menghapus", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-24 flex items-center justify-center bg-bg-primary">
        <div className="flex items-center gap-3 bg-bg-secondary/80 border border-white/[0.08] px-5 py-3 rounded-xl shadow-xl">
          <Loader2 className="w-5 h-5 text-sky-400 animate-spin" />
          <span className="text-sm font-medium text-white">Memuat Riwayat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 md:py-10 bg-bg-primary mt-14 md:mt-16">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl-full bg-sky-500/10 border border-sky-500/20 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2.5">
            <Clock className="w-3.5 h-3.5" />
            Aktivitas Tontonan
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
            Riwayat Tontonan
          </h1>
          <p className="text-text-secondary text-xs sm:text-sm mt-1">
            {history.length} anime terakhir yang Anda tonton di akun ini.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <p className="text-rose-300 text-xs sm:text-sm">{error}</p>
          </div>
        )}

        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3.5 sm:gap-4 md:gap-5">
            {history.map((item) => (
              <div key={item.id} className="group relative rounded-xl bg-bg-card border border-white/[0.07] overflow-hidden flex flex-col hover:border-white/20 transition-all duration-300">
                <Link href={`/anime/${item.slug}`} className="block relative aspect-[2/3] overflow-hidden bg-bg-secondary">
                  <Image 
                    src={item.poster && item.poster !== '/placeholder-player.jpg' ? item.poster : '/placeholder-card.jpg'} 
                    alt={item.title} 
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                    unoptimized 
                  />
                  {/* Hover play button */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-10 h-10 rounded-xl-full bg-white text-black flex items-center justify-center shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => removeHistory(item.id)}
                  title="Hapus dari riwayat"
                  className="absolute top-2 right-2 p-1.5 rounded-xl bg-black/75 backdrop-blur-md text-white/80 hover:text-rose-400 border border-white/10 hover:border-rose-500/30 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-xs sm:text-sm font-semibold text-white group-hover:text-sky-400 line-clamp-1 transition-colors">{item.title}</h3>
                    <p className="text-xs text-sky-400 font-medium mt-1 truncate">{item.episode}</p>
                  </div>
                  <p className="text-[10px] text-text-muted mt-2">
                    {new Date(item.watched_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 flex flex-col items-center justify-center rounded-xl bg-bg-secondary/60 border border-white/[0.06] p-6 max-w-md mx-auto">
            <div className="w-12 h-12 mb-3 rounded-xl-full bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white mb-1">Belum Ada Riwayat</h3>
            <p className="text-text-muted text-xs sm:text-sm mb-5">
              Episode anime yang Anda tonton akan otomatis tercatat di sini.
            </p>
            <Link
              href="/"
              className="px-5 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-xs sm:text-sm font-semibold transition-all border border-white/10"
            >
              Jelajahi Anime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
