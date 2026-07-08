"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X, Tv } from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/ongoing", label: "Ongoing" },
  { href: "/completed", label: "Completed" },
  { href: "/schedule", label: "Jadwal" },
  { href: "/genre", label: "Genre" },
  { href: "/donghua", label: "Donghua" },
  { href: "/nekopoi", label: "18+", badge: true },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

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
          isScrolled
            ? "glass border-b border-white/5"
            : "bg-gradient-to-b from-black/80 to-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center shadow-glow group-hover:shadow-glow-blue transition-all duration-300">
                <Tv className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-bold text-xl gradient-text">AniStream</span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 relative",
                    link.badge && "text-pink-400 hover:text-pink-300",
                    pathname === link.href
                      ? link.badge
                        ? "bg-pink-500/20 text-pink-400"
                        : "bg-accent-purple/20 text-accent-purple"
                      : !link.badge && "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
                aria-label="Cari anime"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden glass border-t border-white/5 animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all",
                    link.badge && "text-pink-400",
                    pathname === link.href
                      ? link.badge
                        ? "bg-pink-500/20 text-pink-400"
                        : "bg-accent-purple/20 text-accent-purple"
                      : !link.badge && "text-text-secondary hover:text-text-primary hover:bg-white/5"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <form onSubmit={handleSearch} className="w-full max-w-2xl animate-slide-up">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari anime, genre, studio..."
                className="w-full pl-12 pr-16 py-4 bg-bg-overlay border border-white/10 rounded-2xl text-text-primary placeholder:text-text-muted text-lg focus:outline-none focus:border-accent-purple/50 transition-all"
              />
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-primary transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-center text-text-muted text-sm mt-3">
              Tekan <kbd className="px-2 py-0.5 rounded bg-white/10 text-xs">Enter</kbd> untuk mencari
            </p>
          </form>
        </div>
      )}
    </>
  );
}
