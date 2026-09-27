"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

export default function RegisterClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const supabase = createClient();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { username, full_name: username } },
      });
      if (error) throw error;
      setSuccess(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Registrasi gagal.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
        <div className="rounded-xl bg-bg-secondary/90 border border-white/[0.08] p-8 max-w-md w-full text-center shadow-2xl">
          <div className="text-4xl mb-3">🎉</div>
          <h2 className="text-xl font-bold text-white mb-2">Registrasi Berhasil!</h2>
          <p className="text-text-muted text-xs sm:text-sm mb-6">
            Periksa email Anda untuk verifikasi akun, lalu masuk untuk mulai menonton.
          </p>
          <Link href="/login"
            className="inline-flex items-center justify-center w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs sm:text-sm transition-all">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-2 group">
            <div className="relative w-10 h-10 rounded-xl-full overflow-hidden border border-white/15 group-hover:border-sky-400/40 transition-colors">
              <Image src="/logo.jpg" alt="AniStream" fill className="object-cover" unoptimized />
            </div>
            <span className="font-extrabold text-xl tracking-tight text-white group-hover:text-sky-400 transition-colors">
              ANISTREAM
            </span>
          </Link>
          <p className="text-text-muted text-xs sm:text-sm">Buat akun untuk menyimpan anime favorit dan riwayat</p>
        </div>

        <div className="rounded-xl bg-bg-secondary/90 border border-white/[0.08] p-6 sm:p-8 shadow-2xl">
          <h1 className="text-xl sm:text-2xl font-bold text-white mb-6">Daftar Akun</h1>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs sm:text-sm">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                  placeholder="username_kamu"
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-white/[0.08] rounded-xl text-white placeholder:text-text-muted text-xs sm:text-sm focus:outline-none focus:border-sky-500/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-bg-card border border-white/[0.08] rounded-xl text-white placeholder:text-text-muted text-xs sm:text-sm focus:outline-none focus:border-sky-500/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={6} placeholder="Min. 6 karakter"
                  className="w-full pl-10 pr-10 py-2.5 bg-bg-card border border-white/[0.08] rounded-xl text-white placeholder:text-text-muted text-xs sm:text-sm focus:outline-none focus:border-sky-500/50 transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-2.5 rounded-xl bg-sky-500 hover:bg-sky-400 text-black font-bold text-xs sm:text-sm transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : "Daftar Sekarang"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-xs">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-sky-400 hover:underline font-semibold">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
