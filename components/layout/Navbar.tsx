"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { clsx } from "clsx";
import { createClient } from "@/lib/supabase/client";

const navLinks: { href: string; label: string; }[] = [
  { href: "/", label: "Beranda" },
  { href: "/ongoing", label: "Ongoing" },
  { href: "/completed", label: "Completed" },
  { href: "/top-rating", label: "Top 70" },
  { href: "/schedule", label: "Jadwal" },
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
    const handleScroll = () => setIsScrolled(window.scrollY > 0);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
      if (e.key === "Escape" && searchOpen) {
        setSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full",
          isScrolled
            ? "bg-[#0A0D14]/65 backdrop-blur-[24px] backdrop-saturate-[150%] border-b border-white/[0.08]"
            : "bg-gradient-to-b from-black/50 to-transparent border-b border-transparent"
        )}
      >
        {/* Apple-style container: max width large, standard padding */}
        <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 gap-4">
            
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0 group">
              <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl-full overflow-hidden">
                <Image src="/logo.jpg" alt="AniStream" fill className="object-cover" unoptimized />
              </div>
              <span className="font-extrabold text-[17px] tracking-tight text-white/90 group-hover:text-white transition-colors hidden sm:inline-block">
                ANISTREAM
              </span>
            </Link>

            {/* Desktop Nav Links (Centered aesthetically) */}
            <div className="hidden lg:flex items-center justify-center flex-1 gap-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={clsx(
                      "text-[14px] font-medium tracking-wide transition-colors duration-200",
                      isActive
                        ? "text-white"
                        : "text-white/60 hover:text-white"
                    )}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center justify-end gap-5 shrink-0">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-white/70 hover:text-white transition-colors active:opacity-50"
                aria-label="Cari anime"
              >
                <Search className="w-5 h-5" strokeWidth={2} />
              </button>

              {/* Profile / Login */}
              {user ? (
                <div className="relative group/profile hidden sm:block">
                  <button className="flex items-center gap-2.5 outline-none">
                    <span className="text-[14px] font-medium text-white/70 group-hover/profile:text-white transition-colors">
                      {user.user_metadata?.full_name?.split(' ')[0] || user.email?.split('@')[0]}
                    </span>
                    <img 
                      src={user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id} 
                      alt="Profile" 
                      className="w-7 h-7 rounded-xl-full object-cover border border-white/[0.08]"
                    />
                  </button>
                  {/* Dropdown (Apple style menu) */}
                  <div className="absolute top-full right-0 mt-3 w-52 bg-[#1C1C1E]/80 backdrop-blur-[40px] backdrop-saturate-[200%] border border-white/[0.08] rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] opacity-0 invisible group-hover/profile:opacity-100 group-hover/profile:visible transition-all duration-200 p-1 z-50">
                    <Link href="/history" className="block px-4 py-2.5 text-[14px] font-medium text-white/90 hover:bg-white/10 rounded-xl transition-colors">Riwayat Nonton</Link>
                    <Link href="/favorites" className="block px-4 py-2.5 text-[14px] font-medium text-white/90 hover:bg-white/10 rounded-xl transition-colors">Favorit Saya</Link>
                    <div className="h-px w-full bg-white/[0.08] my-1" />
                    <button 
                      onClick={async () => {
                        const supabase = createClient();
                        await supabase.auth.signOut();
                      }}
                      className="w-full text-left px-4 py-2.5 text-[14px] font-medium text-[#FF453A] hover:bg-white/10 rounded-xl transition-colors"
                    >
                      Keluar
                    </button>
                  </div>
                </div>
              ) : (
                <Link href="/login" className="px-4 py-1.5 rounded-xl-full text-[14px] font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/[0.08] hidden sm:block">
                  Masuk
                </Link>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden text-white/70 hover:text-white transition-colors active:opacity-50"
              >
                <Menu className="w-6 h-6" strokeWidth={2} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu (Apple style sliding drawer) */}
        <div className={clsx(
          "lg:hidden fixed inset-0 top-[56px] sm:top-[64px] bg-[#000000]/70 backdrop-blur-[30px] backdrop-saturate-[180%] transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)] z-40 overflow-hidden",
          mobileOpen ? "opacity-100 visible translate-y-0" : "opacity-0 invisible -translate-y-4"
        )}>
          <div className="px-6 py-8 flex flex-col h-full overflow-y-auto">
            {/* Header (iOS style large title) */}
            <div className="text-[28px] font-bold text-white mb-6">Menu</div>

            {user && (
              <div className="flex items-center gap-4 p-4 mb-6 rounded-xl bg-white/[0.05] border border-white/[0.05]">
                <img src={user.user_metadata?.avatar_url || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + user.id} alt="Profile" className="w-12 h-12 rounded-xl-full border border-white/10" />
                <div>
                  <div className="text-white text-[16px] font-semibold">{user.user_metadata?.full_name || "Pengguna"}</div>
                  <div className="text-white/50 text-[13px]">{user.email}</div>
                </div>
              </div>
            )}
            
            <div className="flex flex-col gap-0 border-t border-white/[0.08]">
              {[...navLinks, {href: "/history", label: "Riwayat Nonton"}, {href: "/favorites", label: "Favorit Saya"}].map(link => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="px-2 py-4 text-[17px] font-medium text-white/90 hover:text-white border-b border-white/[0.08] flex justify-between items-center transition-colors active:bg-white/5"
                >
                  {link.label}
                  <span className="text-white/20">›</span>
                </Link>
              ))}
            </div>

            {user ? (
              <button 
                onClick={async () => {
                  const supabase = createClient();
                  await supabase.auth.signOut();
                  setMobileOpen(false);
                }}
                className="mt-8 py-4 rounded-xl text-center text-[17px] font-semibold text-[#FF453A] bg-white/[0.05] active:bg-white/10 transition-colors"
              >
                Keluar
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-8 py-4 rounded-xl text-center text-[17px] font-semibold text-black bg-white active:bg-gray-200 transition-colors"
              >
                Masuk ke Akun
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Search Modal (iOS style overlay) */}
      <div 
        className={clsx(
          "fixed inset-0 z-[110] bg-black/50 backdrop-blur-[20px] backdrop-saturate-[180%] flex items-start justify-center pt-24 px-4 sm:px-0 transition-all duration-300",
          searchOpen ? "opacity-100 visible" : "opacity-0 invisible"
        )}
        onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
      >
        <div className={clsx(
          "w-full max-w-2xl relative transition-all duration-400 ease-[cubic-bezier(0.32,0.72,0,1)]",
          searchOpen ? "scale-100 translate-y-0 opacity-100" : "scale-95 -translate-y-8 opacity-0"
        )}>
          <form onSubmit={handleSearch} className="flex flex-col gap-4">
            <div className="flex items-center bg-white/[0.08] border border-white/[0.1] rounded-xl p-2 px-4 shadow-[0_8px_32px_rgba(0,0,0,0.3)] backdrop-blur-3xl">
              <Search className="w-5 h-5 text-white/50 shrink-0" strokeWidth={2} />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Pencarian..."
                className="w-full bg-transparent text-white placeholder:text-white/40 text-[17px] px-3 py-2.5 focus:outline-none"
              />
              <button 
                type="button" 
                onClick={() => setSearchOpen(false)} 
                className="shrink-0 p-1.5 bg-white/10 hover:bg-white/20 rounded-xl-full text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>
            <div className="text-center">
              <span className="text-white/40 text-[13px] font-medium tracking-wide">TEKAN ENTER UNTUK MENCARI</span>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
