"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Play, AlertTriangle, Search } from "lucide-react";
import { animeClientApi } from "@/lib/api/animeClient";

interface NekoItem {
  slug?: string;
  title?: string;
  poster?: string;
  thumbnail?: string;
  image?: string;
  type?: string;
  episode?: string;
  latestEp?: string;
}

export default function NekopoiPage() {
  const [items, setItems] = useState<NekoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (ageConfirmed) fetchHome();
  }, [ageConfirmed]);

  async function fetchHome() {
    setLoading(true);
    try {
      // Direct browser-side fetch bypasses Cloudflare blocks
      const data: any = await animeClientApi.nekoHome();
      const list = data?.data || data?.animeList || [];
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://www.sankavollerei.web.id/anime/neko/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await res.json();
      const list = data?.data || data?.animeList || [];
      setItems(Array.isArray(list) ? list : []);
    } catch {
      setItems([]);
    } finally {
      setSearching(false);
    }
  }

  // Age verification gate
  if (!ageConfirmed) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-900/30 via-bg-primary to-bg-primary" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-pink-600/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-rose-600/10 blur-3xl" />
        </div>
        <div className="relative glass rounded-3xl border border-pink-500/20 p-10 max-w-md w-full text-center shadow-card">
          <div className="w-16 h-16 rounded-2xl bg-pink-500/20 border border-pink-500/30 flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-pink-400" />
          </div>
          <h1 className="text-2xl font-display font-black text-text-primary mb-3">
            Konten 18+
          </h1>
          <p className="text-text-muted text-sm leading-relaxed mb-8">
            Halaman ini mengandung konten dewasa. Dengan melanjutkan, kamu menyatakan bahwa kamu berusia <span className="text-pink-400 font-semibold">18 tahun atau lebih</span> dan memahami bahwa konten ini hanya untuk orang dewasa.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => setAgeConfirmed(true)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-600 to-rose-600 text-white font-semibold hover:shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all duration-300"
            >
              Ya, Saya Berusia 18+ Tahun
            </button>
            <Link
              href="/"
              className="block w-full py-3 rounded-xl glass border border-white/10 text-text-secondary hover:text-text-primary text-sm font-medium transition-all"
            >
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10">
      {/* Pink header glow */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-pink-900/20 to-transparent pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-1 h-7 rounded-full bg-gradient-to-b from-pink-500 to-rose-600" />
            <h1 className="text-3xl font-display font-black text-text-primary">
              Nekopoi <span className="text-pink-400 text-lg font-medium">18+</span>
            </h1>
          </div>
          <p className="text-text-muted text-sm ml-4">Konten animasi dewasa - hanya untuk 18+</p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="relative mb-8 max-w-xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Cari judul..."
            className="w-full pl-11 pr-28 py-3 bg-bg-card border border-pink-500/20 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-pink-500/50 transition-all"
          />
          <button type="submit" disabled={searching}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-pink-600 to-rose-600 text-white text-sm font-medium hover:shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all disabled:opacity-50">
            {searching ? "..." : "Cari"}
          </button>
        </form>

        {/* Content Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-bg-card border border-white/5 overflow-hidden animate-pulse">
                <div className="aspect-[2/3] skeleton" />
                <div className="p-3 space-y-2">
                  <div className="h-4 skeleton rounded-md" />
                  <div className="h-4 skeleton rounded-md w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {items.map((item, i) => (
              <Link
                key={`${item.slug}-${i}`}
                href={`/nekopoi/watch/${item.slug || i}`}
                className="group block"
              >
                <div className="relative overflow-hidden rounded-2xl bg-bg-card border border-white/5 hover:border-pink-500/30 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(236,72,153,0.2)] hover:-translate-y-1">
                  <div className="relative aspect-[2/3] overflow-hidden">
                    {(item.poster || item.thumbnail || item.image) ? (
                      <Image
                        src={item.poster || item.thumbnail || item.image || ""}
                        alt={item.title || ""}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 640px) 50vw, 20vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-bg-overlay flex items-center justify-center">
                        <span className="text-4xl">🌸</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-card to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="w-12 h-12 rounded-full bg-pink-500/90 backdrop-blur flex items-center justify-center shadow-[0_0_20px_rgba(236,72,153,0.5)]">
                        <Play className="w-5 h-5 text-white fill-white ml-1" />
                      </div>
                    </div>
                    {item.type && (
                      <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-xs font-semibold bg-pink-500/90 text-white backdrop-blur-sm">
                        {item.type}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="font-semibold text-sm text-text-primary line-clamp-2 leading-snug group-hover:text-pink-400 transition-colors">
                      {item.title}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🌸</div>
            <p className="text-text-muted">Data tidak tersedia saat ini atau server sedang down.</p>
            <button onClick={fetchHome} className="mt-4 px-4 py-2 rounded-lg bg-pink-500/20 text-pink-400 text-sm hover:bg-pink-500/30 transition-all">
              Coba Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
