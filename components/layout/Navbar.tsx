"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Sparkles } from "lucide-react";
import Image from "next/image";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";

const navLinks: { href: string; label: string; badge?: boolean }[] = [
  { href: "/", label: "Beranda" },
  { href: "/ongoing", label: "Ongoing", badge: true },
  { href: "/completed", label: "Completed" },
  { href: "/top-rating", label: "Top 70" },
  { href: "/favorites", label: "Favorit" },
  { href: "/genre", label: "Genre" },
  { href: "/history", label: "History" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "glass border-b border-white/5 py-2 shadow-lg" : "bg-transparent py-4"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center group gap-3">
              <div className="relative w-10 h-10 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent-purple/50 transition-colors shadow-glow-blue">
                <Image src="/logo.jpg" alt="QQ" fill className="object-cover" unoptimized />
              </div>
              <span className="text-xl md:text-2xl font-black tracking-tight text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-accent-purple group-hover:to-accent-blue transition-all">
                QQ
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1 bg-white/5 border border-white/10 rounded-full px-2 py-1.5 backdrop-blur-md">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-4 py-2 text-sm font-semibold rounded-full transition-all relative group",
                    pathname === link.href
                      ? "text-white bg-white/10"
                      : "text-text-secondary hover:text-white hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute 1 top-2 -right-1 w-2 h-2 rounded-full bg-accent-blue shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Profile/Login Button */}
              {user ? (
                <div className="relative group/profile">
                  <button className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                    <img 
                      src={user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id} 
                      alt="Profile" 
                      className="w-7 h-7 rounded-full bg-bg-secondary"
                    />
                    <span className="text-xs font-semibold text-text-secondary hidden sm:block">
                      {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                  </button>
                  <div className="absolute top-full right-0 mt-2 w-48 bg-bg-secondary border border-white/10 rounded-xl shadow-2xl opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 p-2">
                    <Link href="/history" className="block px-3 py-2 text-sm text-text-primary hover:bg-white/5 rounded-lg mb-1">Riwayat Nonton</Link>
                    <button 
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 rounded-lg"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="px-4 py-1.5 rounded-full text-sm font-semibold bg-accent-blue/10 text-accent-blue hover:bg-accent-blue hover:text-white transition-colors border border-accent-blue/20 hidden sm:block">
                  Masuk
                </Link>
              )}

              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 rounded-full text-text-secondary hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                aria-label="Cari anime"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2.5 rounded-xl text-text-secondary hover:text-white hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={clsx(
          "lg:hidden absolute top-full left-0 right-0 bg-bg-primary/95 backdrop-blur-xl border-b border-white/5 transition-all duration-300 overflow-hidden",
          mobileOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="px-4 py-4 flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  "flex items-center justify-between px-4 py-3 rounded-xl text-base font-semibold transition-all",
                  pathname === link.href
                    ? "bg-white/10 text-white border border-white/5"
                    : "text-text-secondary hover:bg-white/5 hover:text-white"
                )}
              >
                {link.label}
                {link.badge && (
                  <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-accent-blue bg-accent-blue/10 px-2 py-1 rounded-md">
                    <Sparkles className="w-3 h-3" /> Baru
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-bg-primary/80 backdrop-blur-xl flex items-start justify-center pt-24 px-4 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <form onSubmit={handleSearch} className="w-full max-w-2xl relative animate-slide-up">
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-accent-purple to-accent-blue rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <div className="relative flex items-center bg-bg-secondary border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
                <Search className="w-6 h-6 text-text-muted ml-5" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari judul anime favoritmu..."
                  className="w-full px-4 py-5 bg-transparent text-white placeholder:text-text-muted text-lg focus:outline-none"
                />
                <button
                  type="submit"
                  className="px-6 py-3 mr-2 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl transition-colors backdrop-blur-md border border-white/5"
                >
                  Cari
                </button>
              </div>
            </div>
            
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute -top-12 right-0 p-2 text-text-muted hover:text-white bg-bg-secondary/50 rounded-full backdrop-blur-md border border-white/10 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
