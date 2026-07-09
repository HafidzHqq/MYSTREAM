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
      <div className="min-h-screen py-24 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-accent-blue animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-xl bg-accent-blue/20 flex items-center justify-center border border-accent-blue/30 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
            <Clock className="w-6 h-6 text-accent-blue" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent-blue to-accent-purple tracking-tight">
              Riwayat Tontonan
            </h1>
            <p className="text-text-muted text-sm mt-1">{history.length} anime terakhir dilihat</p>
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        {history.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {history.map((item) => (
              <div key={item.id} className="group relative rounded-2xl bg-bg-card border border-white/5 overflow-hidden card-glow">
                <Link href={`/anime/${item.slug}`} className="block relative aspect-[2/3] overflow-hidden">
                  <Image 
                    src={item.poster && item.poster !== '/placeholder-player.jpg' ? item.poster : '/placeholder-card.jpg'} 
                    alt={item.title} 
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110" 
                    unoptimized 
                  />
                  <div className="absolute inset-0 bg-gradient-card opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all gap-2">
                    <div className="w-12 h-12 rounded-full bg-accent-blue/90 flex items-center justify-center shadow-glow-blue">
                      <Play className="w-5 h-5 text-white fill-white ml-1" />
                    </div>
                  </div>
                </Link>
                <button 
                  onClick={() => removeHistory(item.id)}
                  title="Hapus dari riwayat"
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-bg-primary/80 backdrop-blur-md text-red-400 border border-red-500/20 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500/20 hover:border-red-500/50"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="p-3">
                  <h3 className="text-sm font-semibold text-text-primary line-clamp-1">{item.title}</h3>
                  <p className="text-xs text-accent-blue font-medium mt-1 truncate">{item.episode}</p>
                  <p className="text-[10px] text-text-muted mt-1">
                    {new Date(item.watched_at).toLocaleDateString("id-ID", {
                      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit"
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-md relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-blue/10 blur-[100px] rounded-full pointer-events-none" />
            <Clock className="w-16 h-16 mx-auto mb-4 text-text-muted opacity-30 relative z-10" />
            <h2 className="text-xl font-bold text-white mb-2 relative z-10">Belum Ada Riwayat</h2>
            <p className="text-text-muted text-sm mb-6 relative z-10">Tonton episode anime dan riwayatnya akan muncul di sini</p>
            <Link href="/" className="relative z-10 px-6 py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-glow transition-all inline-block">
              Jelajahi Anime
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
