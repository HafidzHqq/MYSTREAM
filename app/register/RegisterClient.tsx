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
        <div className="glass rounded-3xl border border-white/8 p-8 max-w-md w-full text-center shadow-card">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-display font-bold text-text-primary mb-2">Registrasi Berhasil!</h2>
          <p className="text-text-muted text-sm mb-6">
            Cek email kamu untuk verifikasi akun, lalu login untuk menikmati QQ.
          </p>
          <Link href="/login"
            className="inline-flex items-center justify-center w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-glow transition-all">
            Masuk Sekarang
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-accent-blue/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-accent-purple/10 blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center overflow-hidden relative bg-transparent mx-auto">
              <Image src="/logo.jpg" alt="QQ" fill className="object-contain" unoptimized />
            </div>
          </Link>
          <p className="text-text-muted text-sm mt-2">Buat akun gratis dan mulai nonton</p>
        </div>

        <div className="glass rounded-3xl border border-white/8 p-8 shadow-card">
          <h1 className="text-2xl font-display font-bold text-text-primary mb-6">Daftar Akun</h1>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                  placeholder="username_kamu"
                  className="w-full pl-10 pr-4 py-3 bg-bg-card border border-white/8 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="nama@email.com"
                  className="w-full pl-10 pr-4 py-3 bg-bg-card border border-white/8 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/50 transition-all" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  required minLength={6} placeholder="Min. 6 karakter"
                  className="w-full pl-10 pr-12 py-3 bg-bg-card border border-white/8 rounded-xl text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-purple/50 transition-all" />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-primary text-white font-semibold hover:shadow-glow transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Memproses...</> : "Daftar Sekarang"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-text-muted text-sm">
              Sudah punya akun?{" "}
              <Link href="/login" className="text-accent-purple hover:underline font-medium">Masuk</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
